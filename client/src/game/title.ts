import { Elem } from "../core/Elem";

export let Title = () => {
    return Elem("div", {}, [
        Elem("div", {
            innerText: "EVERYBODY'S"
        }, [], {
            fontSize: "44px"
        }),
        Elem("div", {
            innerText: "JIM"
        }, [], {
            fontSize: "180px",
            lineHeight: "70%",
            position: "relative",
            zIndex: "-1"
        })
    ], {
        fontFamily: "secular-one",
        fontWeight: "bold"
    });
};