import { Elem } from "../core/Elem";
import { GoalColumn } from "./card/goalColumn";
import { NameInput } from "./card/nameInput";

export type CardOp = { //card on personality
    elem: Node,
}

export let CardOp = ( 
    abilitiesCount: number, goalsCount: number,
    onNameChange: (name: string)=>void,
    onAttributeChange: (columnI: number, attributeI: number, value: GoalChangeType)=>void
    ): CardOp => { 

    let nameInput = NameInput("Enter your name", onNameChange);
    
    return {
        elem: Elem("div", {}, [
            nameInput,
            Elem("table", {}, [
                Elem("tr", {}, [
                    GoalColumn("ability", abilitiesCount, (attributeI, value)=>{onAttributeChange(0, attributeI, value)}).elem,
                    GoalColumn("goal", goalsCount, (attributeI, value)=>{onAttributeChange(1, attributeI, value)}).elem
                ])
            ])
        ])
    };
}