import { Elem } from "../../../core/Elem";
import { CardType } from "../../card";
import { Textarea } from "../../textarea";
import { Checkbox } from "./attribute/checkbox";
import { Description } from "./attribute/description";
import { Scorebox } from "./attribute/scorebox";

export type Attribute = {
    elem: Node,
    update: (value: AttributeChange)=>void,
    isComplete: ()=>boolean
}

export const Attribute = (
    cardType: CardType, attributeType: AttributeType,
    onChange: (changeType: AttributeChange)=>void
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

    let scorebox: Scorebox | undefined = undefined;
    if (attributeType == "goal") {
        scorebox = Scorebox((value)=>{onChange({type:"score", value: value})});
        scorebox.setEnabled(cardType == "onStoryteller");
        leftChildren.push(scorebox.elem);
    }

    let description = Textarea({
        oninput: (ev)=>{
            let target = ev.target as HTMLTextAreaElement;
            target.value = target.value.replace('\n', "");

            target.style.height = "0px";
            target.style.height = target.scrollHeight > 70 ?
                target.scrollHeight + "px" :
                "70px";

            onChange({type: "description", value: target.value});
        },
    }, {}, {height: "70px"});

    return {
        elem: Elem("div" , {}, [
            Elem("table", {}, [
                Elem("tr", {}, [
                    Elem("td", {}, leftChildren, {
                        padding: "0px",
                    }),
                    Elem("td", {}, [description.elem], {
                        padding: "0px",
                        width: "100%"
                    })
                ], {
                })
            ], {
                borderSpacing: "0px",
            })
        ]),
        update: (attributeChangeType) => { 
            switch (attributeChangeType.type) {
                case "checkbox":
                    checkbox.update(attributeChangeType.value);
                break;
                case "score":
                    if (scorebox != undefined) {
                        scorebox.update(attributeChangeType.value);
                    }
                break;
                case "description":
                    description.update(attributeChangeType.value);
                break;
            }
        },
        isComplete: ()=>{
            return checkbox.isComplete() && 
            description.isComplete() &&
            ( scorebox == undefined ? true : scorebox.isComplete())
        ;}  
    };
}