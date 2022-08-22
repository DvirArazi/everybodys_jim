import { Elem } from "../core/Elem";
import { CardData } from "../shared/types";
import { Column } from "./card1/column";

export const Card1 = (
    cardData: CardData
)=>{
    let boxShadow = "-2px -4px 9px 0px rgba(0,0,0,0.1)";
    let fallDist = 2;

    return Elem("div", {}, [
        Elem("div", {}, [
            //NAME
            Elem("div", {}, [
                Elem("div", {innerText: cardData.name}, [], {
                    padding: "5px 0 5px 8px",
                })
            ], {
                display: "inline-block",
                
                textAlign: "left",
                width: "calc(100% - 100px)",
                background: "#4dffa6",
                borderRadius: "10px 0 0px 0",
                height: "100%",
            }),
            //SCORE
            Elem("div", {
                onclick: ()=>{

                },
                onmousedown: (ev)=>{
                    let target = ev.target as HTMLDivElement;
                    target.style.boxShadow = "";
                    target.style.top = fallDist + "px";
                },
                onmouseup: (ev)=>{
                    let target = ev.target as HTMLDivElement;
                    target.style.boxShadow = boxShadow;
                    target.style.top = "0px";
                }
            }, [
                Elem("div", {innerText: "Score: 10"}, [], {
                    padding: "5px",
                    background: "#00FF80",
                    borderRadius: "5px 10px 0 0",
                    boxShadow: boxShadow,
                    position: "relative",
                    // top: fallDist + "px"
                })
            ], {
                display: "inline-block",
                textAlign: "left",
                width: "100px",
                background: "#4dffa6",
                borderRadius: "0px 10px 0 0",
                cursor: "pointer"
            })
        ], {
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#00FF80",
            position: "relative",
            zIndex: "0"
        }),
        Elem("table", {}, [
            Elem("tr", {}, [
                Column(cardData.abilities),
                Column(cardData.goals)
            ])
        ], {
            width: "100%",
            borderRadius: "0 0 10px 10px",
            background: "#00FF80",
            position: "relative",
            zIndex: "10"
        })
    ],
    {
        width: "100%",
        borderSpacing: "0px",
        borderRadius: "10px",
        background: "#00FF80"
    });
}