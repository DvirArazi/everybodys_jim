import { socket } from "..";
import { Elem } from "../core/Elem";
import { Card } from "./card";
import { Container } from "./container";

export let Personality0 = () => {
    let card = Card("onPersonality", 2, 2,
        (value)=>{
            socket.emit("cardUpdatedPts", value);
        }
    );

    socket.on("cardUpdatedStp", (cardChangeType)=>{
        card.update(cardChangeType);
    });

    return Container(
        "Customize your personality", "#14c4ff", [card.elem]
    ).elem;
}