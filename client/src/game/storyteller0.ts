import { socket } from "..";
import { Elem } from "../core/Elem";
import { Button } from "./button";
import { Card } from "./card";
import { Container } from "./container";
import { Spacer } from "./spacer";
import { VisibilityBox } from "./VisibilityBox";

export let storyteller0 = (roomcode: string) => {
    let cards = new Map<string, Card>();
    let cardsContainer = Container("personalities", "#14c4ff", []);
    let startButton = Button("Start game", ()=>{});
    let visibilityBox = VisibilityBox([cardsContainer.elem, Spacer(10), startButton.elem]);
    visibilityBox.setVisible(false);

    socket.on("personalityConnected", (personalityId)=>{
        let card = Card("onStoryteller", 2, 2, 
        /*onNameChange*/()=>{},
        /*onAttributeChange*/(columnI, attributeI, value)=>{
            socket.emit("attributeUpdatedStp", personalityId, columnI, attributeI, value);
        });

        cards.set(personalityId, card);
        cardsContainer.append(card.elem);
    });

    socket.on("personalityDisconnected", (personalityId)=>{
        let card = cards.get(personalityId);

        if (card != undefined) {
            cardsContainer.remove(card.elem);
            cards.delete(personalityId);
        }
    });

    socket.on("nameUpdatedPts", (personalityId, name)=>{
        let card = cards.get(personalityId);
        if (card == undefined) {
            console.log("ERROR 404: Could not find the personality to modify.");
            return;
        }

        card.updateName(name);
        card.setVisible(name != ""); 

        let ccVisible = false;
        for (let [_, card] of cards) {
            if (card.getName() != "") {
                ccVisible = true;
                break;
            }
        }
        visibilityBox.setVisible(ccVisible);
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
        Button("Copy room link", ()=>{
            navigator.clipboard.writeText(window.location.host + "/" + roomcode);
        }).elem,
        Spacer(10),
        Elem("span", {innerText: `Players can join your game by either using the link or by entering the room code: `}),
        Elem("span", {innerText: roomcode}, [], {color: "#eb0000"}),
        Spacer(10),
        visibilityBox.elem
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