import { socket } from "..";
import { Elem } from "../core/Elem";
import { Card } from "./card";

export let storyteller0 = (roomcode: string) => {
    let cards = new Map<string, Card>();
    let cardsContainer = Elem("div", {innerText: "Personalities"});

    socket.on("personalityConnected", (personalityId)=>{
        let card = Card("onStoryteller", 2, 2, 
        /*onNameChange*/()=>{},
        /*onAttributeChange*/(columnI, attributeI, value)=>{
            socket.emit("attributeUpdatedStp", personalityId, columnI, attributeI, value);
        });

        cards.set(personalityId, card);
        cardsContainer.appendChild(card.elem);
    });

    socket.on("nameUpdatedPts", (personalityId, name)=>{
        let card = cards.get(personalityId);
        if (card != undefined) {
            card.updateName(name);
        } else {
            console.log("ERROR 404: Could not find the personality to modify.");
        }
    });

    socket.on("attributeUpdatedPts", (personalityId, columnI, attributeI, value)=> {
        let card = cards.get(personalityId);
        if (card != undefined) {
            card.updateAttribute(columnI, attributeI, value);
        } else {
            console.log("ERROR 404: Could not find the personality to modify.");
        }
    });

    return Elem("div", {}, [
        Elem("button", {
            innerText: "Copy room link",
            onclick: () => {
                navigator.clipboard.writeText(window.location.host + "/" + roomcode);
            }
        }),
        cardsContainer
    ]);
}