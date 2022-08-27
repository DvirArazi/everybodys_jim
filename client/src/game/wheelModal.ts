import chalk from "chalk";
import { Elem } from "../core/Elem";
import { Modal } from "./modal"
import { Wheel3 } from "./wheel3"

export type WheelModal = {
    elem: HTMLElement,
    vote: (perId: string, approve: boolean)=>void
}

export const WheelModal = (
    title: string, pers: {id: string, name: string}[],
    failRatio: number,
    content: (wheel: Wheel3)=>HTMLElement
): WheelModal =>{
    let wheel = Wheel3(pers.map(per=>per.name), failRatio);
    return {
        elem: Modal(title, false, Elem("div", {}, [wheel.elem, content(wheel)], { padding: "25px" })),
        vote: (perId: string, approve: boolean)=>{
            let per = pers.find(per=>per.id==perId);
            if (per == undefined) {
                console.log(chalk.redBright("ERROR: ") + "Could not find personality.");
                return;
            }

            wheel.color(pers.indexOf(per), approve);
        }
    }
}