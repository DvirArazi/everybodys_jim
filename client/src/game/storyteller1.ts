import { Elem } from "../core/Elem";
import { Button } from "./button";
import { Container } from "./container"
import { Spacer } from "./spacer";

export const Storyteller1 = ()=>{
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