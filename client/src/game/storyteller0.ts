import { socket } from "..";
import { Elem } from "../core/Elem";
import { St0Data } from "../shared/types";
import { Button } from "./button";
import { Card } from "./card";
import { Container } from "./container";
import { Spacer } from "./spacer";
import { VisibilityBox } from "./visibilityBox";

export let Storyteller0 = (st0data: St0Data):HTMLElement => {
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

    if (st0data.personalities != undefined) {
        for (let {id, name, abilities, goals} of st0data.personalities) {
            let card = Card("onStoryteller", 2, 2, (cardChange)=>{
                socket.emit("cardUpdatedStp", id, cardChange);
    
                updateStartButton();
            });

            card.set(name, abilities, goals);
            card.setVisible(card.getName() != "");
            visibilityBox.setVisible(Array.from(cards.values()).some((card)=>{return card.getName() != "";}));
            visibilityBox.setVisible(true);

            cards.set(id, card);
            cardsContainer.append(card.elem);
        }

        updateStartButton();
    }

    socket.on("personalityConnected", (personalityId)=>{
        let card = Card("onStoryteller", 2, 2, (cardChange)=>{
            socket.emit("cardUpdatedStp", personalityId, cardChange);

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

        updateStartButton();
    });

    return Elem("div", {}, [
        Button("Copy room link", ()=>{
            console.log("copying " + st0data.roomcode);
            navigator.clipboard.writeText(window.location.host + "/" + st0data.roomcode);
        }).elem,
        Spacer(10),
        Elem("span", {innerText: `Players can join your game by either using the link or by entering the room code: `}),
        Elem("span", {innerText: st0data.roomcode}, [], {color: "#eb0000"}),
        Spacer(10),
        visibilityBox.elem,
        Spacer(10)
    ]);
}

