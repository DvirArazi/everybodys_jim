import { Elem } from "../core/Elem";
import { Column } from "./card/column";
import { Textarea } from "./textarea";
import { VisibilityBox } from "./visibilityBox";

export type CardType = "onStoryteller" | "onPersonality";

export type Card = {
    elem: Node,
    updateName: (name: string)=>void,
    getName: ()=>string,
    updateAttribute: (columnI: number, attributeI: number, value: AttributeChangeType)=>void,
    setVisible: (visible: boolean)=>void
}

export let Card = (
    cardType: CardType, abilitiesCount: number, goalsCount: number,
    onNameChange: (name: string)=>void,
    onAttributeChange: (columnI: number, attributeI: number, value: AttributeChangeType)=>void
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
                        onNameChange(target.value);
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
        Column(cardType, "ability", abilitiesCount, (attributeI, value)=>{onAttributeChange(0, attributeI, value);}),
        Column(cardType, "goal", goalsCount, (attributeI, value)=>{onAttributeChange(1, attributeI, value);})
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
        elem: visibilityBox.elem,
        updateName: (name: string)=>{ nameDiv.innerHTML = name; },
        getName: ()=>{return nameDiv.innerText;},
        updateAttribute: (columnI, attributeI, value)=>{columns[columnI].updateAttribute(attributeI, value);},
        setVisible: visibilityBox.setVisible
    };
}