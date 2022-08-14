import { Elem } from "../../core/Elem";
import { CardType } from "../card";
import { Attribute } from "./column/attribute";

export const Column = (
    cardType: CardType, attributeType: AttributeType, attributeCount: number,
    onAttributeChange: (attributeI: number, value: AttributeChangeType)=>void
    ) => {
    
    let attributes: Attribute[] = [];
    for (let i = 0; i < attributeCount; i++) {
        attributes.push(Attribute(cardType, attributeType, (value)=>{onAttributeChange(i, value);}));
    }

    return {
        elem: Elem("td", {}, [
            Elem("div", {
                innerText: attributeType == "ability" ?
                    "Abilities" :
                    "Goals"
            }),
            Elem("div", {}, attributes.map((attribute)=>{return attribute.elem;}))
        ], {
            background: "orange"
        }),
        updateAttribute: (attributeI: number, value: AttributeChangeType)=>{attributes[attributeI].update(value);}
    };
}