import { transform } from "esbuild";
import { random } from "fp-ts";
import { toNamespacedPath } from "path";
import { Elem } from "../../core/Elem";
import { randRange } from "../../shared/utils";
import { Button } from "../button";
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { Wheel } from "./wheel";
import { Wheel2 } from "./wheel2";

export const SpinModal = (pers: {id: string, name: string}[])=>{
    let wheel = Wheel2(pers.map(per=>per.name), 0.7, 300);

    return Modal("Spin the wheel", false, Elem("div", {}, [
        wheel.elem,
        Spacer(15),
        Button("Spin", ()=>{
            wheel.spin(()=>{});
        }).elem
    ], {
        padding: "25px"
    }));
}
