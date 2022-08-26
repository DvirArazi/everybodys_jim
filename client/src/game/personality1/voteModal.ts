import { Elem } from "../../core/Elem"
import { Button } from "../button";
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { Wheel } from "../storyteller1/wheel";
import { Wheel2 } from "../storyteller1/wheel2";
import { Wheel3 } from "../wheel3";

export const VoteModal = (pers: {id: string, name: string}[], failRatio: number)=>{
    let wheel = Wheel3(pers.map(per=>per.name), failRatio);
    
    let thumbUp = Elem("img", {
        src: "svg/thumb_up.svg",
        width: 50,
        height: 50
    }, [], {
        filter: `invert(55%) sepia(37%) saturate(6477%) hue-rotate(87deg) brightness(106%) contrast(114%)`
    });
    let thumbDown = Elem("img", {
        src: "svg/thumb_up.svg",
        width: 50,
        height: 50
    }, [], {
        transform: "rotate(180deg) translate(0, -5px)",
        filter: `invert(47%) sepia(89%) saturate(5117%) hue-rotate(340deg) brightness(95%) contrast(110%)`
    });

    let votePanel = Elem("table", {}, [Elem("tr", {}, [
        Elem("td", {}, [Button(
            thumbUp.outerHTML,
            ()=>{}, true, {
                padding: "10px",
            }
        ).elem]),
        Elem("td", {}, [Elem("div", {innerText: "54 seconds to vote"}, [], {padding: "10px"})]),
        Elem("td", {}, [Button(
            thumbDown.outerHTML,
            ()=>{}, true, {
                padding: "10px",
            }
        ).elem]),
    ])], {width: "100%"})

    return Modal("Vote", false, Elem("div", {}, [
        wheel.elem,
        Spacer(15),
        votePanel
    ], {
        padding: "25px"
    }));
}