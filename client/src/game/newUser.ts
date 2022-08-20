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
        let rtn: Node[] = [];

        let topIs: number[] = [];
        let btmIs: number[] = [];
        if (role.type != "NewUser") {
            if (role.type == "Storyteller") {
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i].roleType == "Personality") {
                        topIs.push(i);
                    } else {
                        btmIs.push(i);
                    }
                }
            } else if (role.type == "Personality") {
                roomExists = false;
                for (let i = 0; i < entries.length; i++) {
                    let entry = entries[i];
                    if (entry.roleType == "Personality" &&
                        entry.roomcode == role.roomcode
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
                    let {roleType: role, roomcode} = entries[topI];
                    rtn.push(Button(
                        `Return to room ${roomcode} as ${role == "Personality" ? "the storyteller" : "a personality"}`,
                        ()=>{}, true, 14).elem
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