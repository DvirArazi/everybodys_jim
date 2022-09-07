import { Elem } from "../../core/elemm"
import { AbilityData, AttributeData, GoalData } from "../../shared/types";
import { Attribute } from "./column/attribute";

export const Column = (attributesData: AttributeData[], onGoalScoreClick?: (goalI: number)=>void)=>{
    let attributes = [];

    for (let i = 0; i < attributesData.length; i++) {
        if ((attributesData[0] as GoalData).score != undefined && onGoalScoreClick != undefined) {
            attributes.push(Attribute(attributesData[i], ()=>{onGoalScoreClick(i)}));
        } else {
            attributes.push(Attribute(attributesData[i]));
        }
    }

    let isGoal = (attributesData[0] as GoalData).score != undefined;
    
    return Elem("td", {}, [ 
        Elem("div", {innerText: isGoal ? "Goals" : "Abilities"}, [], {
                padding: "5px",
            }),
        Elem("div", {}, attributes)
    ], {
        width: "50%",
        verticalAlign: "text-top",
        paddingRight: "10px",
    });
}