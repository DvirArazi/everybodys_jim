import { Elem } from "../core/elem"

export const Modal = (title: string, closeable: "none" | "close" | "minimize", content: HTMLElement)=>{
    let modal = Elem("div", {}, [
        Elem("div", {}, [Elem("div", {}, [
            Elem("div", {innerText: title}, closeable != "none" ? [
                Elem("span", {
                    innerText: "✕",
                    onclick: ()=>{
                        switch (closeable) {
                            case "close": {
                                modal.parentElement?.removeChild(modal); break;
                            }
                            case "minimize": {
                                modal.style.display = "none"; break;
                            }
                        }
                    },
                    onmouseover(this, ev) {
                        let target = ev.target as HTMLSpanElement;
                        target.style.color = "black";
                    },
                    onmouseleave(this, ev) {
                        let target = ev.target as HTMLSpanElement;
                        target.style.color = "#aaaaaa";
                    }
                }, [], {
                    color: "#aaaaaa",
                    float: "right",
                    fontSize: "24px",
                    fontWeight: "bold",
                    cursor: "pointer"
                })
            ] : [], {
                background: "#14FFFF",
                fontSize: "28px",
                textAlign: "left",
                padding: "8px 16px",
                borderRadius: "10px 10px 0 0"
            }),
            Elem("div", {}, [content], {
                backgroundColor: "#fefefe",
                borderRadius: "0 0 10px 10px"
            })
        ], {
            maxWidth: "500px",
            margin: "auto"
        })], {
            margin: "0 10px 0 10px"
            // textAlign: "center"
        })
    ], {
        position: "fixed",
        zIndex: "20",
        paddingTop: "60px",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    });

    if (closeable == "minimize") {modal.style.display = "none";}

    return modal;
}