import chalk from "chalk";
import { Socket } from "socket.io";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller, newPersonality } from "./rooms";
import { ClientData, ClientToServerEvents, Entry, InterServerEvents, ServerToClientEvents, SocketData, St1Data } from "./shared/types";

type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const newStoryteller0 = (socket: ServerSocket) => {
    let roomcode = createRoom(socket.id);
    socket.emit("addEntry", {
        id: socket.id,
        roomcode: roomcode,
        role: {type: "Storyteller"}
    })
    socket.emit("construct", {type: "St0Data", st0Data: {
        roomcode: roomcode,
        personalities: undefined
    }});
}

export const newPersonality0 = (socket: ServerSocket, roomcode: string): boolean => {
    let room = getRoomByRoomcode(roomcode);
    if (room == undefined) {
        console.log(chalk.redBright("ERROR: ") + "Room could not be found.");
        return false;
    }
    if (room.stage == 1) {
        socket.emit("construct", {
            type: "Message",
            message: `Can't connect to room ${room.roomcode}. Game is already in progress :/`
        });
        return false;
    }
    if (!connectToRoom(socket.id, roomcode)) {
        return false;
    }
    
    socket.emit("addEntry", {
        id: socket.id,
        roomcode: roomcode,
        role: {type: "Personality", name: ""}
    });
    socket.emit("construct", {type: "Ps0Data", ps0Data: {roomcode, cardData: undefined}});

    return true;
}

export const newStoryteller1 = (socket: ServerSocket, st1Data: St1Data) => {
    let room = getRoomByStoryteller(socket.id);
    if (room == undefined) {
        console.log(chalk.redBright("ERROR: ") + "Room could not be found.");
        return;
    }
    if (st1Data.personalities.length < 1) {
        console.log(chalk.redBright("ERROR: ") + "No complete personalities were sent from the client.");
        return;
    }

    room.stage = 1;
    room.domi = st1Data.personalities[0].id;
    room.personalities = [];
    for (let per of st1Data.personalities) {
        room.personalities.push({
            id: per.id,
            cardData: per.cardData,
            connected: true,
            stage: 1
        });
        io.to(per.id).emit("construct", {type: "Ps1Data", ps1Data: per.cardData});
    }

    socket.emit("construct", {type: "St1Data", st1Data});
}

export const reconnectStoryteller = (socket: ServerSocket, entry: Entry) => {
    let room = getRoomByRoomcode(entry.roomcode);
    if (room == undefined) {
        console.log(chalk.redBright("ERROR: ") + "Room could not be found.");
        return;
    }

    room.storyteller.id = socket.id;
    room.storyteller.connected = true;
    socket.emit("updateEntryId", entry.id);

    switch (room.stage) {
        case 0: {
            socket.emit("construct", {type: "St0Data", st0Data: {
                roomcode: entry.roomcode,
                personalities: room.personalities.filter((personality=>personality.connected))
            }});
            break;
        }
        case 1: {
            socket.emit("construct", {type: "St1Data", st1Data: {
                personalities: room.personalities
            }});
            break;
        }
        default: {
            console.log(chalk.redBright("ERROR: ") + `Invalid room stage: ${room.stage}`);
        }
    }
}

export const reconnectPersonality = (socket: ServerSocket, entry: Entry) => {
    let value = getRoomByPersonality(entry.id);
    if (value == undefined) {
        console.log(chalk.redBright("ERROR: ") + "Could not find room.");
        return;
    }
    let {room, personality} = value;

    personality.id = socket.id;
    personality.connected = true;
    socket.emit("updateEntryId", entry.id);

    switch(room.stage) {
        case 0: {
            if (personality.stage != 0) {
                //IF THERE WAS AN ERROR IT WAS PROBABLY FROM HERE
                personality = newPersonality(personality.id, room.abilityCount, room.goalCount);
            }

            socket.emit("construct", {type: "Ps0Data", ps0Data: {
                roomcode: entry.roomcode,
                cardData: personality.cardData
            }});
            io.to(room.storyteller.id).emit("personalityConnected", socket.id, personality.cardData);
            break;
        }
        case 1: {
            if (personality.stage != 1) {
                console.log(chalk.redBright("ERROR: ") + "Personality tried to reconnect with non-1 stage.");
                return;
            }

            socket.emit("construct", {type: "Ps1Data", ps1Data: personality.cardData})
            break;
        }
        default: {
            console.log(chalk.redBright("ERROR: ") + `Invalid room stage: ${room.stage}`);
        }
    }
}