import chalk, { Chalk } from "chalk";
import { Socket } from "socket.io";
import { io } from ".";
import { TIME_TO_VOTE } from "../../client/src/shared/globals";
import { errMsg, randRange } from "../../client/src/shared/utils";
import { newPersonality0, newStoryteller0, newStoryteller1, reconnectPersonality as reconnectPersonality0, reconnectStoryteller as reconnectStoryteller0 } from "./construct";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller, rooms, updateCard } from "./rooms";
import { ClientToServerEvents, Entry, GoalData, InterServerEvents, Personality, Room, ServerToClientEvents, SocketData, Storyteller } from "./shared/types";

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
                    case "Storyteller": { newStoryteller0(socket); break; }
                    case "Personality": { 
                        let room = getRoomByRoomcode(role.roomcode);
                        if (room != undefined) {
                            newPersonality0(socket, room);
                        } else {
                            socket.emit("createNewUser", potentialEntries);
                        }
                            //make connectToRoom accept a room parameter instead
                            //check here room exists, if not, create new user
                            //for now, leave the message construction in newPersonality0
                        break;
                    }
                }
            } else if (relevantEntries.length == 1) {
                switch(role.type) {
                    case "Storyteller": { reconnectStoryteller0(socket, relevantEntries[0]); break; }
                    case "Personality": { reconnectPersonality0(socket, relevantEntries[0]); break; }
                }
            }
        });

        socket.on("construct", (clientData)=>{
            switch (clientData.type) {
                case "St0Data": {
                    newStoryteller0(socket);
                    break;
                }
                case "Ps0Data": {
                    let room = getRoomByRoomcode(clientData.ps0Data.roomcode);
                    if (room == undefined) {
                        console.log(chalk.red("ERROR: ") + "Room does not exist.");
                        return;
                    }
                    newPersonality0(socket, room);
                    break;
                }
                case "St1Data": {
                    newStoryteller1(socket, clientData.st1Data);
                    break;
                }
                default: {
                    console.log(chalk.red("ERROR: ") + "No relevant role supplied.");
                }
            }
        });

        socket.on("reconnect", (entry)=>{
            switch (entry.role.type) {
                case "Storyteller": {
                    reconnectStoryteller0(socket, entry);
                    break;
                }
                case "Personality": {
                    reconnectPersonality0(socket, entry);
                    break;
                }
                default: {
                    console.log(chalk.red("ERROR: ") + "No relevant entry supplemented.");
                }
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

        socket.on("wheelSet", (failRatio)=>{
            let room = getRoomByStoryteller(socket.id);
            if (room == undefined) {
                console.log(chalk.red("ERROR: ") + "Couldn't find room.");
                return;
            }

            room.failRatio = failRatio;

            let pers = room.personalities.map((per)=>{return {id: per.id, name: per.cardData.name};});

            io.to(room.storyteller.id).emit("wheelSet", pers, failRatio);
            io.to(room.personalities[0].id).emit("spinModal", pers, failRatio);
            for (let i = 1; i < room.personalities.length; i++) {
                let perId = room.personalities[i].id;
                io.to(perId).emit("wheelSet", pers, failRatio);
            }

            room.timeout = setTimeout(()=>{
                if (room == undefined) {
                    console.log(chalk.red("ERROR: ") + "Couldn't find room.");
                    return;
                }

                for (let i = 1; i < room.personalities.length; i++) {
                    let perId = room.personalities[i].id;
                    io.to(perId).emit("disableVote");
                    io.to(room.storyteller.id).emit("enableSpin");
                    room.personalities.forEach(per=>io.to(per.id).emit("enableSpin"));
                }

            }, TIME_TO_VOTE * 1000);
        });

        socket.on("vote", (approve)=>{
            let value = getRoomByPersonality(socket.id);
            if (value == undefined) {
                console.log(chalk.redBright("ERROR: ") + "Room could not be found.");
                return;
            }
            let {room, personality} = value;

            personality.vote = approve;

            io.to(room.storyteller.id).emit("vote", personality.id, approve);
            room.personalities.forEach((per)=>io.to(per.id).emit("vote", personality.id, approve));
            for (let i = 0; i < room.personalities.length; i++) {
                let perId = room.personalities[i].id;
                io.to(perId).emit("vote", personality.id, approve);
            }

            if (room.personalities.every(per=>per.vote != undefined)) {
                if (room.timeout != undefined) {
                    clearTimeout(room.timeout);
                    io.to(room.storyteller.id).emit("enableSpin");
                    room.personalities.forEach(per=>io.to(per.id).emit("enableSpin"));
                }
                io.to(room.personalities[0].id).emit("enableSpin");
            }
        });

        socket.on("spinWheel", ()=>{
            let value = getRoomByPersonality(socket.id);
            if (value == undefined) {
                errMsg("Could not find room by personality ID.");
                return;
            }
            let {room} = value;
            if (room.failRatio == undefined) {
                errMsg("'failRatio' is undefined.");
                return;
            }

            let alpha = 2*Math.PI * (1-room.failRatio) * (1/room.personalities.length);
            let dest = Math.random() * 2*Math.PI;
            let rounds = Math.floor(randRange(4, 8)) * 2*Math.PI;
            let chosenI = Math.floor((2*Math.PI - dest)/alpha);
            let chosen = room.personalities[chosenI];
            let success = chosen != undefined && chosen.vote == true;

            io.to(room.storyteller.id).emit("spinWheel", dest + rounds, success);
            room.personalities.forEach(per=>io.to(per.id).emit("spinWheel", dest + rounds, success));
        
            if (!success || room.consecutiveSuccesses >= 3) {
                room.consecutiveSuccesses = 0;
                room.personalities = [room.personalities.at(-1)!].concat(room.personalities.slice(0, -1));
                io.to(room.storyteller.id).emit("reorderPersonalities", room.personalities);
            } else {
                room.consecutiveSuccesses += 1;
            }
        });

        socket.on("continueGame", ()=>{
            let room = getRoomByStoryteller(socket.id);
            if (room == undefined) {
                errMsg("Could not find room.");
                return;
            }

            room.failRatio = undefined;
            room.personalities.forEach(per=>per.vote = undefined);

            io.to(room.storyteller.id).emit("continueGame");
            room.personalities.forEach(per=>io.to(per.id).emit("continueGame"));
        });

        socket.on("grantScore", (perId, score, description, reason)=>{
            let value = getRoomByPersonality(socket.id);
            if (value == undefined) {
                errMsg("Room could not be found.");
                return;
            }
            let {personality} = value;

            personality.records.push({
                accepted: true,
                score,
                description,
                reason
            });
            personality.cardData.score += score;

            io.to(personality.id).emit("grantScore", score, description, reason);
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