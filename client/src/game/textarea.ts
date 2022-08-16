import { Elem } from "../core/Elem";

export const Textarea = (
    textareaProperties?: Partial<HTMLTextAreaElement>,
    divStyle?: Partial<CSSStyleDeclaration>,
    textareaStyle?: Partial<CSSStyleDeclaration>,
    shadow: boolean = true
)=> {
    let blurColor = "#00E673";

    let textarea = Elem("span", {
            contentEditable: "true",
            className: "textarea",
            ...textareaProperties
        },
     [], {
            fontFamily: "rubik",
            fontWeight: "bold",
            fontSize: "18px",

            background: "transparent",
            border: "none",
            outline: "none",

            display: "inline-block",
            width: "100%",
            // height: "100%",
            minHeight: "70px", 
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
        update: (value: string)=>{textarea.innerText = value;}
    }
}