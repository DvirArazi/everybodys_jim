import chalk from "chalk";
import { Console } from "console";
import { io } from ".";
import { roomsCollection } from "./models/database.service";
import { AbilityData, CardChange, GoalData, Personality, Room } from "./shared/types";

export let rooms: Room[] = [];

export const retrieveRooms = async () => {
    rooms = (await roomsCollection.find({}).toArray()) as Room[];
}

export const getRoomByRoomcode = (roomcode: string) => {
    return rooms.find((room)=>{return room.roomcode == roomcode;});
}

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

    return undefined;
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
        stage: 0,
        abilityCount: 2,
        goalCount: 2,
        requests: [],
        consecutiveSuccesses: 0
    });

    console.log(`New storyteller ` + chalk.yellow(storytellerId) + ` created room ` + chalk.yellow(roomcode));

    return roomcode;
}

export const connectToRoom = (personalityId: string, room: Room) => {
    room.personalities.push(newPersonality(personalityId, room.abilityCount, room.goalCount));

    io.to(room.storyteller.id).emit("personalityConnected", personalityId, undefined);

    console.log(`New personality ` + chalk.yellow(personalityId) + ` connected to room ` + chalk.yellow(room.roomcode));
}

export const updateCard = (room: Room, personality: Personality, cardChange: CardChange) => {
    switch(cardChange.type) {
        case "name":
            personality.cardData.name = cardChange.name
        break;
        case "attribute":
            let attribute = cardChange.columnI == 0 ?
                personality.cardData.abilities[cardChange.attributeI] :
                personality.cardData.goals[cardChange.attributeI];
            switch(cardChange.attributeChange.type) {
                case "checkbox":
                    attribute.approved =
                        cardChange.attributeChange.value;
                break;
                case "description":
                    attribute.description =
                        cardChange.attributeChange.value;
                break;
                case "score":
                    let goal = (attribute as GoalData);
                    if (goal.score != undefined) {
                        goal.score =
                            cardChange.attributeChange.value;
                    }
                break;
            }
        break;
    }
}

export const newPersonality = (perId: string, abilityCount: number, goalCount: number): Personality => {
    return {
        id: perId,
        cardData: {
            name: "",
            abilities: Array<AbilityData>.from({length:abilityCount},(_)=>{return {approved: false, description: ""}}),
            goals: Array<GoalData>.from({length: goalCount},(_)=>{return {approved: false, description: "", score: ""}}),
            score: 0
        },
        records: [],
        stage: 0,
        connected: true
    };
}