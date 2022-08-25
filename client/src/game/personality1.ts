import { Elem } from "../core/Elem";
import { Ps1Data } from "../shared/types";
import { Card1 } from "./card1";
import { Container } from "./container";


export const Personality1 = (ps1Data: Ps1Data)=>{
    return Container("", "#14c4ff", [
        Card1(ps1Data)
    ]);
}