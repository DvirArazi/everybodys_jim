
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
import { GrantModal } from "./storyteller1/grantModal";
import { MailButton } from "./storyteller1/mailButton";

export const Storyteller1 = (st1Data: St1Data)=>{
    let modalDiv = Elem("div");
    
    const perToCard = (per: {id: string, cardData: CardData})=>{
        let card1 = Card1(per.cardData, 
            ()=>{},
            (goalI)=>{
                modalDiv.replaceChildren(GrantModal(per, goalI, (score)=>{
                    card1.addScore(score);
                }));
            }
        )

        return Elem("div", {}, [Spacer(2.5), card1.elem]);
    }

    let dominantBox = Container("Dominant personality", "#14c4ff", [
        perToCard(st1Data.pers[0])
    ]);

    let restBox = Container("Personalities", "#14c4ff", st1Data.pers.slice(1).map(per=>perToCard(per)));

    let wheelModal: WheelModal;

    let mailButton = MailButton(()=>{});

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
        dominantBox.replaceAll([perToCard(pers[0])]);
        restBox.replaceAll(pers.slice(1).map(per=>perToCard(per)));
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