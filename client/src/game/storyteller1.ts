
import { Elem } from "../core/Elem";
import { CardData, Personality, St1Data } from "../shared/types";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container"
import { Modal } from "./modal";
import { Spacer } from "./spacer";
import { SetWheelModal } from "./storyteller1/setWheelModal";
import { SpinModal } from "./personality1/spinModal";
import { VoteSpectatorModal } from "./storyteller1/voteSpectatorModal";
import { socket } from "..";
import { WheelModal } from "./wheelModal";
import { errMsg} from "../shared/utils";

export const Storyteller1 = (st1data: St1Data)=>{
    let dominantBox = Container("Dominant personality", "#14c4ff", [
        perToCard(st1data.personalities[0].cardData)
    ]);

    let rest = [];
    for (let i = 1; i < st1data.personalities.length; i++) {
        rest.push(Elem("div", {}, [Spacer(2.5), Card1(st1data.personalities[i].cardData)]));
    }
    let restBox = Container("Personalities", "#14c4ff", rest);

    let modalDiv = Elem("div");

    let wheelModal: WheelModal;

    socket.on("vote", (perId, approve)=>{
        if (wheelModal == undefined) {
            errMsg("'wheelModal' is not yet defined.");
            return;
        }

        wheelModal.vote(perId, approve);
    });

    socket.on("wheelSet", (pers, failRatio)=>{
        wheelModal = VoteSpectatorModal(pers, failRatio);
        modalDiv.appendChild(wheelModal.elem);
    });

    socket.on("enableSpin", ()=>{
        wheelModal.stopTimer();
    });

    socket.on("spinWheel", (angle, success)=>{
        wheelModal.spin(angle, success);
    });

    socket.on("continueGame", ()=>{
        modalDiv.removeChild(wheelModal.elem);
    });

    socket.on("reorderPersonalities", (pers)=>{
        dominantBox.replaceAll([perToCard(pers[0].cardData)]);
        restBox.replaceAll(pers.slice(1).map(per=>perToCard(per.cardData)));
    });

    return Elem("div", {}, [
        dominantBox.elem,
        Spacer(10),
        Button("Set wheel", ()=>{
            modalDiv.appendChild(SetWheelModal());
        }).elem,
        Spacer(10),
        restBox.elem,
        Spacer(10),
        Button("End game", ()=>{}).elem,
        Spacer(10),
        modalDiv
    ]);
}

const perToCard = (cardData: CardData)=>{
    return Elem("div", {}, [Spacer(2.5), Card1(cardData)]);
}