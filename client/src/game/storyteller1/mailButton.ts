import { Elem } from "../../core/elemm"
import { Bang } from "../bang";

export const MailButton = (onClick: ()=>void)=>{
    let envelope = Elem("img", {
        src: "svg/envelope.svg",
        width: 35,
        height: 35,
    }, [], {
        position: "absolute",
        top: "15px",
        left: "15px",
        filter: "invert(100%) sepia(23%) saturate(6192%) hue-rotate(290deg) brightness(127%) contrast(117%)",
    });
    let bang = Bang(-70, -5);

    return {
        elem: Elem("div", {
            onclick: ()=>{
                bang.setVisibility(false);
                onClick();
            }
        }, [
            Elem("div", {}, [envelope], {
                width: "65px",
                height: "65px",
                background: "#00FF80",
                borderRadius: "50%",
                position: "absolute",
                boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.15)",
                cursor: "pointer",
            }),
            bang.elem
        ], {
            position: "fixed",
            right: "90px",
            bottom: "90px",
            zIndex: "15",
        }),
        setBangVisibility: (visible: boolean)=>{ bang.setVisibility(visible); }
    }
}