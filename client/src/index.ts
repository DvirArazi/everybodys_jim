import { io, Socket } from "socket.io-client";
import { Elem } from "./core/elemm";
import { Game } from "./game";
import { initEntries } from "./game/entriess";
import { ClientToServerEvents, ServerToClientEvents } from "./shared/types";
import { Card1 } from "./game/card1";


export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

initEntries();

document.body.style.overflowX = "hidden";
document.body.style.overflowY = "scroll";
document.body.style.background = "#14ffff";
document.body.appendChild(Elem("div", {}, [
    Game()
    // Storyteller1({
    //     requests: [
    //         {
    //             perId: "1",
    //             score: 4,
    //             description: "s",
    //             explanation: "I"
    //         },
    //         {
    //             perId: "1",
    //             score: 4,
    //             description: "swimming",
    //             explanation: "I was swimming!jjjjjjjjjjjjjjjj"
    //         },
    //     ],
    //     pers: [
    //     {
    //         id: "1",
    //         connected: true,
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
    //         },
    //         records: [
    //             {
    //                 accepted: true,
    //                 score: 3,
    //                 description: "climbing up a tree",
    //                 reason: "You climbed that tree."
    //             }, {
    //                 accepted: false,
    //                 description: "riding on a motorcycle",
    //                 explanation: "gimmi dem points",
    //                 reason: "a toy motocycle does not count as a motorcycle"
    //             }, {
    //                 accepted: false,
    //                 description: "doing a double backflip"
    //             }, {
    //                 accepted: true, 
    //                 score: 4,
    //                 description: "using mayonnaise"
    //             }
    //         ]
    //     },
    //     {
    //         id: "2",
    //         connected: false,
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
    //         },
    //         records: [
    //             {
    //                 accepted: true,
    //                 score: 3,
    //                 description: "climbing up a tree",
    //                 reason: "You climbed that tree."
    //             }, {
    //                 accepted: false,
    //                 description: "riding on a motorcycle",
    //                 explanation: "gimmi dem points",
    //                 reason: "a toy motocycle does not count as a motorcycle"
    //             }, {
    //                 accepted: false,
    //                 description: "doing a double backflip"
    //             }, {
    //                 accepted: true, 
    //                 score: 4,
    //                 description: "using mayonnaise"
    //             }
    //         ]
    //     },    
    // ]})

    // Card1({
    //     name: "hello",
    //     abilities: [{
    //         approved: undefined,
    //         description: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more rece"
    //     },
    //     {
    //         approved: undefined,
    //         description: "three"
    //     }],
    //     goals: [{
    //         approved: undefined,
    //         description: "two",
    //         score: "2"
    //     }, 
    //     {
    //         approved: undefined,
    //         description: "four",
    //         score: "4"
    //     }],
    //     score: 115
    // }, [], ()=>{}, ()=>{}).elem
    // RequestModal({
    //     approved: true, 
    //     description: "Eating ice-cream",
    //     score: "5"
    // })
    // Modal("title", true, Elem("div"))
    // Personality1({
    //     cardData: {
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
    //     },
    //     records: [
    //         // {
    //         //     accepted: true,
    //         //     score: 3,
    //         //     description: "climbing up a tree",
    //         //     reason: "You climbed that tree."
    //         // }, {
    //         //     accepted: false,
    //         //     description: "riding on a motorcycle",
    //         //     explanation: "gimmi dem points",
    //         //     reason: "a toy motocycle does not count as a motorcycle"
    //         // }, {
    //         //     accepted: false,
    //         //     description: "doing a double backflip"
    //         // }, {
    //         //     accepted: true, 
    //         //     score: 4,
    //         //     description: "using mayonnaise"
    //         // }
    //     ]
    // })
], {
    textAlign: "center",
    maxWidth: "500px",
    margin: "auto",
    fontFamily: "rubik",
    fontWeight: "bold",
    fontSize: "20px",
    userSelect: "none"
}));

document.onkeydown = (e)=>{
    if (e.code == "Enter") {
        Array.from<HTMLInputElement>(
            document.querySelectorAll("input[type=checkbox]")
        ).forEach(
            (elem) => {
                elem.checked = true;
                // elem.oninput!(new Event("⚡️"));
            }
        )
        Array.from(
            document.getElementsByTagName("textarea")
        ).forEach(
            (elem) => {
                elem.value = "9";
                // elem.oninput!(new Event("⚡️"));
            }
        )

    }
}

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