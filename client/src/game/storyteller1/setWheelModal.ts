import { socket } from "../.."
import { Elem } from "../../core/Elem"
import { Button } from "../button"
import { Modal } from "../modal"
import { Spacer } from "../spacer"
import { Textarea } from "../textarea"

export const SetWheelModal = ()=>{
    let Skull = ()=>{
        let width = 100;
        let height = 100;

        return Elem("img", {
            src: "svg/skull.svg",
            width: width,
            height: height,
        });
    }

    let value: number;

    let button = Button("Continue", ()=>{
        socket.emit("wheelSet", value/10);
        modal.parentElement?.removeChild(modal);
    }, false)

    let row = Elem("table", {}, [Elem("tr", {}, [
        Elem("td", {}, [
            Textarea({
                placeholder: "1-7",
                rows: 1,
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
    
                        if (num > 7) {
                            target.value = "7";
                        } else if (num < 1) {
                            target.value = "1";
                        } else {
                            target.value = num.toString();
                        }
                    } else {
                        target.value = newValue;
                    }

                    value = parseInt(newValue);
                    
                    button.setEnabled(!isNaN(value));
                }
            },{
                borderColor: "#00e6e6"
            }, {
                fontSize: "42px",
                height: "1em",
                width: "80px",
                color: "red",
                textAlign: "center",
                overflow: "clip"
            }).elem
        ]),
        Elem("td", {}, [Elem("div", {innerText: "/10"})], {fontSize: "42px"})
    ])], {
        width: "100px",
        margin: "auto"
    });

    let modal = Modal("Set the wheel", "close", Elem("div", {}, [
        Elem("div", {innerText: "Set the chance of faliure:"}),
        Spacer(10),
        Skull(),
        Spacer(10),
        row,
        Spacer(15),
        button.elem
    ], {
        padding: "20px"

    }))

    return modal;
}