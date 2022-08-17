import { Elem } from "../core/Elem";

export const Container = (title: string, color: string, children: Node[]) => {
    let childContainer = Elem("div", {}, children, {});
    
    let div = Elem("div", {}, [
        Elem("div", {innerText: title}, [], {margin: "0 0 1px 5px"}),
        childContainer
    ], {
        backgroundColor: color,

        textAlign: "left",

        padding: "5px 5px 5px 5px",
        margin: "auto",

        maxWidth: "400px",
        borderRadius: "15px"
    });

    return {
        elem: div,
        append: (child: Node)=>{ childContainer.appendChild(child); },
        remove: (child: Node)=>{ childContainer.removeChild(child); }
    };
}