import { socket } from "..";
import { Elem } from "../core/Elem";
import { CardOs } from "./cardOs";

export let storyteller0 = (roomcode: string) => {
    let cards = new Map<string, CardOs>();
    let cardsContainer = Elem("div", {innerText: "Personalities"});

    socket.on("personalityConnected", (personalityId)=>{
        let card = CardOs(2, 2, ()=>{});

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