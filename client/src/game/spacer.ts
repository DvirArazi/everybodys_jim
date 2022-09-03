import { Elem } from "../core/elemm"

export const Spacer =(space: number) => {
    return Elem("div", {}, [], {padding: space + "px"});
}