import chalk, { Chalk } from "chalk";
import { Console } from "console";
import { constUndefined } from "fp-ts/lib/function";
import { Socket } from "socket.io";
import { io } from ".";
import { Card0 } from "../../client/src/game/card0";
import { Attribute } from "../../client/src/game/card/column/attribute";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller, rooms, updateCard } from "./rooms";
import { AbilityData, ClientToServerEvents, Entry, GoalData, InterServerEvents, Personality, Room, ServerToClientEvents, SocketData, Storyteller } from "./types";

type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export let handler = () => {
    console.log(rooms);

    process.on('SIGTERM', ()=>{

    });

    io.on("connection", (socket) => {

        socket.on("init", (role, entries)=>{
            //find and send entries to delete + find potential entries
            //========================================================
            let potentialEntries = [];
            let entryIsToDelete = [];
            for (let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                let room = getRoomByStoryteller(entry.id);
                if (room != undefined) {
                    if (!room.storyteller.connected) {
                        potentialEntries.push(entry);
                    }
                    continue;
                }
                let value = getRoomByPersonality(entry.id);
                if (value != undefined) {
                    let {personality} = value;
                    if (!personality.connected) {
                        potentialEntries.push(entry);
                    }
                    continue;
                }
                entryIsToDelete.push(i);
            }

            if (entryIsToDelete.length > 0) {
                socket.emit("deleteEntries", entryIsToDelete);
            }

            //find relevant entries
            //=====================
            let relevantEntries = [];
            
            for (let entry of potentialEntries) {
                if (role.type == entry.role.type &&
                    ((role.type == "Personality" ?
                      role.roomcode == entry.roomcode : true)
                    )
                ) {
                    relevantEntries.push(entry);
                }
            }

            //call client based on relevant entries
            //=====================================
            if (role.type == "NewUser" || relevantEntries.length > 1) {
                socket.emit("createNewUser", potentialEntries);
            } else if (relevantEntries.length == 0) {
                switch(role.type) {
                    case "Storyteller": { newStoryteller(socket); break; }
                    case "Personality": { if(!newPersonality(socket, role.roomcode)) { 
                            socket.emit("createNewUser", potentialEntries);
                        }
                        break;
                    }
                }
            } else if (relevantEntries.length == 1) {
                switch(role.type) {
                    case "Storyteller": { reconnectStoryteller(socket, relevantEntries[0]); break; }
                    case "Personality": { reconnectPersonality(socket, relevantEntries[0]); break; }
                }
            }
        });

        socket.on("construct", (role)=>{
            switch (role.type) {
                case "Storyteller": {
                    newStoryteller(socket);
                    break;
                }
                case "Personality": {
                    newPersonality(socket, role.roomcode);
                    break;
                }
                default: {
                    console.log(chalk.red("ERROR: ") + "No relevant role supplied.");
                }
            }
        });

        socket.on("reconnect", (entry)=>{
            if (entry.role.type == "Storyteller") {
                    reconnectStoryteller(socket, entry);
            } else if (entry.role.type == "Personality") {
                    reconnectPersonality(socket, entry);
            } else {
                console.log(chalk.red("ERROR: ") + "No relevant entry supplemented!");    
            }
        });

        socket.on("cardUpdatedPts", (cardChange)=>{
            let value = getRoomByPersonality(socket.id);

            if (value == undefined) {
                console.log(chalk.red("ERROR: ") + "Couldn't find room.");
                return;
            }

            let {room, personality} = value;
            updateCard(room, personality, cardChange);

            io.to(room.storyteller.id).emit("cardUpdatedPts", socket.id, cardChange);
        });

        socket.on("cardUpdatedStp", (personalityId, cardChange)=>{
            let room = getRoomByStoryteller(socket.id);

            if (room == undefined) {
                console.log(chalk.red("ERROR: ") + "Couldn't find room.");
                return;
            }

            let personality = room.personalities.find((personality)=>personality.id == personalityId);
            if (personality == undefined) {
                console.log(chalk.red("ERROR: ") + "Couldn't find personality in room.");
                return;
            }

            updateCard(room, personality, cardChange);

            io.to(personalityId).emit("cardUpdatedStp", cardChange);
        });

        socket.on("disconnect", (reason)=>{
            let room = getRoomByStoryteller(socket.id);
            if (room != undefined) {
                
                room.storyteller.connected = false;

                console.log(
                    `Storyteller ` + chalk.yellow(socket.id) + ` of room ` + chalk.yellow(room.roomcode) + ` disconnected\n` +
                    ` reason: ${reason}`
                );

                return;
            }

            let value = getRoomByPersonality(socket.id);
            if (value != undefined) {
                let personality;
                ({room, personality} = value);
                
                io.to(room.storyteller.id).emit("personalityDisconnected", socket.id);

                personality.connected = false;

                console.log(
                    `Peronality ` + chalk.yellow(socket.id) + ` of room ` + `${room.roomcode}` + ` disconnected\n` +
                    ` reason: ${reason}`
                );

                return;
            }

            console.log(
                `User ` + chalk.yellow(socket.id) + ` disconnected\n` +
                ` reason: ${reason}`
            );
        });
    });
}

const newStoryteller = (socket: ServerSocket) => {
    let roomcode = createRoom(socket.id);
    socket.emit("addEntry", {
        id: socket.id,
        roomcode: roomcode,
        role: {type: "Storyteller"}
    })
    socket.emit("construct", {type: "St0Data", st0data: {
        roomcode: roomcode,
        personalities: undefined
    }});
}

const newPersonality = (socket: ServerSocket, roomcode: string): boolean => {
    if (connectToRoom(socket.id, roomcode)) {
        socket.emit("addEntry", {
            id: socket.id,
            roomcode: roomcode,
            role: {type: "Personality", name: ""}
        });
        socket.emit("construct", {type: "Ps0Data", ps0data: {roomcode, cardData: undefined}});

        return true;
    } else {
        return false;
    }
}

const reconnectStoryteller = (socket: ServerSocket, entry: Entry) => {
    let room = getRoomByRoomcode(entry.roomcode);
    if (room == undefined) {
        console.log(chalk.redBright("ERROR: ") + "Room could not be found.");
        return;
    }

    room.storyteller.id = socket.id;
    room.storyteller.connected = true;
    socket.emit("updateEntryId", entry.id);

    socket.emit("construct", {type: "St0Data", st0data: {
        roomcode: entry.roomcode,
        personalities: room.personalities.filter((personality=>personality.connected))
    }});
}

const reconnectPersonality = (socket: ServerSocket, entry: Entry) => {
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
    socket.emit("construct", {type: "Ps0Data", ps0data: {
        roomcode: entry.roomcode,
        cardData: personality.cardData
    }});
}