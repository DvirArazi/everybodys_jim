import { Elem } from "../core/elem"

export const Spacer =(space: number) => {
    return Elem("div", {}, [], {padding: space + "px"});
}