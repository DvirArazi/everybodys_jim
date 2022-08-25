import chalk from "chalk";
import { Socket } from "socket.io";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller } from "./rooms";
import { ClientData, ClientToServerEvents, Entry, InterServerEvents, ServerToClientEvents, SocketData, St1Data } from "./shared/types";

type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const newStoryteller = (socket: ServerSocket) => {
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

export const newPersonality = (socket: ServerSocket, roomcode: string): boolean => {
    if (connectToRoom(socket.id, roomcode)) {
        socket.emit("addEntry", {
            id: socket.id,
            roomcode: roomcode,
            role: {type: "Personality", name: ""}
        });
        socket.emit("construct", {type: "Ps0Data", ps0Data: {roomcode, cardData: undefined}});

        return true;
    } else {
        return false;
    }
}

export const newStoryteller1 = (socket: ServerSocket, st1Data: St1Data) => {
    let room = getRoomByStoryteller(socket.id);
    if (room == undefined) {
        console.log(chalk.redBright("ERROR: ") + "Room could not be found.");
        return;
    }

    socket.emit("construct", {type: "St1Data", st1Data});

    for(let i = 0; i < room.personalities.length; i++) {
        let per = room.personalities[i];
        io.to(per.id).emit("construct", {type: "Ps1Data", ps1Data: room.personalities[i].cardData});
    }
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

    socket.emit("construct", {type: "St0Data", st0Data: {
        roomcode: entry.roomcode,
        personalities: room.personalities.filter((personality=>personality.connected))
    }});
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

    io.to(room.storyteller.id).emit("personalityConnected", socket.id, personality.cardData);
    socket.emit("construct", {type: "Ps0Data", ps0Data: {
        roomcode: entry.roomcode,
        cardData: personality.cardData
    }});
}