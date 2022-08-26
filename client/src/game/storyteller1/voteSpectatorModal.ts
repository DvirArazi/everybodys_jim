import { Elem } from "../../core/Elem"
import { Modal } from "../modal"
import { Wheel3 } from "../wheel3"

export const voteSpectatorModal = (
    pers: {id: string, name: string}[],
    failRatio: number
)=>{
    let time = 60;
    let line = (seconds: number)=>`${seconds} seconds left to vote`;
    let counter = Elem("div", {innerText: line(time)});
    

    return Modal("Wait for the personalities to vote", false, Elem("div", {}, [
        Wheel3(pers.map(per=>per.name), failRatio).elem,
        counter
    ]))
}