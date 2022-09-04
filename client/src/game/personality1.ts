import chalk from "chalk";
import { socket } from "..";
import { Elem } from "../core/elemm";
import { Ps1Data } from "../shared/types";
import { errMsg } from "../shared/utils";
import { Bang } from "./bang";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container";
import { RecordsModal } from "./personality1/recordsModal";
import { RequestModal } from "./personality1/requestModal";
import { SpinModal } from "./personality1/spinModal";
import { VoteModal } from "./personality1/voteModal";
import { Spacer } from "./spacer";
import { WheelModal } from "./wheelModal";


export const Personality1 = (ps1Data: Ps1Data)=>{
    
    let bang = Bang(-13, -13);
    
    let card1 = Card1(
        ps1Data.cardData,
        ps1Data.records,
        ()=>bang.setVisibility(false),
        (goalI)=>{div.append(RequestModal(ps1Data.cardData.goals[goalI]));}
    );
    
    let div = Elem("div", {}, [
        Container("", "#14c4ff", [
            bang.elem,
            card1.elem,
        ]).elem,
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

    //Enable to spin the wheel and stop timer
    //=======================================
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

    //On wheel spin
    //=============
    socket.on("spinWheel", (angle, success)=>{
        wheelModal.spin(angle, success);
    });

    //Continue
    //========
    socket.on("continueGame", ()=>{
        if (wheelModal != undefined) {
            wheelModal.elem.remove();
        }
    });

    socket.on("closeModal", ()=>{
        if (wheelModal != undefined) {
            wheelModal.elem.remove();
        }
    });

    //Add record
    //==========
    socket.on("grantScore", (record)=>{
        card1.addRecord(record);

        if (!card1.isRecordsModalVisible()) {
            bang.setVisibility(true);
        }
    });

    return div;
}