import chalk from "chalk";
import { Elem } from "../core/Elem";
import { TIME_TO_VOTE } from "../shared/globals";
import { Modal } from "./modal"
import { Spacer } from "./spacer";
import { Wheel } from "./wheel"

export type WheelModal = {
    elem: HTMLElement,
    vote: (perId: string, approve: boolean)=>void,
    spin: (angle: number, success: boolean)=>void,
    stopTimer: ()=>void,
}

export const WheelModal = (
    title: string, pers: {id: string, name: string}[],
    failRatio: number,
    content: (wheel: Wheel)=>HTMLElement,
    onStop?: ()=>void
): WheelModal =>{
    //wheel
    //=====
    let wheel = Wheel(pers.map(per=>per.name), failRatio);
    wheel.color(0, true);

    //timerDiv
    //========
    let line = (seconds: number)=>`${seconds} seconds left to vote`;
    let timerDiv = Elem("div");

    let maxTime = TIME_TO_VOTE;
    let start = Date.now();
    let timerInterval = setInterval(()=>{
        let time = maxTime - (Date.now() - start)/1000;
        if (time <= 0) {
            clearInterval(timerInterval);
            return;
        }

        timerDiv.innerText = line(Math.floor(time));
    }, 100);

    //return
    //======
    return {
        elem: Modal(title, "none", Elem("div", {}, [
            wheel.elem,
            Spacer(10),
            timerDiv,
            content(wheel)
        ], {
            padding: "15px"
        })),
        vote: (perId: string, approve: boolean)=>{
            let per = pers.find(per=>per.id==perId);
            if (per == undefined) {
                console.log(chalk.redBright("ERROR: ") + "Could not find personality.");
                return;
            }

            wheel.color(pers.indexOf(per), approve);
        },
        spin: (angle: number, success: boolean)=>{
            timerDiv.innerText = "";

            wheel.spin(angle, success, ()=>{
                timerDiv.style.fontSize = "28px";
                timerDiv.style.color = success ? "#4dff4d" : "#ff0000";
                timerDiv.innerText = success ? "Success!" : "Faliure";
                if (onStop != undefined) {onStop();}
            })
        },
        stopTimer: ()=>{
            clearInterval(timerInterval);
            timerDiv.innerText = `Waiting for ${pers[0].name} to spin the wheel`;
        }
    }
}