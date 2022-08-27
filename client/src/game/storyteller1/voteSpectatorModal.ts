import { Elem } from "../../core/Elem"
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { TimerDiv } from "../timerDiv";
import { Wheel } from "../wheel"

export const VoteSpectatorModal = (
    pers: {id: string, name: string}[],
    failRatio: number
)=>{

    return Modal("Wait for the personalities to vote", false, Elem("div", {}, [
        Wheel(pers.map(per=>per.name), failRatio).elem,
        Spacer(15),
        TimerDiv()
    ], { padding: "25px" }))
}