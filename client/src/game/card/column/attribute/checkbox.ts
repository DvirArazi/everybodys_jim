import { Elem } from "../../../../core/Elem";

export const Checkbox = (enabled: boolean, onChange: (checked: boolean)=>void) => {
    let checkbox = Elem("input", {
        type: "checkbox",
        disabled: !enabled,
        onchange: (ev) => {
            let target = (ev.target as HTMLInputElement);
            onChange(target.checked);
        }
    }, []);

    return {
        elem: Elem("div", {}, [
            checkbox
        ]),
        update: (check: boolean)=>{checkbox.checked = check;}
    };
}