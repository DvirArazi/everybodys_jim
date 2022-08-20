import chalk, { Chalk } from "chalk";
import { Console } from "console";
import { constUndefined } from "fp-ts/lib/function";
import { Socket } from "socket.io";
import { io } from ".";
import { Card } from "../../client/src/game/card";
import { Attribute } from "../../client/src/game/card/column/attribute";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller, rooms, updateCard } from "./rooms";
import { AbilityData, ClientToServerEvents, Entry, GoalData, InterServerEvents, Personality, Role, Room, ServerToClientEvents, SocketData, Storyteller } from "./types";

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
                if (role.type == entry.roleType &&
                    ((role.type == "Storyteller") ||
                     (role.type == "Personality" &&
                      role.roomcode == entry.roomcode)
                    )
                ) {
                    relevantEntries.push(entry);
                }
            }

            //call client based on relevant entries
            //=====================================
            if (role.type == "Storyteller") {
                if (relevantEntries.length == 0) {
                    newStoryteller(socket);
                } else if (relevantEntries.length == 1) {
                    let room = getRoomByStoryteller(relevantEntries[0].id)!;
                    room.storyteller.id = socket.id;
                    socket.emit("updateEntry", relevantEntries[0].id, socket.id);
                    socket.emit("construct", {type: "St0Data", st0data: {
                            roomcode: room.roomcode,
                            personalities: room.personalities
                        }}
                    );
                }
            } else if (role.type == "Personality") {
                if (relevantEntries.length == 0) {
                    newPersonality(socket, role.roomcode);
                } else if (relevantEntries.length == 1) {
                    let {room, personality} = getRoomByPersonality(relevantEntries[0].id)!;
                    personality.id = socket.id;
                    console.log(getRoomByPersonality(socket.id)?.room.roomcode, room.roomcode);
                    io.to(room.storyteller.id).emit("personalityConnected", socket.id, personality.cardData);
                    socket.emit("updateEntry", relevantEntries[0].id, socket.id);
                    socket.emit("construct", {type: "Ps0Data", ps0data: {roomcode: role.roomcode, cardData: personality.cardData}})
                }
            } else {
                socket.emit("createNewUser", potentialEntries);
            }
        });

        socket.on("construct", (role)=>{
            if (role.type == "Storyteller") {
                newStoryteller(socket);
            } else if (role.type == "Personality") {
                newPersonality(socket, role.roomcode);
            } else {
                console.log(chalk.red("ERROR: ") + "No relevant role supplemented!");    
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
                    `\treason: ${reason}`
                );

                console.log("rooms after disconnect: ");
                console.log(rooms);

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

const newStoryteller = (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    let roomcode = createRoom(socket.id);
    socket.emit("addEntry", {
        id: socket.id,
        roomcode: roomcode,
        roleType: "Storyteller"
    })
    socket.emit("construct", {type: "St0Data", st0data: {
            roomcode: roomcode,
            personalities: undefined
        }}
    );
}

const newPersonality = (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, roomcode: string) => {
    if (connectToRoom(socket.id, roomcode)) {
        socket.emit("addEntry", {
            id: socket.id,
            roomcode: roomcode,
            roleType: "Personality"
        });
        socket.emit("construct", {type: "Ps0Data", ps0data: {roomcode, cardData: undefined}});
    } else {
        socket.emit("createNewUser", []);
    }
}