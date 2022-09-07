import { Elem } from "./core/elemm";

export const signature = 
Elem("div", {}, [
    Elem("div", {innerText: 
        "Everybody's Jim was designed and developed by Dvir Arazi"
    }),
    Elem("a", {
        href: "https://github.com/DvirArazi/everybodys_jim",
        innerText: "https://github.com/DvirArazi/everybodys_jim"
    })
], {
    fontFamily: "calibri",
    fontSize: "14px",
    fontWeight: "normal",
    color: "#535a5f",
    paddingBottom: "10px",

    textAlign: "center",
    left: "50%",
    zIndex: "-1",
})