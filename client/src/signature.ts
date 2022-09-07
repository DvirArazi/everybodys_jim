import { Elem } from "./core/elemm";

export const signature = Elem("div", {}, [
    Elem("div", {innerText: 
        "Everybody's Jim was designed and developed by Dvir Arazi"
    }),
    Elem("a", {
        href: "https://github.com/DvirArazi/everybodys_jim",
        innerText: "https://github.com/DvirArazi/everybodys_jim"
    })
], {
    width: "100%",
    fontFamily: "calibri",
    fontSize: "14px",
    fontWeight: "normal",
    color: "#535a5f",

    position: "absolute",
    textAlign: "center",
    bottom: "15px",
    left: "50%",
    transform: "translate(-50%, 0)",
    // wordBreak: "break-all"
})