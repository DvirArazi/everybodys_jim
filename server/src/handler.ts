import chalk, { Chalk } from "chalk";
import { io } from ".";
import { TIME_TO_VOTE } from "./shared/globals";
import { compare, errMsg, randRange } from "./shared/utils";
import { newPersonality0, newStoryteller0, newStoryteller1, reconnectPersonality, reconnectStoryteller} from "./construct";
import { connectToDatabase, roomsCollection } from "./models/database.service";
import { getRoomByPersonality, getRoomByRoomcode, getRoomByStoryteller, retrieveRooms, rooms, updateCard } from "./rooms";
import { AbilityData, GoalData} from "./shared/types";
import { onExit } from "./onExit";
import fetch from "node-fetch";

export let handler = async () => {
    connectToDatabase()
    .then( async() => {
        console.log(chalk.greenBright("Retrieving rooms from the database."));
        await retrieveRooms();
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

    // setInterval(async ()=>{
    //     await fetch("https://everybodysjimapp.herokuapp.com/");
    // }, 50*60*1000);

    onExit((done: ()=>void)=>{
            console.log(chalk.greenBright("Saving rooms to the database."));
            rooms.forEach(room=>{
                room.storyteller.connected = false;
                room.personalities.forEach(per=>{
                    per.connected = false;
                });
            })

            roomsCollection.deleteMany({}).then(()=>{
                roomsCollection.insertMany(rooms).then((result)=>{
                    if (!result) { errMsg("Could not insert rooms to database."); }
                    done();
                });
            });
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

        socket.on("construct", (clientData)=>{
            switch (clientData.type) {
                case "St0Data": {
                    newStoryteller0(socket);
                    break;
                }
                case "Ps0Data": {
                    let room = getRoomByRoomcode(clientData.ps0Data.roomcode);
                    if (room == undefined) {
                        errMsg("Room does not exist.");
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
                    errMsg("No relevant role supplied.");
                }
            }
        });

        socket.on("reconnect", (entry)=>{
            switch (entry.role.type) {
                case "Storyteller": {
                    reconnectStoryteller(socket, entry);
                    break;
                }
                case "Personality": {
                    reconnectPersonality(socket, entry);
                    break;
                }
                default: {
                    errMsg("No relevant entry supplemented.");
                }
            }
        });

        socket.on("updatedEntryId", (oldId)=>{
            let roomSt = getRoomByStoryteller(oldId);
            if (roomSt != undefined) {
                roomSt.storyteller.id = socket.id;
                return;
            }

            let value = getRoomByPersonality(oldId);
            if (value != undefined) {
                value.personality.id = socket.id;
                return;
            }

            errMsg("oldId not found in rooms.");
        });

        socket.on("cardUpdatedPts", (cardChange)=>{
            let value = getRoomByPersonality(socket.id);

            if (value == undefined) {
                errMsg("Couldn't find room.");
                return;
            }

            let {room, personality} = value;
            updateCard(room, personality, cardChange);

            io.to(room.storyteller.id).emit("cardUpdatedPts", socket.id, cardChange);
        });

        socket.on("cardUpdatedStp", (personalityId, cardChange)=>{
            let room = getRoomByStoryteller(socket.id);
            if (room == undefined) {
                errMsg("Couldn't find room.");
                return;
            }

            let personality = room.personalities.find((personality)=>personality.id == personalityId);
            if (personality == undefined) {
                errMsg("Couldn't find personality in room.");
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
            room.personalities[0].vote = true;

            let pers = [];
            for (let per of room.personalities) {
                if (per.connected) {
                    pers.push({id: per.id, name: per.cardData.name});
                }
            }

            io.to(room.storyteller.id).emit("wheelSet", pers, failRatio);
            io.to(room.personalities[0].id).emit("spinModal", pers, failRatio);
            for (let i = 1; i < room.personalities.length; i++) {
                let perId = room.personalities[i].id;
                io.to(perId).emit("wheelSet", pers, failRatio);
            }

            room.timeout = setTimeout(()=>{
                if (room == undefined) {
                    errMsg("Couldn't find room.");
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
                errMsg("Room could not be found.");
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

            if (room.personalities.slice(1).every(per=>!per.connected || per.vote != undefined)) {
                if (room.timeout != undefined) {
                    clearTimeout(room.timeout);
                }
                io.to(room.storyteller.id).emit("enableSpin");
                room.personalities.forEach(per=>io.to(per.id).emit("enableSpin"));
                // io.to(room.personalities[0].id).emit("enableSpin");
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

            let connectedPerCount = 0;
            for (let per of room.personalities) {
                connectedPerCount += Number(per.connected);
            }

            let alpha = 2*Math.PI * (1-room.failRatio) * (1/connectedPerCount);
            let dest = Math.random() * 2*Math.PI;
            let rounds = Math.floor(randRange(4, 8)) * 2*Math.PI;
            let chosenI = Math.floor((2*Math.PI - dest)/alpha);
            let chosen = room.personalities[chosenI];
            let success = chosen != undefined && chosen.vote == true;

            io.to(room.storyteller.id).emit("spinWheel", dest + rounds, success);
            room.personalities.forEach(per=>io.to(per.id).emit("spinWheel", dest + rounds, success));

            if (!success || room.consecutiveSuccesses >= 3) {
                room.consecutiveSuccesses = 0;
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

            if (room.consecutiveSuccesses == 0) {
                do {
                    room.personalities = room.personalities.slice(1).concat(room.personalities[0]);
                } while (!room.personalities[0].connected && room.personalities.some(per=>per.connected));
                io.to(room.storyteller.id).emit("reorderPersonalities", room.personalities[0].id);
            }

            io.to(room.storyteller.id).emit("continueGame");
            room.personalities.forEach(per=>io.to(per.id).emit("continueGame"));
        });

        socket.on("grantScore", (perId, record)=>{
            let value = getRoomByPersonality(perId);
            if (value == undefined) {
                errMsg("Room could not be found.");
                return;
            }
            let {personality} = value;

            if (!record.accepted) {
                errMsg("Grant should be accepted");
                return;
            }

            personality.cardData.score += record.score;
            personality.records.push(record);

            io.to(personality.id).emit("grantScore", record);
        });

        socket.on("requestScore", (request)=>{
            let value = getRoomByPersonality(socket.id);
            if (value == undefined) {
                errMsg("Room could not be found.");
                return;
            }
            let {room, personality} = value;

            room.requests.push({
                perId: personality.id,
                ...request
            })

            io.to(room.storyteller.id).emit("requestScore", 
                personality.id,
                request
            );
        });

        socket.on("responseScore", (perId, record)=>{
            let value = getRoomByPersonality(perId);
            if (value == undefined) {
                errMsg("Could not find room by personality ID.");
                return;
            }

            let {room, personality} = value;

            let requestI = room.requests.findIndex(req=>compare(req, record));
            if (requestI == undefined) {
                errMsg("Request could not be found in room.");
                return;
            }

            personality.records.push(record);
            room.requests.splice(requestI, 1);
            if (record.accepted) {
                personality.cardData.score += record.score;
            }

            io.to(personality.id).emit("grantScore", record); 
        });

        socket.on("endGame", ()=>{
            let room = getRoomByStoryteller(socket.id);
            if (room == undefined) {
                errMsg("Could not find room by storyteller ID.");
                return;
            }

            room.stage = 2;

            room.personalities.sort((per0, per1)=>{
                if (per0.cardData.score > per1.cardData.score) {return -1;}
                if (per0.cardData.score < per1.cardData.score) {return 1;}
                return 0;
            })
            let winnerCount = 1;
            for (let i = 1; i < room.personalities.length; i++) {
                let per = room.personalities[i];
                if (per.cardData.score == room.personalities[0].cardData.score) {
                    winnerCount++;
                } else {
                    break;
                }
            }
            room.winnerCount = winnerCount;

            io.to(room.storyteller.id).emit("construct", {type: "EndGame", pers: room.personalities, winnerCount, addButton: true});
            room.personalities.forEach(per=>io.to(per.id).emit("construct", {type: "EndGame", pers: room!.personalities, winnerCount, addButton: false}));
        });

        socket.on("newGame", ()=>{
            let room = getRoomByStoryteller(socket.id);
            if (room == undefined) {
                errMsg("Could not find room by storyteller ID.");
                return;
            }

            room.consecutiveSuccesses = 0;
            room.requests = [];
            room.stage = 0;
            clearTimeout(room.timeout);
            room.winnerCount = undefined;

            room.personalities.forEach((per)=>{
                per.cardData.abilities =  Array.from({length: room!.abilityCount},(_)=>{return {approved: false, description: ""}});
                per.cardData.goals = Array.from({length: room!.goalCount},(_)=>{return {approved: false, description: "", score: ""}});
                per.cardData.score = 0;
                per.records = [],
                per.stage = 0
            });

            io.to(room.storyteller.id).emit("construct", {type: "St0Data",
                st0Data:{
                    personalities: room.personalities,
                    roomcode: room.roomcode
            }});
            room.personalities.forEach((per)=>{
                io.to(per.id).emit("construct", {type: "Ps0Data", ps0Data: {
                    cardData: per.cardData,
                    roomcode: room!.roomcode
                }});
            })
        });

        socket.on("deleteRoom", (stId)=>{
            let room = getRoomByStoryteller(stId);
            if (room == undefined) {
                errMsg("Could not find room by storyteller ID.");
                return;
            }

            rooms.splice(rooms.indexOf(room), 1);
        });

        socket.on("disconnect", (reason)=>{
            let room = getRoomByStoryteller(socket.id);
            if (room != undefined) {
                
                room.storyteller.connected = false;

                if (room.stage == 1) {
                    io.to(room.storyteller.id).emit("closeModal");
                    room.personalities.forEach(per=>io.to(per.id).emit("closeModal"));
                }

                console.log(
                    `Storyteller of room ` + chalk.yellow(room.roomcode) + ` disconnected\n` +
                    ` reason: ${reason}`
                );

                return;
            }

            let value = getRoomByPersonality(socket.id);
            if (value != undefined) {
                let personality;
                ({room, personality} = value);
                
                personality.connected = false;
                if (room.stage == 0) {
                    io.to(room.storyteller.id).emit("personality0Disconnected", socket.id);
                }
                else if (room.stage == 1) {
                    io.to(room.storyteller.id).emit("personality1Disconnected", socket.id);

                    let reorder = false;
                    while (!room.personalities[0].connected && room.personalities.some(per=>per.connected)) {
                        reorder = true;
                        room.personalities = room.personalities.slice(1).concat(room.personalities[0]);
                    }
                    if (reorder) {
                        io.to(room.storyteller.id).emit("reorderPersonalities", room.personalities[0].id);
                    }
                    io.to(room.storyteller.id).emit("closeModal");
                    room.personalities.forEach(per=>io.to(per.id).emit("closeModal"));
                }

                console.log(
                    `Peronality ` + chalk.yellow(personality.cardData.name) + ` of room ` + chalk.yellow(room.roomcode) + ` disconnected\n` +
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