import { Elem } from "../../core/Elem";

export const NameInput = (placeholder: string, onChange: (value: string)=>void)=> {
    return Elem("textarea", {
        placeholder: placeholder,
        oninput: (ev)=>{
            let target = ev.target as HTMLInputElement;
            onChange(target.value);
        }
    }, []);
}