import chalk from "chalk";
import { socket } from "..";
import { Elem } from "../core/Elem";
import { Ps1Data } from "../shared/types";
import { errMsg } from "../shared/utils";
import { Bang } from "./bang";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container";
import { RecordsModal } from "./personality1/recordsModal";
import { SpinModal } from "./personality1/spinModal";
import { VoteModal } from "./personality1/voteModal";
import { Spacer } from "./spacer";
import { WheelModal } from "./wheelModal";


export const Personality1 = (ps1Data: Ps1Data)=>{
    let recordsModal = RecordsModal(ps1Data.records);
    
    let bang = Bang(-13, -13);
    
    let card1 = Card1(ps1Data.cardData,
        ()=>{
            recordsModal.setVisible();
            bang.setVisibility(false);
        },
        (goalI)=>{}
    );
    
    let div = Elem("div", {}, [
        Container("", "#14c4ff", [
            bang.elem,
            card1.elem,
        ]).elem,
        recordsModal.elem
    ]);

    let wheelModal: WheelModal;

    //Set wheelModal and append to div
    //================================
    socket.on("spinModal", (pers, failRatio)=>{
        console.log("spin modal");
        wheelModal = SpinModal(pers, failRatio);
        div.appendChild(wheelModal.elem);
    });

    socket.on("wheelSet", (pers, failRatio)=>{
        wheelModal = VoteModal(pers, failRatio);
        div.appendChild(wheelModal.elem);
    });

    //Update wheelModal with vote
    //===========================
    socket.on("vote", (perId, approve)=>{
        if (wheelModal == undefined) {
            errMsg("'wheelModal' is not yet defined.");
            return;
        }

        wheelModal.vote(perId, approve);
    });

    //End voting process
    //==================
    socket.on("disableVote", ()=>{
        if (wheelModal == undefined) {
            errMsg("'wheelModal' is not yet defined.");
            return;
        }
        let spinModal = wheelModal as VoteModal;
        if (spinModal.disableVote == undefined) {
            errMsg("wheelModal is not a SpinModal.");
            return;
        }

        spinModal.disableVote();
    });

    socket.on("enableSpin", ()=>{
        if (wheelModal == undefined) {
            errMsg("'wheelModal' is not yet defined.");
            return;
        }

        wheelModal.stopTimer();

        let spinModal = wheelModal as SpinModal;
        if (spinModal.enableSpin == undefined) {
            errMsg("wheelModal is not a SpinModal.");
            return;
        }

        spinModal.enableSpin();
    });

    socket.on("spinWheel", (angle, success)=>{
        wheelModal.spin(angle, success);
    });

    //Continue
    //========
    socket.on("continueGame", ()=>{
        div.removeChild(wheelModal.elem);
    });

    socket.on("grantScore", (score, description, reason)=>{
        recordsModal.add({
            accepted: true,
            score,
            description,
            reason
        });
        card1.addScore(score);
        bang.setVisibility(true);
    });

    return div;
}