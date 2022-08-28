import { socket } from "../..";
import { Elem } from "../../core/Elem";
import { Personality } from "../../shared/types";
import { isNumber } from "../../shared/utils";
import { Button } from "../button";
import { Modal } from "../modal"
import { Row } from "../row";
import { Spacer } from "../spacer";
import { Textarea } from "../textarea";

export const GrantModal = (per: Personality, goalI: number)=>{
    let goal = per.cardData.goals[goalI];
    let score = goal.score;

    let modal: HTMLDivElement;
    
    let button = Button("Send", ()=>{
        socket.emit("grantScore", per.id, parseInt(score), goalI, goal.description);
        modal.parentElement?.removeChild(modal);
    });

    modal = Modal("Grant score", true, Elem("div", {}, [
        Elem("div", {}, [
            Elem("span", {innerText: `Grant ${per.cardData.name} `}),
            Textarea({
                value: goal.score,
                oninput: (ev)=>{
                    let target = ev.target as HTMLTextAreaElement;
                
                    let newValue = "";

                    for (let char of target.value) {
                        if (char >= '0' && char <= '9') {
                            newValue += char;
                        }
                    }

                    if (newValue.length > 0) {
                        let num = parseInt(target.value);

                        if (num > 10) {
                            target.value = "10";
                        } else if (num < 1) {
                            target.value = "1";
                        } else {
                            target.value = num.toString();
                        }
                    } else {
                        target.value = newValue;
                    }

                    score = target.value;
                    button.setEnabled(isNumber(target.value))
                }
            }, {
                fontSize: "24px",
                height: "25px",
                width: "30px",
                display: "inline-block",
                transform: "translate(0, 4.5px)"
            }, {
                textAlign: "center",
            }).elem,
            Elem("span", {innerText: ` points for ${goal.description}`})
        ]),
        Spacer(10),
        Elem("textarea", {placeholder: "Enter an optional description"}, [], {
            width: "100%",
            height: "140px",
            resize: "none",
            boxSizing: "border-box",
            overflow: "hidden",
            borderRadius: "5px",
            borderWidth: "3px",
            padding: "5px",
            // boxShadow: "inset 0px 0px 10px 0px rgba(0,0,0,0.15)"
        }),
        Spacer(10),
        button.elem
    ], {
        padding: "25px"
    }));

    return modal;
}