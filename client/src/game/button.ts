import { Elem } from "../core/elemm"

export type Button = {
    elem: HTMLElement,
    setEnabled: (enabled: boolean)=>void
}

export const Button = (
    inner: string, onClick: ()=>void,
    enabled = true,
    style?: Partial<CSSStyleDeclaration>
): Button => {
    let button = Elem("button", {
        innerHTML: inner,
        disabled: !enabled,
        className: "button",
        onclick: ()=>{onClick();}
    }, [], {
        fontFamily: "rubik",
        fontWeight: "bold",
        backgroundColor: "#00ff80",
        boxShadow: "0 5px #00e673",
        fontSize: "24px",
        outline: "none",
        cursor: "pointer",

        borderRadius: "10px",
        borderWidth: "0px",
        margin: "0px 0px 5px 0px",
        padding: "15px 30px",

        position: "relative",
        ...style
    });
    
    let div = Elem("div", {
        
    }, [button], {padding: "0"});

    return {
        elem: div,
        setEnabled: (enabled: boolean)=>{
            button.disabled = !enabled;
            // button.style.filter = enabled ?
            //     `invert(0%) sepia(2%) saturate(2%) hue-rotate(197deg) brightness(112%) contrast(100%)`:
            //     `invert(59%) sepia(92%) saturate(4151%) hue-rotate(121deg) brightness(98%) contrast(96%)`
            // ;
        }
    };
}