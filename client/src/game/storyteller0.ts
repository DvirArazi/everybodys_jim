import chalk from "chalk";
import { socket } from "..";
import { Elem } from "../core/Elem";
import { CardChange, CardData, St0Data } from "../shared/types";
import { Button } from "./button";
import { Card } from "./card";
import { Container } from "./container";
import { Spacer } from "./spacer";
import { VisibilityBox } from "./visibilityBox";

type BoxedCard = Card & VisibilityBox & {id: string};

export let Storyteller0 = (st0data: St0Data):HTMLElement => {
    let completePers: string[] = [];

    let cards = new Map<string, BoxedCard>();
    let cardsContainer = Container("Personalities", "#14c4ff", []);
    let startButton = Button("Start game", ()=>{});
    let visibilityBox = VisibilityBox([cardsContainer.elem, Spacer(10), startButton.elem]);
    visibilityBox.setVisible(false);

    //To be executed on card update
    //=============================
    const onCardUpdate = (card: BoxedCard, cardChange?: CardChange) => {
        if (cardChange == undefined || cardChange.type == "name") {
            card.setVisible(card.getName() != "");
            let blu = card.getName();
            let bla = Array.from(cards.values()).some(card=>card.getName()!="");
            visibilityBox.setVisible(bla);
        } 

        if (card.isComplete()) {
            completePers.push(card.id);
        } else if(completePers.some(id=>id==card.id)) {
            completePers.splice(completePers.indexOf(card.id), 1);
        }
        startButton.setEnabled(completePers.length >= 2);
    }

    //crate card
    //==========
    const createCard = (perId: string, cardData?: CardData)=>{
        let boxedCard: BoxedCard;
        let cardVBox = VisibilityBox([Spacer(2.5)]);
        let card = Card("Storyteller", 2, 2, (cardChange)=>{
            socket.emit("cardUpdatedStp", perId, cardChange);

            onCardUpdate(boxedCard, cardChange);
        });

        boxedCard = {...card, ...cardVBox, ...{id: perId}};

        cards.set(perId, boxedCard);
        cardVBox.elem.appendChild(card.elem);
        cardsContainer.append(cardVBox.elem);

        if (cardData != undefined) {
            card.set(cardData);
            onCardUpdate(boxedCard);
        }
    };

    //Construct cards from parameter data
    //===================================
    if (st0data.personalities != undefined) {
        for (let {id, cardData} of st0data.personalities) {
            createCard(id, cardData);
        }
    }

    //Construct card from personality connection
    //==========================================
    socket.on("personalityConnected", (personalityId, cardData)=>{
        createCard(personalityId, cardData);
    });

    //Remove card on personality disconnection
    //========================================
    socket.on("personalityDisconnected", (personalityId)=>{
        let card = cards.get(personalityId);

        if (card == undefined) {
            console.log(chalk.red("ERROR: ") + "Could not find a card to remove.");
            return;
        }

        cardsContainer.remove(card.elem);
        cards.delete(personalityId);

        if(completePers.some(id=>id==card!.id)) {
            completePers.splice(completePers.indexOf(card.id), 1);
        }
        startButton.setEnabled(completePers.length >= 2);
        visibilityBox.setVisible(Array.from(cards.values()).some(card=>card.getName()!=""));
    });

    //Update card on call from personality
    //====================================
    socket.on("cardUpdatedPts", (personalityId, cardChange)=> {
        let card = cards.get(personalityId);
        if (card == undefined) {
            console.log(chalk.red("ERROR: ") + "Could not find a card to modify.");
            return;
        }

        card.update(cardChange);

        onCardUpdate(card, cardChange);
    });

    return Elem("div", {}, [
        Button("Copy room link", ()=>{
            console.log("copied: " + st0data.roomcode);
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

