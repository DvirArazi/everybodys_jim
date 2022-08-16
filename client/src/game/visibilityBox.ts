import { Elem } from "../core/Elem";

export const VisibilityBox = (children: Node[])=>{
    let box = Elem("div", {}, children);

    return {
        elem: box,
        setVisible: (visible: boolean) => { box.hidden = !visible}
    }
}