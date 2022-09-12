import { Elem } from "../../../core/elemm"
import { AttributeData, GoalData } from "../../../shared/types";
import { Button } from "../../button";

export const Attribute = (attributeData: AttributeData, onGoalScoreClick?: ()=>void)=>{
    let leftChildren: HTMLElement[] = [Elem("div", {innerText: "•"}, [], {
        margin: "0 12px 0 12px"
    })];

    let goalData = (attributeData as GoalData);
    if (goalData.score != undefined && onGoalScoreClick != undefined) {
        leftChildren.push(Button(`+${goalData.score}`, onGoalScoreClick, true, {
            background: "#00E673",
            boxShadow: "0 5px #00CC66",
            padding: "5px 5px 5px 5px",
            fontSize: "18px"
        }).elem);
    }

    let description = Elem("div", {innerText: attributeData.description}, [], {
        width: "100%",
        textAlign: "left",
        verticalAlign: "text-top",
        overflow: "auto",
        minHeight: "70px",
        maxHeight: "140px",
        paddingLeft: "5px",
        paddingRight: "5px",
    });
    
    return Elem("div", {}, [Elem("table", {}, [Elem("tr", {}, [
        Elem("td", {}, leftChildren, {
            verticalAlign: "top",
        }),
        Elem("td", {}, [description], {
            verticalAlign: "top",
            paddingRight: "5px",
            wordBreak: "break-word",
        })
    ])])], {
        paddingBottom: "5px",
    });
}