import { socket } from "../..";
import { Elem } from "../../core/Elem"
import { Button } from "../button";
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { Wheel } from "../wheel"
import { WheelModal } from "../wheelModal";

export const VoteSpectatorModal = (
    pers: {id: string, name: string}[],
    failRatio: number
)=>{
    let button = Button("Continue", ()=>{
        socket.emit("continueGame");
    }, false);

    return WheelModal("Wait for the personalities to vote", pers, failRatio,
        ()=>Elem("div", {}, [
            button.elem
        ], { padding: "25px" }), 
        ()=>{
            button.setEnabled(true);
        }
    );
}