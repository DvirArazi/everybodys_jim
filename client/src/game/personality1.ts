import chalk from "chalk";
import { socket } from "..";
import { Elem } from "../core/Elem";
import { Ps1Data } from "../shared/types";
import { Card1 } from "./card1";
import { Container } from "./container";
import { VoteModal } from "./personality1/voteModal";
import { Wheel2 } from "./storyteller1/wheel2";


export const Personality1 = (ps1Data: Ps1Data)=>{
    let div = Elem("div", {}, [
        Container("", "#14c4ff", [
            Card1(ps1Data)
        ]).elem
    ]);

    socket.on("wheelSet", (perList, failRatio)=>{
        
        console.log(chalk.redBright(chalk.bold("wheelSet")));
        div.appendChild(VoteModal(perList, failRatio))
    });

    return div;
}