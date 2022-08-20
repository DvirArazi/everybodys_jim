import { Elem } from "../core/Elem"

export const Button = (text: string, onClick: ()=>void, enabled = true, fontSize = 24) => {
    let button = Elem("button", {
        innerText: text,
        disabled: !enabled,
        className: "button"
    }, [], {
        fontFamily: "rubik",
        fontWeight: "bold",
        backgroundColor: "#00ff80",
        boxShadow: "0 5px #00e673",
        fontSize: fontSize + "px",
        outline: "none",
        cursor: "pointer",

        borderRadius: "10px",
        borderWidth: "0px",
        margin: "0px 0px 5px 0px",
        padding: "15px 30px",

        position: "relative"
    });
    
    let div = Elem("div", {
        onclick: ()=>{onClick();}
    }, [button]);

    return {
        elem: div,
        setEnabled: (enabled: boolean)=>{button.disabled = !enabled;}
    };
}