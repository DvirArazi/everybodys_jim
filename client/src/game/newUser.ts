import { socket } from "..";
import { Elem } from "../core/Elem"
import { Entry, ParamData } from "../shared/types";
import { Button } from "./button";
import { deleteEntry, getEntries } from "./entries";
import { Spacer } from "./spacer";
import { Textarea } from "./textarea";

export const NewUser = (
    role: ParamData,
    entries: Entry[]
) => {
    let newRole: ParamData;
    let joinButton = Button("Join room", ()=>{
        socket.emit("construct", newRole);
    }, false);

    let roomExists = true;
    let reconnectionButtons = Elem("div", {}, (()=>{
        let rtn: HTMLElement[] = [];

            let topIs: number[] = [];
            let btmIs: number[] = [];
            for (let i = 0; i < entries.length; i++) {
                if (role.type == "NewUser" ||
                    entries[i].role.type == role.type &&
                    (role.type == "Personality" ?
                        entries[i].roomcode == role.roomcode : true)
                ) {
                    topIs.push(i);
                } else {
                    btmIs.push(i);
                }
            }

            for (let indexes of [topIs, btmIs]) {
                for (let i = 0; i < indexes.length; i++) {
                    let index = indexes[i];
                    let entry = entries[index];
                    let row = Elem("div", {}, [
                        Spacer(5),
                        Elem("div", {}, [Button(
                            `Rejoin room ${entry.roomcode} as ${entry.role.type == "Storyteller" ? "the storyteller" : entry.role.name}`,
                            ()=>{
                                socket.emit("reconnect", entry);
                            }, true, {
                                fontSize: "14px",
                                height: "45px",
                                padding: "0 5px 0 5px",
                                borderRadius: "10px 0 0 10px"
                            }
                        ).elem], {display: "inline-block"}),
                        Elem("div", {}, [Button(
                            `Delete`,
                            ()=>{
                                deleteEntry(entry.id);
                                console.log(getEntries());
                                reconnectionButtons.removeChild(row);
                            }, true, {
                                fontSize: "14px",
                                height: "45px",
                                padding: "0 15px 0 15px",
                                background: "#ff8080",
                                boxShadow: "0 5px #ff6666",
                                borderRadius: "0 10px 10px 0",
                            }
                        ).elem], {display: "inline-block"})
                    ]);
                    rtn.push(row);
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