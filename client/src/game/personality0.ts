import { socket } from "..";
import { Elem } from "../core/Elem";
import { Ps0Data } from "../shared/types";
import { Card } from "./card";
import { Container } from "./container";

export let Personality0 = (ps0data: Ps0Data) => {
    let card = Card("Personality", 2, 2,
        (value)=>{
            socket.emit("cardUpdatedPts", value);
        }
    );

    if (ps0data.cardData != undefined) {
        card.set(ps0data.cardData);
    }

    socket.on("cardUpdatedStp", (cardChangeType)=>{
        card.update(cardChangeType);
    });

    return Container(
        "Customize your personality", "#14c4ff", [card.elem]
    ).elem;
}