import chalk from "chalk";
import { Server } from "socket.io";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByStoryteller, rooms } from "./rooms";

export let handler = () => {
    process.on('SIGTERM', ()=>{

    });

    io.on("connection", (socket) => {

        socket.on("init", (path, entries, callback) => {
            let param = path.split('/')[1];

            let relevants: {Sto}[] = [];
            let toDelete: string[] = [];
            for (let entry of entries) {
                let room: Room | undefined;
                switch (entry.role) {
                    case "storyteller":
                        let room = getRoomByStoryteller(entry.id);
                        if (room == undefined) {
                            toDelete.push(entry.id);
                            continue;
                        }
                        if (param == "st" && !room.storyteller.connected) {
                            relevants.push(room.storyteller);
                        }
                    break;
                    case "personality":
                        let personality;
                        ({room, personality} = getRoomByPersonality(entry.id));
                        if (room == undefined) {
                            toDelete.push(entry.id);
                            continue;
                        }
                        if (param == room.roomcode && !personality!.connected) {
                            relevants.push(entry.id);
                        }
                    break;
                }
            }

            //add relevants to "new" type
            //add storyteller data to storyteller of relevants 1
            //add personality data to personality of relevants 1
            //add todelete to callback
            let clientType: ClientType;

            if (relevants.length > 1) {
                clientType = {type: "new", relevants: relevants};
            }
            if (relevants.length == 1) {

                if (param == "st") {
                    callback({ type: "Storyteller",
                        roomcode: createRoom(socket.id),
                        data: undefined
                    }, toDelete);
                }
                else if(param.length == 4 && connectToRoom(socket.id, param)) {
                    callback({type: "Personality"}, toDelete);
                } else {
                    callback({type: "new"}, toDelete);
                }
            } else {
                if (param == "st") {
                    callback({ type: "Storyteller",
                        roomcode: createRoom(socket.id),
                        data: undefined
                    }, toDelete);
                }
                else if(param.length == 4 && connectToRoom(socket.id, param)) {
                    callback({type: "Personality", data: undefined}, toDelete);
                } else {
                    callback({type: "new", relevants: []}, toDelete);
                }
            }

            callback(, toDelete);
        });

        socket.on("cardUpdatedPts", (cardChange)=>{
            let room = getRoomByPersonality(socket.id).room;

            if (room != undefined) {
                io.to(room.storyteller.id).emit("cardUpdatedPts", socket.id, cardChange);
            }
            else {
                console.log("ERROR 404: Couldn't find personality in any room.");
            }
        });

        socket.on("cardUpdatedStp", (personalityId, cardChange)=>{
            let room = getRoomByStoryteller(socket.id);

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

                rooms.splice(rooms.indexOf(room), 1);

                return;
            }

            let personality;
            ({ room, personality } = getRoomByPersonality(socket.id));
            if (room != undefined) {
                
                io.to(room.storyteller.id).emit("personalityDisconnected", socket.id);

                personality!.connected = false;

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