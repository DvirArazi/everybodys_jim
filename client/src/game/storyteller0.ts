import { socket } from "..";
import { Elem } from "../core/Elem";
import { Button } from "./button";
import { Card } from "./card";
import { Container } from "./container";
import { Spacer } from "./spacer";
import { VisibilityBox } from "./visibilityBox";

export let Storyteller0 = (roomcode: string):HTMLElement => {
    let orderedPersonalities: string[] = [];

    let cards = new Map<string, Card>();
    let cardsContainer = Container("Personalities", "#14c4ff", []);
    let startButton = Button("Start game", ()=>{});
    let visibilityBox = VisibilityBox([cardsContainer.elem, Spacer(10), startButton.elem]);
    visibilityBox.setVisible(false);

    const updateStartButton = ()=>{
        startButton.setEnabled(
            Array.from(cards.values()).every((card)=>{return card.isComplete();})
        );
    }

    socket.on("personalityConnected", (personalityId)=>{
        let card = Card("onStoryteller", 2, 2, 
        /*onChange*/(cardChangeType)=>{
            socket.emit("cardUpdatedStp", personalityId, cardChangeType);

            updateStartButton();
        });

        card.setVisible(card.getName() != "");

        cards.set(personalityId, card);
        cardsContainer.append(card.elem);

        updateStartButton();
    });

    socket.on("personalityDisconnected", (personalityId)=>{
        let card = cards.get(personalityId);

        if (card != undefined) {
            cardsContainer.remove(card.elem);
            cards.delete(personalityId);
        }

        updateStartButton();
    });

    socket.on("cardUpdatedPts", (personalityId, cardChange)=> {
        let card = cards.get(personalityId);
        if (card == undefined) {
            console.log("ERROR 404: Could not find the personality to modify.");
            return;
        }

        card.update(cardChange);

        if (cardChange.type == "name") { 
            card.setVisible(cardChange.value != "")

            let visible = false;
            for (let [_, card] of cards) {
                if (card.getName() != "") {
                    visible = true;
                    break;
                }
            }
            visibilityBox.setVisible(visible);
        }

        startButton.setEnabled(card.isComplete());

        updateStartButton();
    });

    return Elem("div", {}, [
        Button("Copy room link", ()=>{
            navigator.clipboard.writeText(window.location.host + "/" + roomcode);
        }).elem,
        Spacer(10),
        Elem("span", {innerText: `Players can join your game by either using the link or by entering the room code: `}),
        Elem("span", {innerText: roomcode}, [], {color: "#eb0000"}),
        Spacer(10),
        visibilityBox.elem,
        Spacer(10)
    ]);
}


//DELET!!! for testing only!!!
    // let card = Card("onStoryteller", 2, 2, 
    // /*onNameChange*/()=>{},
    // /*onAttributeChange*/(columnI, attributeI, value)=>{
    //     socket.emit("attributeUpdatedStp", "personalityId", columnI, attributeI, value);
    // });

    // cards.set("personalityId", card);
    // cardsContainer.appendChild(card.elem);

    // if (card != undefined) {
    //     card.updateName("name");
    // } else {
    //     console.log("ERROR 404: Could not find the personality to modify.");
    // }
//DELET!!!