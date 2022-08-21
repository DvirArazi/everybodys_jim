
import { Elem } from "../core/Elem";
import { CardChange, CardData, RoleType } from "../shared/types";
import { Column } from "./card/column";
import { Spacer } from "./spacer";
import { Textarea } from "./textarea";
import { VisibilityBox } from "./visibilityBox";

export type Card0 = {
    elem: Node,
    getName: ()=>string,
    update: (cardChangeType: CardChange)=>void,
    set: (cardData: CardData)=>void
    isComplete: ()=>boolean
}

export let Card0 = (
    roleType: RoleType, abilitiesCount: number, goalsCount: number,
    onChange: (cardChangeType: CardChange)=>void
): Card0 => { 
    let nameDiv = Elem("div", {}, [], {
        padding: "3px 0 0px 5px",
        borderRadius: "10px 10px 0 0",
        backgroundColor: "#4dffa6"
    });;
    let setName: (name: string)=>void;
    switch (roleType) {
        case "Storyteller": {
            nameDiv.appendChild(Elem("div", {}, [], {}));
            setName = (name)=>{nameDiv.innerText = name};
            break;
        }
        case "Personality": {
            let textarea = Textarea(
                {
                    className: "cardTextarea",
                    placeholder: "Enter your name",
                    oninput: (ev)=>{
                        let target = ev.target as HTMLTextAreaElement;
                        target.value = target.value.replace('\n', "");
                        onChange({type: "name", name: target.value});
                    },
                }, {
                    border: "none"
                }, {
                    fontSize: "20px",
                    height: "25px",
                }
                , false
            );
            nameDiv.appendChild(textarea.elem);
            setName = (name)=>{textarea.update(name)};
            break;
        }
    }

    let columns = [
        Column(roleType, "ability", abilitiesCount, (attributeI, value)=>{
            onChange({type:"attribute", columnI: 0, attributeI, attributeChange: value});
        }),
        Column(roleType, "goal", goalsCount, (attributeI, value)=>{
            onChange({type:"attribute", columnI: 1, attributeI, attributeChange: value});
        })
    ];
    
    return {
        elem: Elem("div", {}, [
            nameDiv,
            Elem("div", {}, [
                Elem("table", {
                }, [
                    Elem("tr", {}, columns.map((column)=>{return column.elem;}))
                ], {
                    width: "100%"
                })
            ], {
                padding: "0 5px 1px 0"
            }),
        ], {
            borderSpacing: "0px",
            borderRadius: "10px",
            background: "#00FF80"//"#00cc66"//"#4dffa6",
        }),
        getName: ()=>{return nameDiv.innerText;},
        update: (cardChangeType)=>{
            switch (cardChangeType.type) {
                case "name":
                    nameDiv.innerText = cardChangeType.name;
                break;
                case "attribute":
                    let {columnI, attributeI, attributeChange: attributeChangeType} = cardChangeType;
                    columns[columnI].updateAttribute(attributeI, attributeChangeType);
                break;
            }
        },
        set: ({name, abilities, goals}: CardData)=>{
            setName(name);
            columns[0].set(abilities);
            columns[1].set(goals);
        },
        isComplete: ()=>{
            return columns.every((column)=>{return column.isComplete();});
        }
    };
}