import { Elem } from "../core/Elem";
import { Column } from "./card/column";
import { NameInput } from "./card/nameInput";

export type CardType = "onStoryteller" | "onPersonality";

export type Card = {
    elem: Node,
    updateName: (name: string)=>void,
    updateAttribute: (columnI: number, attributeI: number, value: AttributeChangeType)=>void
}

export let Card = (
    cardType: CardType, abilitiesCount: number, goalsCount: number,
    onNameChange: (name: string)=>void,
    onAttributeChange: (columnI: number, attributeI: number, value: AttributeChangeType)=>void
    ): Card => { 

    let nameDiv = cardType == "onStoryteller" ?
        Elem("div") :
        NameInput("Enter your name", (name)=>{onNameChange(name)});

    let columns = [
        Column(cardType, "ability", abilitiesCount, (attributeI, value)=>{onAttributeChange(0, attributeI, value);}),
        Column(cardType, "goal", goalsCount, (attributeI, value)=>{onAttributeChange(1, attributeI, value);})
    ];
    
    return {
        elem: Elem("div", {}, [
            nameDiv,
            Elem("table", {}, [
                Elem("tr", {}, columns.map((column)=>{return column.elem;}))
            ], {
                width: "100%"
            })
        ], {
            background: "yellow",
        }),
        updateName: (name: string)=>{ nameDiv.innerHTML = name; },
        updateAttribute: (columnI, attributeI, value)=>{columns[columnI].updateAttribute(attributeI, value);}
    };
}