import { Elem } from "../../../../core/elemm";

export const Checkbox = (enabled: boolean, onChange: (checked: boolean)=>void) => {
    let checkbox = Elem("input", {
        type: "checkbox",
        disabled: !enabled,
        autocomplete: "off", 
        onchange: (ev) => {
            let target = (ev.target as HTMLInputElement);
            onChange(target.checked);
        }
    }, [], {
        width: "20px",
        height: "20px",
    });

    return {
        elem: Elem("div", {}, [
            checkbox
        ], {
            display: "flex",
        }),
        update: (check: boolean)=>{checkbox.checked = check;},
        isComplete: ()=>{return checkbox.checked;}
    };
}