import chalk from "chalk";
import { Server } from "socket.io";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByStoryteller, rooms } from "./rooms";

export let handler = () => {
    process.on('SIGTERM', ()=>{

    });

    io.on("connection", (socket) => {

        socket.on("init", (path, callback) => {
            let param = path.split('/')[1];

            if (param == "st") {
                callback({ type: "Storyteller",
                    roomcode: createRoom(socket.id)
                });
            }
            else if(param.length == 4 && connectToRoom(socket.id, param)) {
                callback({type: "Personality"});
            } else {
                callback({type: "new"});
            }
        });

        socket.on("nameUpdatedPts", (name) => {
            let room = getRoomByPersonality(socket.id);

            if (room != undefined) {
                io.to(room.storytellerId).emit("nameUpdatedPts", socket.id, name);
            }
            else {
                console.log("ERROR 404: Couldn't find personality in any room.");
            }
        })

        socket.on("attributeUpdatedPts", (columnI, attributeI, value)=>{
            let room = getRoomByPersonality(socket.id);

            if (room != undefined) {
                io.to(room.storytellerId).emit("attributeUpdatedPts", socket.id, columnI, attributeI, value);
            }
            else {
                console.log("ERROR 404: Couldn't find personality in any room.");
            }
        });

        socket.on("attributeUpdatedStp", (personalityId, columnI, attributeI, value)=>{
            let room = getRoomByStoryteller(socket.id);

            io.to(personalityId).emit("attributeUpdatedStp", columnI, attributeI, value);
        });

        socket.on("disconnect", (reason)=>{
            let room = getRoomByStoryteller(socket.id);
            if (room != undefined) {
                //inform players that the storyteller disconnected
                //then, wait for them/ask if someone else wants to be the storyteller
                console.log(
                    `Storyteller ` + chalk.yellow(socket.id) + ` of room ` + chalk.yellow(room.roomcode) + ` disconnected\n` +
                    `\treason: ${reason}`
                );

                rooms.splice(rooms.indexOf(room), 1);

                return;
            }

            room = getRoomByPersonality(socket.id);
            if (room != undefined) {
                
                io.to(room.storytellerId).emit("personalityDisconnected", socket.id);

                console.log(
                    `Peronality ` + chalk.yellow(socket.id) + ` of room ` + `${room.roomcode}` + ` disconnected\n` +
                    `\treason: ${reason}`
                );

                return;
            }

            console.log(
                `User ` + chalk.yellow(socket.id) + ` disconnected\n` +
                `\treason: ${reason}`
            );
        });
    });
}