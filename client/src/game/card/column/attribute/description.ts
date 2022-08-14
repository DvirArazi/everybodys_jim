import { Elem } from "../../../../core/Elem";

export const Description = (onChange: (value: string)=>void) => {
    let textarea = Elem("textarea", {
        oninput: (ev)=>{
            let target = ev.target as HTMLTextAreaElement;
            onChange(target.value);
        }
    });
    
    return {
        elem: Elem("div", {}, [
            textarea
        ], {
            
        }),
        update: (value: string)=>{textarea.value = value;}
    };
}