import { Elem } from "../../core/Elem"
import { Bang } from "../bang";

export const MailButton = (onClick: ()=>void)=>{
    let envelope = Elem("img", {src: "svg/envelope.svg"});
    let bang = Bang(5, 5);
    bang.setVisibility(true);

    return {
        elem: Elem("div", {}, [
            Elem("div", {}, [envelope], {
                background: "green",
                borderRadius: "50%",
                position: "absolute"
            }),
            bang.elem
        ], { position: "relative" }),
        setBangVisibility: (visible: boolean)=>{ bang.setVisibility(visible); }
    }
}