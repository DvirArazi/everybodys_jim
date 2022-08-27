import chalk from "chalk";
import { socket } from "..";
import { Elem } from "../core/Elem";
import { Ps1Data } from "../shared/types";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container";
import { SpinModal } from "./personality1/spinModal";
import { VoteModal } from "./personality1/voteModal";
import { Spacer } from "./spacer";
import { Wheel2 } from "./storyteller1/wheel2";
import { WheelModal } from "./wheelModal";


export const Personality1 = (ps1Data: Ps1Data)=>{
    
    
    let div = Elem("div", {}, [
        Container("", "#14c4ff", [
            Card1(ps1Data)
        ]).elem
    ]);

    let modal: WheelModal;

    socket.on("vote", (perId, approve)=>{
        modal.vote(perId, approve);
    });

    socket.on("spinModal", (pers, failRatio)=>{
        modal = SpinModal(pers, failRatio);
        div.appendChild(modal.elem);
    });

    socket.on("wheelSet", (pers, failRatio)=>{
        modal = VoteModal(pers, failRatio);
        div.appendChild(modal.elem);
    });

    return div;
}