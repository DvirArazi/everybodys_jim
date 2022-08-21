import { Elem } from "../../core/Elem"
import { AttributeData } from "../../shared/types";
import { Attribute } from "./column/attribute";

export const Column = (attributeCount: number, attributeData: AttributeData)=>{
    let attributes = [];

    for (let i = 0; i < attributeCount; i++) {
        attributes.push(Attribute(attributeData));
    }
    
    return Elem("td", {}, attributes);
}