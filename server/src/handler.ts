import chalk from "chalk";
import { io } from ".";
import { connectToRoom, createRoom, getRoomByPersonality, getRoomByStoryteller, rooms } from "./rooms";
import { ClientData, NewData, Personality, Room, Storyteller } from "./types";

export let handler = () => {
    process.on('SIGTERM', ()=>{

    });

    io.on("connection", (socket) => {

        socket.on("init", (path, entries, newGame, callback) => {
            console.log("init");
            let param = path.split('/')[1];

            let st0Datas: Storyteller[] = [];
            let ps0Datas: Personality[] = [];
            let newData: NewData = [];
            let toDeletes: string[] = [];

            for (let entry of entries) {
                let room: Room | undefined;
                switch (entry.role) {
                    case "Storyteller":
                        room = getRoomByStoryteller(entry.id);
                        if (room == undefined) {
                            toDeletes.push(entry.id);
                            continue;
                        }
                        newData.push({role: entry.role, roomcode: room.roomcode});
                        if (param == "st" && !room.storyteller.connected) {
                            st0Datas.push(room.storyteller);
                        }
                    break;
                    case "Personality":
                        let personality;
                        ({room, personality} = getRoomByPersonality(entry.id));
                        if (room == undefined || personality == undefined) {
                            toDeletes.push(entry.id);
                            continue;
                        }
                        newData.push({role: entry.role, roomcode: room.roomcode});
                        if (param == room.roomcode && !personality.connected) {
                            ps0Datas.push(personality);
                        }
                    break;
                }
            }

            let clientType: ClientData | undefined = undefined;
            if (param == "st") {
                if (st0Datas.length == 0 || newGame) {
                    clientType = { type: "Storyteller", st0data: {roomcode: createRoom(socket.id)} };
                } else if (st0Datas.length == 1) {
                    st0Datas[0].id = socket.id;
                    clientType = { type: "Storyteller", st0data: st0Datas[0] };
                }
            }
            else if(param.length == 4) {
                if ((ps0Datas.length == 0 || newGame) && connectToRoom(socket.id, param)) {
                    clientType = {type: "Personality", data: undefined};
                } else if (ps0Datas.length == 1) {
                    ps0Datas[0].id = socket.id;
                    clientType = {type: "Personality", data: ps0Datas[0]}
                }
            }
            if (clientType == undefined) {
                clientType = {type: "new", datas: newData};
            }

            callback(clientType, toDeletes);
        });

        socket.on("cardUpdatedPts", (cardChange)=>{
            let {room, personality} = getRoomByPersonality(socket.id);

            if (room != undefined && personality != undefined) {
                switch(cardChange.type) {
                    case "name":
                        personality.name = cardChange.value
                    break;
                    case "attribute":
                        let attribute = cardChange.columnI == 0 ?
                            personality.abilities[cardChange.attributeI] :
                            personality.goals[cardChange.attributeI];
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

                                if (attribute.type == "goal") {
                                    attribute.score =
                                        cardChange.attributeChange.value;
                                }
                            break;
                        }
                    break;
                }

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

                // rooms.splice(rooms.indexOf(room), 1);
                console.log(rooms);

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