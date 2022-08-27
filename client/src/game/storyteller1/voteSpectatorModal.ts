import { Elem } from "../../core/Elem"
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { TimerDiv } from "../timerDiv";
import { Wheel3 } from "../wheel3"

export const VoteSpectatorModal = (
    pers: {id: string, name: string}[],
    failRatio: number
)=>{

    return Modal("Wait for the personalities to vote", false, Elem("div", {}, [
        Wheel3(pers.map(per=>per.name), failRatio).elem,
        Spacer(15),
        TimerDiv()
    ], { padding: "25px" }))
}