import { socket } from "..";
import { Elem } from "../core/Elem"
import { Entry, Role } from "../shared/types";
import { Button } from "./button";
import { Spacer } from "./spacer";
import { Textarea } from "./textarea";

export const NewUser = (
    role: Role,
    entries: Entry[]
) => {
    let newRole: Role;
    let joinButton = Button("Join room", ()=>{
        socket.emit("construct", newRole);
    }, false);

    let roomExists = true;
    let reconnectionButtons = Elem("div", {}, (()=>{
        let rtn: HTMLElement[] = [];

        if (role.type != "NewUser") {
            let topIs: number[] = [];
            let btmIs: number[] = [];
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].roleType == role.type &&
                    (role.type == "Personality" ?
                        entries[i].roomcode == role.roomcode : true)
                ) {
                    topIs.push(i);
                } else {
                    btmIs.push(i);
                }
            }

            for (let indexes of [topIs, btmIs]) {
                for (let topI of indexes) {
                    let entry = entries[topI];
                    rtn.push(
                        Elem("div", {}, [
                            Spacer(5),
                            Button(
                                `Rejoin room ${entry.roomcode} as ${entry.roleType == "Storyteller" ? "the storyteller" : "a personality"}`,
                                ()=>{
                                    socket.emit("reconnect", entry);
                                }, true, 14
                            ).elem
                        ])
                    );
                }
            }
        }

        return rtn;
    })());
    
    
    return Elem("div", {}, [
        Button("Create a room", ()=>{socket.emit("construct", {type:"Storyteller"})}).elem,
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
                    newRole = {type:"Personality", roomcode:newValue};
                    joinButton.setEnabled(true);
                } else {
                    joinButton.setEnabled(false);
                }

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
        Elem("div", {innerText: roomExists? "" :
            `Room ${role} does not exist :/`    
        }),
        reconnectionButtons
    ]);
}