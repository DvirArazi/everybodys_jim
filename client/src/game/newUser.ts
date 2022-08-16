import { Elem } from "../core/Elem"
import { Button } from "./button";
import { Spacer } from "./spacer";
import { Textarea } from "./textarea";

export const NewUser = (
    nullRoomcode: string,
    onCreateRoom: ()=>void,
    onRoute: (path: string)=>void
) => {
    let param = "";
    let joinButton = Button("Join room", ()=>{
        onRoute("/" + param);
    }, false);
    
    return Elem("div", {}, [
        Button("Create a room", onCreateRoom).elem,
        Spacer(15),
        Textarea({
            placeholder: "Enter room code here",
            oninput: (ev)=>{
                let target = (ev.target as HTMLTextAreaElement);
                let newValue = "";
                for(let i = 0; i < 4; i++) {
                    let char = target.value[i];
                    if ((char >= 'a' && char <= 'z')) {
                        newValue += char.toUpperCase();
                    } else if (char >= 'A' && char <= 'Z') {
                        newValue += char;
                    }
                }
                if (newValue != "") {
                    target.style.fontSize = "40px";
                } else {
                    target.style.fontSize = "25px";
                }

                if (newValue.length == 4) {
                    joinButton.setEnabled(true);
                } else {
                    joinButton.setEnabled(false);
                }

                param = newValue;
                target.value = newValue;
            }
        }, {
            width: "260px",
            margin: "auto"
        }, {
            lineHeight: "45px",
            overflow: "hidden",
            alignSelf: "center",
            fontSize: "25px",
            textAlign: "center",
            height: "45px",
            width: "260px"
        }).elem,
        Spacer(10),
        joinButton.elem,
        Spacer(10),
        Elem("div", {innerText: nullRoomcode != "" ? 
            `Room ${nullRoomcode} does not exist :/` : ``    
        })
    ]);
}