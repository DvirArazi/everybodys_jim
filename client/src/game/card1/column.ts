import { Elem } from "../../core/Elem"
import { AbilityData, AttributeData, GoalData } from "../../shared/types";
import { Attribute } from "./column/attribute";

export const Column = (attributesData: AttributeData[])=>{
    let attributes = [];

    for (let i = 0; i < attributesData.length; i++) {
        attributes.push(Attribute(attributesData[i]));
    }
    
    return Elem("td", {}, [ 
        Elem("div", {
            innerText: (attributesData[0] as GoalData).score == undefined ? "Abilities" : "Goals"}, [], {
                textAlign: "center"
            }),
        Elem("div", {}, attributes)
    ]);
}