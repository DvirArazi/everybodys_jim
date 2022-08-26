import { Elem } from "../../../../core/Elem";

export type Scorebox = {
    elem: Node,
    update: (value: string)=>void,
    setEnabled: (enabled: boolean)=>void,
    isComplete: ()=>boolean,
    getValue: ()=>string
}

const isDigit = (num: number) => {
    return num >= 0 && num <= 9;
}

export const Scorebox = (onChange: (value: string)=>void): Scorebox => {
    let textarea = Elem("textarea", {
            oninput: (ev)=>{
                let target = ev.target as HTMLTextAreaElement;
                
                let newValue = "";

                for (let char of target.value) {
                    if (char >= '0' && char <= '9') {
                        newValue += char;
                    }
                }

                if (newValue.length > 0) {
                    let num = parseInt(target.value);

                    if (num > 10) {
                        target.value = "10";
                    } else if (num < 1) {
                        target.value = "1";
                    } else {
                        target.value = num.toString();
                    }
                } else {
                    target.value = newValue;
                }

                onChange(target.value);
            },
        }, [], {
            resize: "none",
            overflow: "clip",
            lineBreak: "none",

            width: "20px",
            height: "18px",

            fontFamily: "rubik",
            fontWeight: "bold",
            fontSize: "18px",
            backgroundColor: "#80FFBF",
            borderRadius: "4px",
            border: "2px solid #767676",
            textAlign: "center",
            paddingTop: "3px",
        }
    );

    return {
        elem: Elem("div", {}, [textarea], {
            textAlign: "center"
        }), 
        update: (value: string)=>{textarea.value = value;},
        setEnabled: (enabled: boolean)=>{
            textarea.style.borderColor = enabled ? "#767676" : "#7DD6A9";
            textarea.disabled = !enabled;
        },
        isComplete: ()=>{return textarea.value != "";},
        getValue: ()=>{return textarea.value;}
    };
}