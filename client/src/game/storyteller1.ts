
import { Elem } from "../core/Elem";
import { St1Data } from "../shared/types";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container"
import { Modal } from "./modal";
import { Spacer } from "./spacer";
import { SpinModal } from "./storyteller1/spinModal";

export const Storyteller1 = (st1data: St1Data)=>{
    let dominantBox = Container("Dominant personality", "#14c4ff", [
        Card1(st1data.personalities[0].cardData)
    ]);

    let rest = [];
    for (let i = 1; i < st1data.personalities.length; i++) {
        rest.push(Elem("div", {}, [Spacer(2.5), Card1(st1data.personalities[i].cardData)]));
    }
    let restBox = Container("Personalities", "#14c4ff", rest);

    let modalDiv = Elem("div");

    return Elem("div", {}, [
        modalDiv,
        dominantBox.elem,
        Spacer(10),
        Button("Set dice", ()=>{
            modalDiv.appendChild(SpinModal());
        }).elem,
        Spacer(10),
        restBox.elem,
        Spacer(10),
        Button("End game", ()=>{}).elem,
        Spacer(10)
    ]);
}