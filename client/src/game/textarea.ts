import { Elem } from "../core/elemm";

export const Textarea = (
    textareaProperties?: Partial<HTMLTextAreaElement>,
    divStyle?: Partial<CSSStyleDeclaration>,
    textareaStyle?: Partial<CSSStyleDeclaration>,
    shadow: boolean = true
)=> {
    let blurColor = "#00E673";

    let textarea = Elem("textarea", {
            className: "textarea",
            autocomplete: "nope",
            ...textareaProperties
        },
     [], {
            fontFamily: "rubik",
            fontWeight: "bold",
            // fontSize: "18px",

            background: "transparent",
            border: "none",
            outline: "none",

            width: "100%",
            height: "100%", 
            resize: "none",
            boxSizing: "border-box",
            overflow: "hidden",
            ...textareaStyle
        },
    );

    let div = Elem("div", {}, [textarea], {
            borderStyle: "none none solid none",
            borderColor: blurColor,

            // height: "70px",
            margin: "0 0 5px 0",
            boxShadow: "none",
            // padding: "5px"
            ...divStyle
        }
    );
    blurColor = div.style.borderColor;

    textarea.onfocus = ()=>{
        div.style.borderColor = "#0000CD";
        if (shadow) {div.style.boxShadow =  "0px 8px 10px -10px rgba(0,0,0,0.25)";}
    }
    textarea.onblur = ()=>{
        div.style.borderColor = blurColor;
        if(shadow) {div.style.boxShadow = "none";}
    }

    return {
        elem: div,
        update: (value: string)=>{textarea.value = value;},
        isComplete: ()=>{return textarea.value != "";},
        getValue: ()=>{return textarea.value;},
        setEnabled: (enable: boolean)=>{ textarea.disabled = !enable; }
    }
}