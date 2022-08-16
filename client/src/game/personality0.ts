import { socket } from "..";
import { Elem } from "../core/Elem";
import { Card } from "./card";
import { Container } from "./container";

export let Personality0 = () => {
    let card = Card("onPersonality", 2, 2,
        (name)=>{
            socket.emit("nameUpdatedPts", name)
        },
        (columnI, attributeI, value)=>{
            socket.emit("attributeUpdatedPts", columnI, attributeI, value);
        }
    );

    socket.on("attributeUpdatedStp", (columnI, attributeI, value)=>{
        card.updateAttribute(columnI, attributeI, value);
    });

    return Container(
        "Customize your personality", "#14c4ff", [card.elem]
    ).elem;
}