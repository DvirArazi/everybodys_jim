import { Elem } from "../core/Elem"

export const Spacer =(space: number) => {
    return Elem("div", {}, [], {padding: space + "px"});
}