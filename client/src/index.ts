import { io, Socket } from "socket.io-client";
import { Elem } from "./core/Elem";
import { Game } from "./game";
import { Button } from "./game/button";
import { Card0 } from "./game/card0";
import { Column } from "./game/card/column";
import { Attribute } from "./game/card/column/attribute";
import { initEntries } from "./game/entries";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Storyteller1 } from "./game/storyteller1";
import { ClientToServerEvents, ServerToClientEvents } from "./shared/types";
import { Card1 } from "./game/card1";
import { Container } from "./game/container";
import { SpinModal } from "./game/personality1/spinModal";
import { VoteModal } from "./game/personality1/voteModal";
import { SetWheelModal } from "./game/storyteller1/setWheelModal";
import { Wheel2 } from "./game/storyteller1/wheel2";
import { Wheel3 } from "./game/wheel3";
import { voteSpectatorModal } from "./game/storyteller1/voteSpectatorModal";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

initEntries();

document.body.style.overflowX = "hidden";
document.body.style.overflowY = "scroll";
document.body.style.background = "#14ffff";
document.body.appendChild(Elem("div", {}, [
    Game()
    // voteSpectatorModal([
    //     {id: "", name: "Dvir"},
    //     {id: "", name: "Yonatan"},
    //     {id: "", name: "Gal"},
    //     {id: "", name: "YotamYotam"}
    // ], 0.6)
], {
    textAlign: "center",
    maxWidth: "500px",
    margin: "auto",
    fontFamily: "rubik",
    fontWeight: "bold",
    fontSize: "20px",
    userSelect: "none"
}));

// Card0("Personality", 2, 2, ()=>{}).elem
// Container("Title", "#14c4ff", [
//     Card1({
//         name: "hello",
//         abilities: [{
//             approved: undefined,
//             description: "one"
//         },
//         {
//             approved: undefined,
//             description: "three"
//         }],
//         goals: [{
//             approved: undefined,
//             description: "two",
//             score: "2"
//         }, 
//         {
//             approved: undefined,
//             description: "four",
//             score: "4"
//         }],
//         score: 115
//     })
// ]).elem

// Storyteller1({personalities: [
//     {
//         id: "", 
//         cardData: {
//             name: "hello",
//             abilities: [{
//                 approved: undefined,
//                 description: "one"
//             },
//             {
//                 approved: undefined,
//                 description: "three"
//             }],
//             goals: [{
//                 approved: undefined,
//                 description: "two",
//                 score: "2"
//             }, 
//             {
//                 approved: undefined,
//                 description: "four",
//                 score: "4"
//             }],
//             score: 115
//         }
//     },
//     {
//         id: "", 
//         cardData: {
//             name: "hello",
//             abilities: [{
//                 approved: undefined,
//                 description: "one"
//             },
//             {
//                 approved: undefined,
//                 description: "three"
//             }],
//             goals: [{
//                 approved: undefined,
//                 description: "two",
//                 score: "2"
//             }, 
//             {
//                 approved: undefined,
//                 description: "four",
//                 score: "4"
//             }],
//             score: 115
//         }
//     },
//     {
//         id: "", 
//         cardData: {
//             name: "hello",
//             abilities: [{
//                 approved: undefined,
//                 description: "one"
//             },
//             {
//                 approved: undefined,
//                 description: "three"
//             }],
//             goals: [{
//                 approved: undefined,
//                 description: "two",
//                 score: "2"
//             }, 
//             {
//                 approved: undefined,
//                 description: "four",
//                 score: "4"
//             }],
//             score: 115
//         }
//     }
// ]})