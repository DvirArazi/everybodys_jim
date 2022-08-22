import { Elem } from "../../../core/Elem"
import { AttributeData, GoalData } from "../../../shared/types";
import { Button } from "../../button";

export const Attribute = (attributeData: AttributeData)=>{
    let leftChildren = [Elem("div", {innerText: "•"})];

    let goalData = (attributeData as GoalData);
    if (goalData.score != undefined) {
        leftChildren.push(Button("+1", ()=>{}, true, {
            background: "#00E673",
            boxShadow: "0 5px #00CC66",
            padding: "5px 0 5px 0",
            width: "40px",
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