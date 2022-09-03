
import { Elem } from "../core/elemm";
import { CardData, Personality, GoalRecord, GoalRequest, St1Data } from "../shared/types";
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
import { MailModal } from "./storyteller1/mailModal";
import { map } from "fp-ts/lib/Functor";

export type RequestSt = {
    perId: string,
    perName: string
} & GoalRequest

export type Card1St = Card1 & {
    getName:()=>string,
    getConnected: ()=>boolean,
    setConnected: (connected: boolean)=>void,
}

export const Storyteller1 = (st1Data: St1Data)=>{
    let domiPerId = st1Data.pers[0].id;
    
    let card1s = new Map<string, Card1St>();
    
    let modalDiv = Elem("div");

    let wheelModal: WheelModal;

    const perToCard = (per: {id: string, connected: boolean, cardData: CardData, records: GoalRecord[]}):Card1St =>{
        let card1 = Card1(per.cardData, per.records,
            ()=>{},
            (goalI)=>{
                let goal = per.cardData.goals[goalI];
                modalDiv.replaceChildren(
                    GrantModal(per.cardData.name, goal, (score, reason)=>{
                        let record = {
                            accepted: true,
                            score,
                            description: goal.description,
                            reason
                        };
                        card1s.get(per.id)!.addRecord(record);
                        socket.emit("grantScore", per.id, record);
                }));
            }
        )

        let cover = Elem("div", {}, [
            Elem("div", {innerText: "Disconnected"}, [

            ], {
                fontSize: "40px",
                textShadow: "0px 0px 8px rgba(206,89,55,0.35)",
                // background: "red",
                position: "absolute",
                translate: "-50% -50%",
                rotate: "-10deg",
                top: "50%",
                left: "50%"
            })
        ], {
            width: "100%",
            height: "calc(100% - 5px)",
            background: "rgba(255, 255, 255, 0.3)",
            position: "absolute",
            borderRadius: "10px",
            zIndex: "15",
            display: per.connected ? "none" : "block",
        })

        let perConnected = per.connected;
        return {
            ...card1,
            elem: Elem("div", {}, [Spacer(2.5), cover, card1.elem], {position: "relative"}),
            getName: ()=>per.cardData.name,
            getConnected: ()=>perConnected,
            setConnected: (connected: boolean)=>{
                perConnected = connected;
                cover.style.display = connected ? "none" : "block";
            }
        };
    }

    st1Data.pers.forEach(per=>card1s.set(per.id, perToCard(per)));

    let requestSts: RequestSt[] = [];
    for (let i = 0; i < st1Data.requests.length; i++) {
        let req = st1Data.requests[i];
        let card1 = card1s.get(req.perId);
        if (card1 == undefined) {
            errMsg("Could not find perId in cards map.");
            continue;
        }

        requestSts.push({perName: card1.getName(), ...req});
    }

    let mailModal = MailModal(requestSts);

    let mailButton = MailButton(()=>mailModal.setVisible());

    let dominantBox = Container("Dominant personality", "#14c4ff", [
        card1s.get(st1Data.pers[0].id)!.elem
    ]);

    let restBox = Container("Personalities", "#14c4ff",
        st1Data.pers.slice(1).map(per=>card1s.get(per.id)!.elem)
    );

    socket.on("personalityDisconnected", (perId)=>{
        let card1 = card1s.get(perId);
        if (card1 == undefined) {
            errMsg("Could not find card by perId.");
            return
        }

        card1.setConnected(false);
    });

    socket.on("personality1Reconnected", (oldId, newId)=>{
        let card1 = card1s.get(oldId);
        if (card1 == undefined) {
            errMsg("Could not find card by oldId.");
            return;
        }

        card1s.set(newId, card1);
        card1s.delete(oldId);

        card1.setConnected(true);
    });

    socket.on("wheelSet", (pers, failRatio)=>{
        wheelModal = VoteSpectatorModal(pers, failRatio);
        modalDiv.appendChild(wheelModal.elem);
    });

    socket.on("vote", (perId, approve)=>{
        if (wheelModal == undefined) {
            errMsg("'wheelModal' is not yet defined.");
            return;
        }

        wheelModal.vote(perId, approve);
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

        domiPerId = domiId;

        dominantBox.append(newDomi.elem);
    });

    socket.on("requestScore", (perId, request)=>{
        let card1 = card1s.get(perId);
        if (card1 == undefined) {
            errMsg("Cannot find card with the ID given from the server.");
            return;
        }
        if (mailModal.elem.style.display == "none") {
            mailButton.setBangVisibility(true);
        }

        mailModal.addRequest({
            perId,
            perName: card1.getName(),
            ...request
        });
    });

    socket.on("closeModal", ()=>{
        wheelModal.elem.remove();
    });

    let endGameModal = Modal("New Game", "close", Elem("div", {}, [
        Elem("div", {innerText: "Are you sure you want\n to start a new game?"}, [], {
            paddingBottom: "10px"
        }),
        Elem("table", {}, [Elem("tr", {}, [
            Elem("td", {}, [Button("Yes", ()=>{
                socket.emit("newGame");
            }, true, {
                fontSize: "22px",
                width: "60px",
                padding: "5px 10px 5px 10px",
                background: "#00E673",
                boxShadow: "0 5px #00CC66",
            }).elem]),
            Elem("td", {}, [], {width: "10px"}),
            Elem("td", {}, [Button("No", ()=>{
                endGameModal.remove();
            }, true, {
                fontSize: "22px",
                width: "60px",
                padding: "5px 10px 5px 10px",
                background: "#ff4d4d",
                boxShadow: "0 5px #ff0000",
            }).elem]),
        ])], {margin: "auto"})
    ], {padding: "20px"}));

    return Elem("div", {}, [
        dominantBox.elem,
        Spacer(10),
        Button("Set wheel", ()=>{
            modalDiv.appendChild(SetWheelModal());
        }).elem,
        Spacer(10),
        restBox.elem,
        Spacer(10),
        Button("End game", ()=>{
            modalDiv.append(endGameModal);
        }).elem,
        Spacer(10),
        mailButton.elem,
        modalDiv,
        mailModal.elem
    ]);
}