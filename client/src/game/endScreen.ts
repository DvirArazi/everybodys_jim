import { socket } from "..";
import { Elem } from "../core/elemm";
import { Personality } from "../shared/types";
import { Button } from "./button";
import { Card1 } from "./card1";
import { Container } from "./container";
import { Spacer } from "./spacer";

export const EndScreen = (pers: Personality[], winnerCount: number, addButton: boolean)=>{
    let children = [];
    
    let winnerBox = Elem("div", {
        className: "winner",
    }, [
        Elem("div", {
            innerText: winnerCount == 1 ? "Winner" : "Winners"
        }, [], {margin: "0 0 1px 5px"}),
        ...pers.slice(0, winnerCount).map(per=>{
            return Elem("div", {}, [
                Spacer(2.5),
                Card1(
                    per.cardData,
                    per.records,
                    ()=>{},
                    (_)=>{}
                ).elem
            ])
        })
    ], {
        textAlign: "left",

        padding: "5px 5px 5px 5px",
        margin: "auto",

        maxWidth: "400px",
        borderRadius: "15px",

        boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.1)"
    });
    children.push(winnerBox);

    if (pers.length > winnerCount) {
        let restBox = Container("Personalities", "#14c4ff", 
            pers.slice(winnerCount).map(per=>{
                return Elem("div", {}, [
                    Spacer(2.5),
                    Card1(
                        per.cardData,
                        per.records,
                        ()=>{},
                        (_)=>{}
                    ).elem
                ])
            })
        );
        children.push(Spacer(15), restBox.elem);
    }

    if (addButton) {
        let newGameButton = Button("New game", ()=>{socket.emit("newGame")});
        children.push(Spacer(15), newGameButton.elem);
    }

    return Elem("div", {}, children);
}