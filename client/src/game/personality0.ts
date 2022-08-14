import { socket } from "..";
import { Elem } from "../core/Elem";
import { CardOp } from "./cardOp";

export let personality0 = (foundRoom: boolean) => {
    let card = CardOp(2, 2,
        (name)=>{
            socket.emit("nameUpdatedPts", name)
        },
        (columnI, attributeI, value)=>{
            socket.emit("attributeUpdatedPts", columnI, attributeI, value);
        }
    );

    let div = Elem("div");
    if (foundRoom) {
        div.innerText = "Customize your personality";
        div.appendChild(card.elem);
    } else {
        div.innerText = "Couldn't find room :/";
    }

    return div;
}