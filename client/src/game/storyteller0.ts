import chalk from "chalk";
import { socket } from "..";
import { Elem } from "../core/elemm";
import { CardChange, CardData, St0Data } from "../shared/types";
import { errMsg } from "../shared/utils";
import { Button } from "./button";
import { Card0 } from "./card0";
import { Container } from "./container";
import { Modal } from "./modal";
import { Spacer } from "./spacer";
import { VisibilityBox } from "./visibilityBox";

type BoxedCard = Card0 & VisibilityBox & {id: string};

export let Storyteller0 = (st0data: St0Data, isOnMobile: boolean):HTMLElement => {
    let completePers: string[] = [];

    //onstart
    //=======
    let startGame = ()=>{socket.emit("construct", {type: "St1Data", 
        st1Data: {
            requests: [],
            pers: completePers.map((perId)=>{
                return {
                    id: perId,
                    connected: true,
                    cardData: {...cards.get(perId)!.getData(), ...{score: 0}},
                    records: []
                };
            })
        }
    })};

    //noticeModal
    //===========
    let noticeModal = Modal("Notice", "close", Elem("div", {}, [
        Elem("div", {innerText: "\
            Some personalities are not yet fully approved and will not join the game,\n\
            are you sure you want to start a new game?"}, [], {
            paddingBottom: "10px"
        }),
        Elem("table", {}, [Elem("tr", {}, [
            Elem("td", {}, [Button("Yes", startGame, true, {
                fontSize: "22px",
                width: "60px",
                padding: "5px 10px 5px 10px",
                background: "#00E673",
                boxShadow: "0 5px #00CC66",
            }).elem]),
            Elem("td", {}, [], {width: "10px"}),
            Elem("td", {}, [Button("No", ()=>{
                noticeModal.remove();
            }, true, {
                fontSize: "22px",
                width: "60px",
                padding: "5px 10px 5px 10px",
                background: "#ff4d4d",
                boxShadow: "0 5px #ff0000",
            }).elem]),
        ])], {margin: "auto"})
    ], {padding: "20px"}));

    //More variables
    //==============
    let cards = new Map<string, BoxedCard>();
    let cardsContainer = Container("Personalities", "#14c4ff", []);
    let startButton = Button("Start game", ()=>{
        if (completePers.length == cards.size) {
            startGame();
        } else {
            visibilityBox.elem.append(noticeModal);
        }
    });
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
            if (!completePers.includes(card.id)) {
                completePers.push(card.id);
            }
        } else if(completePers.includes(card.id)) {
            completePers.splice(completePers.indexOf(card.id), 1);
        }
        startButton.setEnabled(completePers.length >= 2);
    }

    //crate card
    //==========
    const createCard = (perId: string, cardData?: CardData)=>{
        let boxedCard: BoxedCard;
        let cardVBox = VisibilityBox([Spacer(2.5)]);
        let card = Card0("Storyteller", 2, 2, (cardChange)=>{
            socket.emit("cardUpdatedStp", perId, cardChange);

            onCardUpdate(boxedCard, cardChange);
        });

        boxedCard = {...card, ...cardVBox, ...{id: perId}};

        boxedCard.setVisible(card.getName() != "");
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
    socket.on("personality0Disconnected", (personalityId)=>{
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
            errMsg("Could not find a card to modify.");
            return;
        }

        card.update(cardChange);

        onCardUpdate(card, cardChange);
    });

    //Link button
    //===========
    let linkButton =
    isOnMobile ?
        Button("Everybody's Jim room link", async ()=>{
            await navigator.share({
                title: "Everybody's Jim",
                text: "Share room link",
                url: window.location.protocol + "//" + window.location.host + "/"
            })
        }).elem :
        Button("Copy room link", ()=>{
            console.log("copied: " + st0data.roomcode);
            navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host + "/" + st0data.roomcode);
        }).elem;

    return Elem("div", {}, [
        linkButton,
        Spacer(10),
        Elem("span", {innerText: `Players can join your game by either using the link or by entering the room code: `}),
        Elem("span", {innerText: st0data.roomcode}, [], {color: "#eb0000", userSelect: "text"}),
        Spacer(10),
        visibilityBox.elem,
        Spacer(10)
    ]);
}

