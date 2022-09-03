import { socket } from "..";
import { Elem } from "../core/elem";
import { Ps0Data } from "../shared/types";
import { Card0 } from "./card0";
import { Container } from "./container";
import { updateEntryName } from "./entries";

export let Personality0 = (ps0data: Ps0Data) => {
    let card = Card0("Personality", 2, 2,
        (cardChange)=>{
            if (cardChange.type == "name") {
                updateEntryName(cardChange.name);
            }
            socket.emit("cardUpdatedPts", cardChange);
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