import { Elem } from "../../../core/Elem"
import { AttributeData, GoalData } from "../../../shared/types";
import { Button } from "../../button";

export const Attribute = (attributeData: AttributeData)=>{
    let leftChildren: HTMLElement[] = [Elem("div", {innerText: "•"}, [], {
        margin: "0 6px 0 6px"
    })];

    let goalData = (attributeData as GoalData);
    if (goalData.score != undefined) {
        leftChildren.push(Button(`+${goalData.score}`, ()=>{}, true, {
            background: "#00E673",
            boxShadow: "0 5px #00CC66",
            padding: "5px 5px 5px 5px",
            fontSize: "18px"
        }).elem);
    }
    
    return Elem("div", {}, [Elem("table", {}, [Elem("tr", {}, [
        Elem("td", {}, leftChildren, {
            verticalAlign: "top"
        }),
        Elem("td", {}, [Elem("div", {innerText: attributeData.description}, [], {
            width: "100%",
            height: "70px"
        })])
    ])])]);
}