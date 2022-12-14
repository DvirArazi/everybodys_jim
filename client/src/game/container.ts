import { Elem } from "../core/elemm";

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
        borderRadius: "15px",

        boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.1)"
    });

    return {
        elem: div,
        inner: childContainer,
        append: (child: Node)=>{ childContainer.appendChild(child); },
        remove: (child: Node)=>{ childContainer.removeChild(child); },
        replaceAll: (children: Node[])=>{ childContainer.replaceChildren(...children); }
    };
}