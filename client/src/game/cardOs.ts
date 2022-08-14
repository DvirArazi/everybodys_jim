import { Elem } from "../core/Elem";
import { GoalColumn } from "./card/goalColumn";

export type CardOs = { //card on storyteller
    elem: Node,
    updateName: (name: string)=>void,
    updateAttribute: (columnI: number, attributeI: number, value: GoalChangeType)=>void
}

export let CardOs = (
    abilitiesCount: number, goalsCount: number,
    onAttributeChange: (columnI: number, attributeI: number, value: GoalChangeType)=>void
    ): CardOs => { 

    let nameDiv = Elem("div");
    let columns = [
        GoalColumn("ability", abilitiesCount, (attributeI, value)=>{onAttributeChange(0, attributeI, value);}),
        GoalColumn("goal", goalsCount, (attributeI, value)=>{onAttributeChange(1, attributeI, value);})
    ];
    
    return {
        elem: Elem("div", {}, [
            nameDiv,
            Elem("table", {}, [
                Elem("tr", {}, columns.map((column)=>{return column.elem;}))
            ])
        ]),
        updateName: (name: string)=>{ nameDiv.innerHTML = name; },
        updateAttribute: (columnI, attributeI, value)=>{columns[columnI].updateAttribute(attributeI, value);}
    };
}