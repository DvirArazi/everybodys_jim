import { Elem } from "../core/Elem"

export const Bang = (x: number, y: number)=>{
    let div = Elem("div", {}, [
        Elem("div", {innerText: "!"}, [], {
            position: "absolute",
            left: `8.5px`,
            top: `-1px`,
        })
    ], {
        fontFamily: "secular-one",
        color: "white",
        boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
        width: "25px",
        height: "25px",
        textAlign: "center",
        borderRadius: "50%",
        background: "#ff4d4d",
        position: "absolute",
        right: `${x}px`,
        top: `${y}px`,
        zIndex: "10",
        display: "none"
    });
    return {
        elem: Elem("div", {}, [div], {position: "relative"}),
        setVisibility: (visible: boolean)=>{
            div.style.display = visible ? "block" : "none"
        }
    }
}