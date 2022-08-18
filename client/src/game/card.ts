import { Elem } from "../core/Elem";
import { Column } from "./card/column";
import { Spacer } from "./spacer";
import { Textarea } from "./textarea";
import { VisibilityBox } from "./visibilityBox";

export type CardType = "onStoryteller" | "onPersonality";

export type Card = {
    elem: Node,
    getName: ()=>string,
    update: (cardChangeType: CardChange)=>void,
    set: (name: string, abilities: AbilityData[], goals: GoalData[])=>void
    setVisible: (visible: boolean)=>void,
    isComplete: ()=>boolean
}

export let Card = (
    cardType: CardType, abilitiesCount: number, goalsCount: number,
    onChange: (cardChangeType: CardChange)=>void
): Card => { 

    let nameDiv = Elem("div", {}, [(()=>{
        return cardType == "onStoryteller" ?
            Elem("div", {}, [], {})
            :
            Textarea({
                    className: "cardTextarea",
                    placeholder: "Enter your name",
                    oninput: (ev)=>{
                        let target = ev.target as HTMLTextAreaElement;
                        target.value = target.value.replace('\n', "");
                        onChange({type: "name", value: target.value});
                    },
                }, {
                    border: "none"
                }, {
                    fontSize: "20px",
                    height: "25px",
                }
                , false
            ).elem
    })()], {
        padding: "3px 0 0px 5px",
        borderRadius: "10px 10px 0 0",
        backgroundColor: "#4dffa6"
    });

    let columns = [
        Column(cardType, "ability", abilitiesCount, (attributeI, value)=>{
            onChange({type:"attribute", columnI: 0, attributeI, attributeChange: value});
        }),
        Column(cardType, "goal", goalsCount, (attributeI, value)=>{
            onChange({type:"attribute", columnI: 1, attributeI, attributeChange: value});
        })
    ];

    let visibilityBox = VisibilityBox([
            Elem("div", {}, [
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
        })
    ]);
    
    return {
        elem: Elem("div", {}, [Spacer(2.5), visibilityBox.elem]),
        getName: ()=>{return nameDiv.innerText;},
        update: (cardChangeType)=>{
            switch (cardChangeType.type) {
                case "name":
                    nameDiv.innerText = cardChangeType.value;
                break;
                case "attribute":
                    let {columnI, attributeI, attributeChange: attributeChangeType} = cardChangeType;
                    columns[columnI].updateAttribute(attributeI, attributeChangeType);
                break;
            }
        },
        set: (name: string, abilities: AbilityData[], goals: GoalData[])=>{
            nameDiv.innerText = name;
            columns[0].set(abilities);
            columns[1].set(goals);
        },
        setVisible: visibilityBox.setVisible,
        isComplete: ()=>{
            return columns.every((column)=>{return column.isComplete();});
        }
    };
}