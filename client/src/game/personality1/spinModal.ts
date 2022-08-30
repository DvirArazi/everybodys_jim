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
import { Wheel } from "../wheel";
import { WheelModal } from "../wheelModal";

export type SpinModal = WheelModal & {
    enableSpin: ()=>void
}

export const SpinModal = (pers: {id: string, name: string}[], failRatio: number): SpinModal =>{
    let button: Button;

    return {
        ...WheelModal("Spin the wheel", pers, failRatio,
            (wheel)=>Elem("div", {}, [
                wheel.elem,
                (()=>{
                    button = Button("Spin", ()=>{
                        socket.emit("spinWheel");
                        button.setEnabled(false);
                    }, false);

                    return button.elem;
                })()
            ], {
                padding: "25px"
            }
        )), 
        ...{enableSpin: ()=>button.setEnabled(true)}
};
}
