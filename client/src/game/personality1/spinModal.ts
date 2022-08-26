import { transform } from "esbuild";
import { random } from "fp-ts";
import { toNamespacedPath } from "path";
import { Elem } from "../../core/Elem";
import { randRange } from "../../shared/utils";
import { Button } from "../button";
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { Wheel } from "../storyteller1/wheel";
import { Wheel2 } from "../storyteller1/wheel2";
import { Wheel3 } from "../wheel3";

export const SpinModal = (pers: {id: string, name: string}[], failRatio: number)=>{
    let wheel = Wheel3(pers.map(per=>per.name), failRatio);
   

    return Modal("Spin the wheel", false, Elem("div", {}, [
        wheel.elem,
        Spacer(15),
        Button("Spin", ()=>{
            wheel.spin();
            // wheel.colorRed(2);
        }).elem
    ], {
        padding: "25px"
    }));
}
