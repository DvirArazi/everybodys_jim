import { CardData, GoalRecord } from "../shared/types";
import { Elem } from "../core/elemm";
import { Column } from "./card1/column";
import { RecordsModal } from "./personality1/recordsModal";

export type Card1 = {
    elem: HTMLElement,
    addRecord: (response: GoalRecord)=>void,
    isRecordsModalVisible: ()=>boolean,
}

export const Card1 = (
    cardData: CardData,
    records: GoalRecord[],
    onScoreClick: ()=>void,
    onGoalScoreClick: (goalI: number)=>void
):Card1 =>{
    let allScore = cardData.score;

    let scoreDiv = Elem("div", {
        className: "allScoreButton",
        innerText: `Score: ${allScore}`
    }, [], {
        padding: "3px 5px 2px 5px",
        background: "#00FF80",
        borderRadius: "5px 10px 0 0",
        position: "relative",
        whiteSpace: "nowrap"
    });

    let recordsModal = RecordsModal(records);

    let isDown = false;

    return {
        elem: Elem("div", {}, [
            Elem("table", {}, [ Elem("tr", {}, [
                //NAME
                Elem("td", {}, [
                    Elem("div", {innerText: cardData.name}, [], {
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
                    onclick: (ev)=>{
                        recordsModal.setVisible();
                        onScoreClick();
                    },
                }, [scoreDiv], {
                    // position: "absolute",
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
                    Column(cardData.abilities),
                    Column(cardData.goals, (goalI)=>onGoalScoreClick(goalI))
                ])
            ], {
                width: "100%",
                borderRadius: "0 0 10px 10px",
                background: "#00FF80",
                position: "relative",
                zIndex: "10",

                tableLayout: "fixed"
                // display: "flex",
            }),
            recordsModal.elem
        ],
        {
            width: "100%",
            borderRadius: "10px",
            background: "#00FF80",
            textAlign: "center",
        }),
        addRecord: (record: GoalRecord)=>{
            recordsModal.addRecord(record);

            if (record.accepted) {
                allScore += record.score;
                scoreDiv.innerText = `Score: ${allScore}`;
            }
        },
        isRecordsModalVisible: ()=>recordsModal.elem.style.display != "none"
    };
}