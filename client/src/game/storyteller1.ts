
import { Elem } from "../core/Elem";
import { St1Data } from "../shared/types";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container"
import { Modal } from "./modal";
import { Spacer } from "./spacer";
import { SetWheelModal } from "./storyteller1/setWheelModal";
import { SpinModal } from "./personality1/spinModal";
import { VoteSpectatorModal } from "./storyteller1/voteSpectatorModal";
import { socket } from "..";

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

    socket.on("wheelSet", (pers, failRatio)=>{
        modalDiv.appendChild(VoteSpectatorModal(pers, failRatio));
    });

    return Elem("div", {}, [
        modalDiv,
        dominantBox.elem,
        Spacer(10),
        Button("Set wheel", ()=>{
            modalDiv.appendChild(SetWheelModal());
        }).elem,
        Spacer(10),
        restBox.elem,
        Spacer(10),
        Button("End game", ()=>{}).elem,
        Spacer(10)
    ]);
}