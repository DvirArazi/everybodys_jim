import { Elem } from "../core/Elem"
import { Button } from "./button";
import { Spacer } from "./spacer";
import { Textarea } from "./textarea";

export const NewUser = (
    param: string,
    clientDatas: NewData,
    router: (path: string, newGame: boolean)=>void
) => {
    let newParam = "";
    let joinButton = Button("Join room", ()=>{
        router("/" + newParam, true);
    }, false);

    let roomExists = false;

    let reconnectionButtons = Elem("div", {}, (()=>{
        let rtn: Node[] = [];

        let topIs: number[] = [];
        let btmIs: number[] = [];
        if (param != "") {
            if (param == "st") {
                for (let i = 0; i < clientDatas.length; i++) {
                    if (clientDatas[i].role == "Storyteller") {
                        topIs.push(i);
                    } else {
                        btmIs.push(i);
                    }
                }
            } else if (param.length == 4) {
                for (let i = 0; i < clientDatas.length; i++) {
                    let clientData = clientDatas[i];
                    if (clientData.role == "Personality" &&
                        clientData.roomcode == param
                    ) {
                        roomExists = true;
                        topIs.push(i);
                    } else {
                        btmIs.push(i);
                    }
                }
            }

            for (let indexes of [topIs, btmIs]) {
                for (let topI of indexes) {
                    let {role, roomcode} = clientDatas[topI];
                    rtn.push(Button(
                        `Return to room ${roomcode} as ${role == "Storyteller" ? "the storyteller" : "a personality"}`,
                        ()=>{}, true, 14).elem
                    );
                }
            }
        }

        return rtn;
    })());
    
    
    return Elem("div", {}, [
        Button("Create a room", ()=>{router("/st", true);}).elem,
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

                newParam = newValue;
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
        Elem("div", {innerText: roomExists || param.length != 4 ? "" :
            `Room ${param} does not exist :/`    
        }),
        reconnectionButtons
    ]);
}