import chalk from "chalk";
import { Console } from "console";
import { io } from ".";
import { AbilityData, Room } from "./types";

export let rooms: Room[] = [];

export const getRoomByStoryteller = (storytellerId: string): Room | undefined => {
    return rooms.find((room)=>{return room.storyteller.id == storytellerId;});
}

export const getRoomByPersonality = (personalityId: string) => {
    for (let room of rooms) {
        for (let personality of room.personalities) {
            if (personality.id == personalityId) {
                return {room: room, personality: personality};
            }
        }
    }

    return {room: undefined, personality: undefined};
}

export const createRoom = (storytellerId: string): string => {
    let roomcode = "";

    do {
        for (let _ = 0; _ < 4; _++) {
            let char = String.fromCharCode(
                'A'.charCodeAt(0) +
                Math.random() * ('Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1)
            );

            roomcode += char;
        }
    } while(rooms.some((room) => {room.roomcode == roomcode}));

    rooms.push({
        roomcode,
        storyteller: {id: storytellerId, connected: true},
        personalities: [], 
        stage: 0
    });

    console.log(`New storyteller ` + chalk.yellow(storytellerId) + ` created room ` + chalk.yellow(roomcode));

    return roomcode;
}

export const connectToRoom = (personalityId: string, roomcode: String): boolean => {
    let room = rooms.find((room)=>{return room.roomcode == roomcode;});
    
    if (room != undefined) {
        room.personalities.push({
            id: personalityId,
            name: "",
            abilities: Array<AbilityData>(2).fill({type: ""}),
            goals: [],
            stage: 0,
            connected: true
        });

        io.to(room.storyteller.id).emit("personalityConnected", personalityId)

        console.log(`New personality ` + chalk.yellow(personalityId) + ` connected to room ` + chalk.yellow(roomcode));

        return true;
    }

    return false;
}