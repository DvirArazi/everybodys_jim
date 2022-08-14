import { Elem } from "../../core/Elem";
import { Goal } from "./column/goal";

export const GoalColumn = (
    attributeType: AttributeType, attributeCount: number,
    onAttributeChange: (attributeI: number, value: GoalChangeType)=>void
    ) => {
    
    let goals: Goal[] = [];
    for (let i = 0; i < attributeCount; i++) {
        goals.push(Goal(attributeType, (value)=>{onAttributeChange(i, value);}));
    }

    return {
        elem: Elem("td", {}, [
            Elem("div", {
                innerText: attributeType == "ability" ?
                    "Abilities" :
                    "Goals"
            }),
            Elem("div", {}, goals.map((attribute)=>{return attribute.elem;}))
        ])
        ,
        updateAttribute: (attributeI: number, value: GoalChangeType)=>{goals[attributeI].update(value);}
    };
}