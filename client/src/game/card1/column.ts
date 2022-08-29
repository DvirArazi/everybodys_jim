import { Elem } from "../../core/Elem"
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
    
    return Elem("td", {}, [ 
        Elem("div", {
            innerText: (attributesData[0] as GoalData).score == undefined ? "Abilities" : "Goals"}, [], {
                textAlign: "center"
            }),
        Elem("div", {}, attributes)
    ]);
}