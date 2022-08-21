import { CardData } from "types";
import { Elem } from "../core/Elem";
import { Column } from "./card1/column";

export const Card1 = (
    abilitiesCount: number,
    goalsCount: number,
    cardData: CardData
)=>{
    return Elem("div", {}, [
        Elem("div", {innerText: "name"}),
        Elem("table", {}, [
            Elem("td", {}, [
                Column(abilitiesCount, )
            ])
        ])
    ]);
}