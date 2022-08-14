import { Elem } from "../../../core/Elem";
import { CardType } from "../../card";
import { Checkbox } from "./attribute/checkbox";
import { Description } from "./attribute/description";
import { Scorebox } from "./attribute/scorebox";

export type Attribute = {
    elem: Node,
    update: (value: AttributeChangeType)=>void
}

export const Attribute = (
    cardType: CardType, attributeType: AttributeType,
    onChange: (changeType: AttributeChangeType)=>void
    ): Attribute => {
    
    let bla = document.createElement("div");
    bla.style.color = "";

    const leftChildren: Node[] = [];

    let checkbox = cardType == "onStoryteller" ?
        Checkbox(true, (checked)=>{
            onChange({type: "checkbox", value: checked});
        }) : 
        Checkbox(false, ()=>{})
    ;
    leftChildren.push(checkbox.elem);

    let scorebox: HTMLTextAreaElement | undefined = undefined;
    if (attributeType == "goal") {
        scorebox = Scorebox((value)=>{onChange({type:"score", value: value})});
        leftChildren.push(scorebox);
    }

    let description = Description((value)=>{
        onChange({type: "description", value: value});
    });

    return {
        elem: Elem("div", {}, [
            Elem("div", {}, [
                Elem("td", {}, leftChildren),
                Elem("td", {}, [description.elem])
            ], {
                borderCollapse: "collapse"
            })
        ], {
            display: "table"
        }),
        update: (attributeChangeType) => { 
            switch (attributeChangeType.type) {
                case "checkbox":
                    checkbox.update(attributeChangeType.value);
                break;
                case "score":
                    if (scorebox != undefined) {
                        scorebox.value = attributeChangeType.value;
                    }
                break;
                case "description":
                    description.update(attributeChangeType.value);
                break;
            }
        }    
    };
}