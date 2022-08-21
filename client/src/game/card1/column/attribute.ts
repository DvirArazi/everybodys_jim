import { Elem } from "../../../core/Elem"
import { AttributeData, GoalData } from "../../../shared/types";
import { Button } from "../../button";

export const Attribute = (attributeData: AttributeData)=>{
    let leftChildren = [Elem("div", {innerText: "•"})];

    let goalData = (attributeData as GoalData);
    if (goalData.score != undefined) {
        leftChildren.push(Button("+1\npts", ()=>{}, true, {
        }).elem);
    }
    
    
    return Elem("div", {}, [
        
    ]);
}