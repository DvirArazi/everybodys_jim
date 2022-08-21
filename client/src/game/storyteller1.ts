
import { Elem } from "../core/Elem";
import { St1Data } from "../shared/types";
import { Button } from "./button";
import { Container } from "./container"
import { Spacer } from "./spacer";

export const Storyteller1 = (st1data: St1Data)=>{
    // let dominantBox = Container("Dominant personality", "#14c4ff", [
    //     st1data.personalities[0].cardData
    // ]);


    return Elem("div", {}, [ 
        Container("Dominant personality", "#14c4ff", []).elem,
        Spacer(10),
        Button("Set dice", ()=>{}).elem,
        Spacer(10),
        Container("Personalities", "#14c4ff", []).elem,
        Spacer(10),
        Button("End game", ()=>{}).elem,
        Spacer(10)
    ]);
}