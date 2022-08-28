import { socket } from "../..";
import { Elem } from "../../core/Elem"
import { Button } from "../button";
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { Wheel } from "../wheel";
import { WheelModal } from "../wheelModal";

export type VoteModal = WheelModal & {
    disableVote: ()=>void
}

export const VoteModal = (pers: {id: string, name: string}[], failRatio: number)=>{
    let wheelModal: WheelModal;
    
    let thumbUp = Elem("img", {
        src: "svg/thumb_up.svg",
        width: 50,
        height: 50,
        draggable: false
    }, [], {
        filter: `invert(55%) sepia(37%) saturate(6477%) hue-rotate(87deg) brightness(106%) contrast(114%)`
    });
    let thumbDown = Elem("img", {
        src: "svg/thumb_up.svg",
        width: 50,
        height: 50,
        draggable: false
    }, [], {
        transform: "rotate(180deg) translate(0, -5px)",
        filter: `invert(47%) sepia(89%) saturate(5117%) hue-rotate(340deg) brightness(95%) contrast(110%)`
    });

    let disableButtons = ()=> {
        let color = `invert(59%) sepia(92%) saturate(4151%) hue-rotate(121deg) brightness(98%) contrast(96%)`;
        upButton.setEnabled(false);
        thumbUp.style.filter = color;
        upButton.elem.firstChild?.firstChild?.replaceWith(thumbUp);
        
        downButton.setEnabled(false);
        thumbDown.style.filter = color;
        downButton.elem.firstChild?.firstChild?.replaceWith(thumbDown);
    };
    let upButton = Button(
        thumbUp.outerHTML,
        ()=>{
            socket.emit("vote", true);
            disableButtons();
        }, true, {
            padding: "10px",
            width: "90px",
        }
    )
    let downButton = Button(
        thumbDown.outerHTML,
        ()=>{
            socket.emit("vote", false);
            disableButtons();
        }, true, {
            padding: "10px",
            width: "90px",
        }
    )

    let votePanel = Elem("table", {}, [Elem("tr", {}, [
        Elem("td", {}, [upButton.elem]),
        Elem("td", {}, [downButton.elem]),
    ])], {width: "100%", margin: "auto"})

    wheelModal = WheelModal("Vote", pers, failRatio, 
        (wheel)=>Elem("div", {}, [
            wheel.elem,
            votePanel
        ], {
            padding: "25px"
        })
    );

    return {...wheelModal, ...{
        disableVote: ()=>{ disableButtons(); }
    }};
}