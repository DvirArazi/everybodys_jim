import { socket } from "../..";
import { Elem } from "../../core/Elem";
import { GoalRecord, GoalRequest } from "../../shared/types";
import { Button } from "../button";
import { Modal } from "../modal";
import { Spacer } from "../spacer";
import { RequestSt } from "../storyteller1";

export const MailModal = (requestSts: RequestSt[])=>{
    let div = Elem("div", {}, [], { padding: "15px 25px 25px 25px" });
    let messageDiv = Elem("div",
        {innerText: "There are no records yet"}, [], {
            height: "100px",
            paddingBottom: "12px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
        }
    );
    div.appendChild(messageDiv);

    //Request to Element
    //==================
    let requestToElem = (req: RequestSt) => {
        messageDiv.style.display = "none";

        let rtn: HTMLDivElement;

        let onSend = ()=>{
            rtn.remove();
            if (div.children.length <= 1) {
                messageDiv.style.display = "flex";
            }
        };

        let reason: string | undefined;
    
        let reasonDiv = Elem("div", {}, [
            Elem("textarea", {
                placeholder: "Enter an optional reason for refusal",
                onchange: (ev)=>{
                    let target = ev.target as HTMLTextAreaElement;
                    reason = target.value;
                }
            }, [], {
                width: "100%",
                maxWidth: "370px",
                marginBottom: "3px",
                height: "140px",
                resize: "none",
                boxSizing: "border-box",
                overflow: "hidden",
                borderRadius: "5px",
                borderWidth: "3px",
                padding: "5px",
            }),
            Button("Send", ()=>{
                socket.emit("responseScore", req.perId, {
                    accepted: false,
                    reason,
                    ...req,
                });
                onSend();
            }, true, {
                fontSize: "22px",
                padding: "5px 10px 5px 10px",
                background: "#ff4d4d",
                boxShadow: "0 5px #ff0000",
            }).elem,
            Spacer(5),
        ], { display: "none" });
    
        rtn = Elem("div", {}, [
            Elem("table", {}, [ Elem("tr", {}, [
                Elem("td", {}, [
                    Elem("div", {}, [
                        Elem("div", {innerText: req.perName}, [], {
                            fontSize: "28px",
                            textAlign: "left",
                            paddingLeft: "15px",
                        }),
                        Elem("div", {innerText: `\
                            requests ${req.score} points for \
                            ${req.description}`
                        }, [], {
                            textAlign: "left",
                            paddingLeft: "10px",
                            paddingBottom: "5px",
                        }),
                        Elem("div", {innerText: req.explanation}, [], {
                            background: "#80eeff",
                            borderRadius: "5px",
                            padding: "5px",
                            marginBottom: "15px",
                        }),
                    ], {
                        marginRight: "10px",
                    })
                ], {
                    width: "100%"
                }),
                Elem("td", {}, [
                    Button("Accept", ()=>{
                        socket.emit("responseScore", req. perId, {
                            accepted: true,
                            ...req,
                        });
                        onSend();
                    }, true, {
                        fontSize: "18px",
                        padding: "5px 10px 5px 10px",
                        background: "#00E673",
                        boxShadow: "0 5px #00CC66",
                    }).elem,
                    Spacer(3),
                    Button("decline", ()=>{reasonDiv.style.display = "block"}, true, {
                        fontSize: "18px",
                        padding: "5px 10px 5px 10px",
                        background: "#ff4d4d",
                        boxShadow: "0 5px #ff0000",
                    }).elem
                ], {
                    textAlign: "right"
                })
            ])], {
                width: "100%",
            }),
            reasonDiv,
        ], {
            background: "#14E1FF",
            padding: "10px 10px 0 10px",
            marginTop: "10px",
            borderRadius: "10px",
        })
    
        return rtn;
    }

    //Append requests to modal
    //========================
    div.append(...(requestSts.map(requestSt=>requestToElem(requestSt))));

    let modal = Modal("Requests", "minimize", div);

    return {
        elem: modal,
        setVisible: ()=>modal.style.display = "block",
        addRequest: (requestSt: RequestSt) => {
            div.prepend(requestToElem(requestSt));
        }
    }
}

