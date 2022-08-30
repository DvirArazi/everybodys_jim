
import { Elem } from "../core/Elem";
import { CardData, Personality, Record, St1Data } from "../shared/types";
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
    let card1s = new Map<string, Card1>();
    
    let modalDiv = Elem("div");

    const perToCard = (per: {id: string, cardData: CardData, records: Record[]}): Card1 =>{
        let card1 = Card1(per.cardData, per.records,
            ()=>{},
            (goalI)=>{
                let goal = per.cardData.goals[goalI];
                modalDiv.replaceChildren(
                    GrantModal(per.cardData.name, goal, (score, reason)=>{
                        card1s.get(per.id)!.addRecord(score, goal.description, reason);
                        socket.emit("grantScore", per.id,
                            score,
                            goal.description,
                            reason
                        );
                }));
            }
        )

        return {
            ...card1,
            elem: Elem("div", {}, [Spacer(2.5), card1.elem]),
        };
    }

    st1Data.pers.forEach(per=>card1s.set(per.id, perToCard(per)));

    let dominantBox = Container("Dominant personality", "#14c4ff", [
        card1s.get(st1Data.pers[0].id)!.elem
    ]);

    let restBox = Container("Personalities", "#14c4ff",
        st1Data.pers.slice(1).map(per=>card1s.get(per.id)!.elem)
    );

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

    socket.on("reorderPersonalities", (domiId)=>{
        let prevDomi = dominantBox.inner.firstChild
        if (prevDomi == undefined) {
            errMsg("Domi Box doesn't have a first child for some reason.");
            return;
        }

        restBox.append(prevDomi);

        let newDomi = card1s.get(domiId);
        if (newDomi == undefined) {
            errMsg("Rest Box doesn't contain a personality card with the ID sent by the server.");
            return;
        }

        dominantBox.append(newDomi.elem);
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