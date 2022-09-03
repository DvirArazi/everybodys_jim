import { Elem } from "../core/elemm"

export const Row = (elems: HTMLElement[]) => {

    return Elem("table", {}, [Elem("tr", {}, elems.map(
        elem=>Elem("td", {}, [elem])
    ))]);
}