import { Elem } from "../../../../core/Elem";

export const Description = (onChange: (value: string)=>void) => {
    
    let blurColor = "#00E673";

    let textarea = Elem("textarea", {
        className: "textarea",
        oninput: (ev)=>{
            let target = ev.target as HTMLTextAreaElement;
            target.value = target.value.replace('\n', '');
            console.log("target.value");
            onChange(target.value);
        }
    }, [], {
        background: "transparent",
        border: "none",

        width: "100%",
        height: "100%", 
        resize: "none",
        boxSizing: "border-box"
    });

    let div = Elem("div", {}, [textarea], {
        borderStyle: "none none solid none",
        borderColor: blurColor,

        height: "70px",
        margin: "0 0 5px 0",
        boxShadow: "none"
        // padding: "5px"
    });

    textarea.onfocus = ()=>{
        div.style.borderColor = "#0000CD";
        div.style.boxShadow =  "0px 8px 10px -10px rgba(0,0,0,0.25)";
    }
    textarea.onblur = ()=>{
        div.style.borderColor = blurColor;
        div.style.boxShadow = "none";
    }
    
    return {
        elem: div,
        update: (value: string)=>{textarea.value = value;}
    };
}