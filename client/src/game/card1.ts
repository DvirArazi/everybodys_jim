import { CardData } from "../shared/types";
import { Elem } from "../core/Elem";
import { Column } from "./card1/column";

export const Card1 = (
    card1Data: CardData,
    onGoalScoreClick: (goalI: number)=>void
)=>{
    let boxShadow = "-2px -4px 9px 0px rgba(0,0,0,0.1)";
    let fallDist = 2;

    return Elem("div", {}, [
        Elem("table", {}, [ Elem("tr", {}, [
            //NAME
            Elem("td", {}, [
                Elem("div", {innerText: card1Data.name}, [], {
                    padding: "3px 0 2px 8px",
                })
            ], {
                textAlign: "left",
                width: "100%",
                background: "#4dffa6",
                borderRadius: "10px 0 0px 0",
                height: "100%",
            }),
            //SCORE
            Elem("td", {
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
                Elem("div", {innerText: `Score: ${card1Data.score}`}, [], {
                    padding: "3px 5px 2px 5px",
                    background: "#00FF80",
                    borderRadius: "5px 10px 0 0",
                    boxShadow: boxShadow,
                    position: "relative",
                    whiteSpace: "nowrap"
                })
            ], {
                background: "#4dffa6",
                textAlign: "left",
                borderRadius: "0px 10px 0 0",
                cursor: "pointer"
            })
        ], {})], {
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#00FF80",
            position: "relative",
            zIndex: "0"
        }),
        //BODY
        Elem("table", {}, [
            Elem("tr", {}, [
                Column(card1Data.abilities),
                Column(card1Data.goals, (goalI)=>onGoalScoreClick(goalI))
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
        borderRadius: "10px",
        background: "#00FF80",
        textAlign: "center"
    });
}