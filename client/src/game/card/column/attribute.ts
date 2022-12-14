import { Elem } from "../../../core/elemm";
import { AttributeChange, AttributeData, AttributeType, GoalData, RoleType} from "../../../shared/types";
import { Textarea } from "../../textarea";
import { Checkbox } from "./attribute/checkbox";
import { Scorebox } from "./attribute/scorebox";

export type Attribute = {
    elem: Node,
    update: (value: AttributeChange)=>void,
    set: (attributeData: AttributeData)=>void
    isComplete: ()=>boolean,
    getData: ()=>AttributeData
}

export const Attribute = (
    roleType: RoleType, attributeType: AttributeType,
    onChange: (changeType: AttributeChange)=>void
): Attribute => {
    
    let bla = document.createElement("div");
    bla.style.color = "";

    const leftChildren: Node[] = [];

    let checkbox = roleType == "Storyteller" ?
        Checkbox(true, (checked)=>{
            onChange({type: "checkbox", value: checked});
        }) : 
        Checkbox(false, ()=>{})
    ;
    leftChildren.push(checkbox.elem);

    let scorebox: Scorebox | undefined = undefined;
    if (attributeType == "goal") {
        scorebox = Scorebox((value)=>{onChange({type: "score", value: value})});
        scorebox.setEnabled(roleType == "Storyteller");
        leftChildren.push(scorebox.elem);
    }

    let description = Textarea({
        oninput: (ev)=>{
            let target = ev.target as HTMLTextAreaElement;
            target.value = target.value.replace('\n', "");

            target.style.height = "0px";
            target.style.height = 
                target.scrollHeight < 70 ? "70px" : 
                target.scrollHeight > 140 ? "140px" :
                target.scrollHeight + "px";

            onChange({type: "description", value: target.value});
        },
    }, {}, {height: "70px", overflow: "auto",});

    return {
        elem: Elem("div" , {}, [
            Elem("table", {}, [
                Elem("tr", {}, [
                    Elem("td", {}, leftChildren, {
                        padding: "5px 0 0 0",
                        verticalAlign: "top"
                    }),
                    Elem("td", {}, [description.elem], {
                        paddingLeft: "5px",
                        width: "100%"
                    })
                ])
            ])
        ]),
        update: (attributeChange) => { 
            switch (attributeChange.type) {
                case "checkbox":
                    checkbox.update(attributeChange.value);
                    description.setEnabled(!attributeChange.value);
                break;
                case "score":
                    if (scorebox != undefined) {
                        scorebox.update(attributeChange.value);
                    }
                break;
                case "description":
                    description.update(attributeChange.value);
                break;
            }
        },
        set:(attributeData: AttributeData)=>{
            if (attributeData.approved != undefined) {
                checkbox.update(attributeData.approved);
                if (roleType == "Personality") {
                    description.setEnabled(!attributeData.approved);
                }
            }
            description.update(attributeData.description);
            let goalData = (attributeData as GoalData);
            if (goalData.score != undefined && scorebox != undefined) {
                scorebox.update(goalData.score);
            }
        },
        isComplete: ()=>{
            return checkbox.isComplete() && 
            description.isComplete() &&
            ( scorebox == undefined ? true : scorebox.isComplete());
        },
        getData: ()=>{
            return {
                approved: undefined,
                description: description.getValue(),
                score: scorebox?.getValue()
            }
        }
    };
}