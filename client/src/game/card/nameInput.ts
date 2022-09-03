import { Elem } from "../../core/elem";

export const NameInput = (placeholder: string, onChange: (value: string)=>void)=> {
    return Elem("div", {}, [
        Elem("textarea", {
            placeholder: placeholder,
            oninput: (ev)=>{
                let target = ev.target as HTMLInputElement;
                onChange(target.value);
            }
        }, [], {
            resize: "none",
            width: "100%",
            boxSizing: "border-box"
            
        })
    ], {
        padding: "5px"
    });
}