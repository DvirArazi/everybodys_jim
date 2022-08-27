import chalk from "chalk";
import { transform } from "esbuild";
import { random } from "fp-ts";
import { toNamespacedPath } from "path";
import { socket } from "../..";
import { Elem } from "../../core/Elem";
import { randRange } from "../../shared/utils";
import { Button } from "../button";
import { Modal } from "../modal"
import { Spacer } from "../spacer";
import { Wheel } from "../storyteller1/wheel";
import { Wheel2 } from "../storyteller1/wheel2";
import { Wheel3 } from "../wheel3";
import { WheelModal } from "../wheelModal";

export const SpinModal = (pers: {id: string, name: string}[], failRatio: number)=>{

    return WheelModal("Spin the wheel", pers, failRatio,
        (wheel)=>Elem("div", {}, [
            wheel.elem,
            Spacer(15),
            Button("Spin", ()=>{
                wheel.spin();
                // wheel.colorRed(2);
            }).elem
        ], {
            padding: "25px"
        }
    ));
}
