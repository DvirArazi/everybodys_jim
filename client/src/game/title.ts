import { Elem } from "../core/elemm";

export let Title = () => {
    let color = "#000000";

    return Elem("div", {}, [
        Elem("div", {
            innerText: "EVERYBODY'S"
        }, [], {
            fontSize: "44px",
            color: color,
        }),
        Elem("div", {
            innerText: "JIM"
        }, [], {
            fontSize: "180px",
            lineHeight: "70%",
            position: "relative",
            zIndex: "-1",
            color: color
        })
    ], {
        fontFamily: "secular-one",
        fontWeight: "bold"
    });
};