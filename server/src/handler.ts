import { Server } from "socket.io";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByStoryteller, rooms } from "./rooms";

export let handler = () => {
    io.on("connection", (socket) => {

        socket.on("clientType", (roomcode, callback) => {
            if (roomcode == "") {
                callback({ type: "Storyteller",
                    roomcode: createRoom(socket.id)
                });
            } else {
                callback({ type: "Personality" ,
                    roomFound: connectToRoom(socket.id, roomcode)
                });
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

            console.log("boop");

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
    });
}