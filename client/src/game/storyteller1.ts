
import { Elem } from "../core/Elem";
import { St1Data } from "../shared/types";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container"
import { Spacer } from "./spacer";

export const Storyteller1 = (st1data: St1Data)=>{
    let dominantBox = Container("Dominant personality", "#14c4ff", [
        Card1(st1data.personalities[0].cardData)
    ]);

    let rest = [];
    for (let i = 1; i < st1data.personalities.length; i++) {
        rest.push(Card1(st1data.personalities[i].cardData));
    }
    let restBox = Container("Personalities", "#14c4ff", rest);

    return Elem("div", {}, [ 
        dominantBox.elem,
        Spacer(10),
        Button("Set dice", ()=>{}).elem,
        Spacer(10),
        restBox.elem,
        Spacer(10),
        Button("End game", ()=>{}).elem,
        Spacer(10)
    ]);
}