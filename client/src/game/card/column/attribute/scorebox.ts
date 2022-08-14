import { Elem } from "../../../../core/Elem";

export const Scorebox = (onChange: (value: string)=>void) => {
    return Elem("textarea", {
            oninput: (ev)=>{
                let target = ev.target as HTMLTextAreaElement;
                onChange(target.value);
            }
        }, [], {
            resize: "none",
            width: "5px"
        }
    );
}