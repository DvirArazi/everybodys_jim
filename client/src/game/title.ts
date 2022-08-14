import { Elem } from "../core/Elem";

export let Title = () => {
    return Elem("div", {}, [
        Elem("div", {
            innerText: "EVERYBODY'S"
        }, []),
        Elem("div", {
            innerText: "JIM"
        }, [])
    ]);
};