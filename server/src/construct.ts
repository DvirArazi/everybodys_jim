import chalk from "chalk";
import { Socket } from "socket.io";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller, newPersonality } from "./rooms";
import { ClientData, ClientToServerEvents, Entry, InterServerEvents, Room, ServerToClientEvents, SocketData, St1Data } from "./shared/types";
import { errMsg } from "./shared/utils";

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

export const newPersonality0 = (socket: ServerSocket, room: Room) => {
    if (room.stage == 1) {
        socket.emit("construct", {
            type: "Message",
            message: `Can't connect to room ${room.roomcode}. Game is already in progress :/`
        });
        return;
    }
    
    connectToRoom(socket.id, room);
    
    socket.emit("addEntry", {
        id: socket.id,
        roomcode: room.roomcode,
        role: {type: "Personality", name: ""}
    });
    socket.emit("construct", {type: "Ps0Data", ps0Data: {roomcode: room.roomcode, cardData: undefined}});

    return true;
}

export const newStoryteller1 = (socket: ServerSocket, st1Data: St1Data) => {
    let room = getRoomByStoryteller(socket.id);
    if (room == undefined) {
        errMsg("Room could not be found.");
        return;
    }
    if (st1Data.pers.length < 1) {
        errMsg("No complete personalities were sent from the client.");
        return;
    }

    room.stage = 1;
    room.personalities = [];
    for (let i = 0; i < st1Data.pers.length; i++) {
        let per = st1Data.pers[i];
        room.personalities.push({
            id: per.id,
            cardData: per.cardData,
            connected: true,
            stage: 1,
            records: [],
        });
        io.to(per.id).emit("construct", {type: "Ps1Data", ps1Data: {
            cardData: per.cardData,
            records: []
        }, roomcode: room.roomcode});
    }

    socket.emit("construct", {type: "St1Data", st1Data});
}

export const reconnectStoryteller = (socket: ServerSocket, entry: Entry) => {
    let room = getRoomByRoomcode(entry.roomcode);
    if (room == undefined) {
        errMsg("Room could not be found.");
        return;
    }

    // room.storyteller.id = socket.id;
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
                requests: room.requests,
                pers: room.personalities
            }});
            break;
        }
        case 2: {
            if (room.winnerCount == undefined) {
                errMsg("winnerCount is undefined.");
                return;
            }

            socket.emit("construct", {type: "EndGame", 
                pers: room.personalities,
                winnerCount: room.winnerCount,
                addButton: true
            });
            break;
        }
        default: {
            errMsg(`Invalid room stage: ${room.stage}`);
        }
    }
}

export const reconnectPersonality = (socket: ServerSocket, entry: Entry) => {
    let value = getRoomByPersonality(entry.id);
    if (value == undefined) {
        errMsg("Could not find room.");
        return;
    }
    let {room, personality} = value;

    // personality.id = socket.id;
    personality.connected = true;

    io.to(room.storyteller.id).emit("personality1Reconnected", personality.id, socket.id);
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
                errMsg("Personality tried to reconnect with non-1 stage.");
                return;
            }

            socket.emit("construct", {type: "Ps1Data", ps1Data: {
                cardData: personality.cardData,
                records: personality.records
            }, roomcode: room.roomcode})

            io.to(room.storyteller.id).emit("closeModal");
            room.personalities.forEach(per=>io.to(per.id).emit("closeModal"));
            break;
        }
        case 2: {
            if (room.winnerCount == undefined) {
                errMsg("winnerCount is undefined.");
                return;
            }

            socket.emit("construct", {type: "EndGame", 
                pers: room.personalities,
                winnerCount: room.winnerCount,
                addButton: false
            });
            break;
        }
        default: {
            errMsg(`Invalid room stage: ${room.stage}`);
        }
    }
}