import { resolve } from "path";
import { Elem } from "../core/elem"
import { randRange } from "../shared/utils";

export type Wheel = {
    elem: HTMLElement,
    spin: (angle: number, success: boolean, onStop: ()=>void)=>void,
    color: (index: number, approve: boolean)=>void,
}

export const Wheel = (pers: string[], failRatio: number): Wheel => {
    let perCount = pers.length;

    let w = 500;
    let h = 500;
    
    let canvas = Elem("canvas", {
        width: w,
        height: h
    }, [], {
        width: "100%",
        height: "100%",
        fontFamily: "rubik",
        fontSize: "500px",
        transformOrigin: `50% 50%`
    });

    let ctx = canvas.getContext("2d")!;

    let drawSlice = (color: string, from: number, to: number)=>{
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
            0.5*w, 0.5*h,
            0.5*w,
            from, from + to
        );
        ctx.lineTo(0.5*w, 0.5*h);
        ctx.fill();
    }

    let from = 1.5*Math.PI;
    let drawNextSlice = (color: string, add: number) => {
        drawSlice(color, from, add);

        from += add;
    }

    //Draw green section
    //==================

    //Draw slices
    //-----------
    let alpha = 2*Math.PI * (1-failRatio) * 0.5/perCount;
    for (let per of pers) {
        drawNextSlice( "#66d9ff", alpha);
        drawNextSlice("#b3ecff", alpha);
        
    }

    //Draw names
    //----------
    ctx.fillStyle = "#000000";

    let a = 0.3*w, b = 0.3*w;

    let drawName = (i: number) => {
        ctx.save();

        ctx.font = `bold 10px rubik`;
        let text = pers[i];

        let metrics = ctx.measureText(text);
        let tw = metrics.width;
        let th = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        ctx.font = `bold ${10 * Math.min(b/tw, 0.8*(a-b/2) * 2*Math.tan(alpha)/th)}px rubik`;

        metrics = ctx.measureText(text);
        tw = metrics.width;
        th = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
        
        ctx.rotate(-0.25*2*Math.PI + (i+0.5)*2*alpha);
        ctx.fillText(text, a-0.5*tw, 0.5*th);

        ctx.restore();
    }

    ctx.save();
    ctx.translate(0.5*w, 0.5*h);
    for (let i = 0; i < perCount; i++) {
        drawName(i);
    }
    ctx.restore();


    //Draw red section
    //================

    //Draw slices
    //-----------
    let beta = 2*Math.PI * 0.5/10;
    for (let i = 0; i < failRatio * 10; i++) {
        drawNextSlice("red", beta);
        drawNextSlice("#ff4d4d", beta);
    }

    //Draw skulls
    //-----------
    let skull = Elem("img", {src: "svg/skull.svg"});
    let sw = 0.2*w, sh = 0.2*h;
    skull.onload = ()=> {
        ctx.save();
        ctx.translate(0.5*w, 0.5*h);
        for (let i = 0; i < failRatio * 10; i++) {
            ctx.save();
            ctx.rotate(2*Math.PI * -(i + 0.5)/10);
            ctx.drawImage(skull, -0.5*sw, -(0.5-0.02)*w, sw, sh);
            ctx.restore();
        }
        ctx.restore();
    }

    return {
        elem: Elem("div", {}, [
            Elem("div", {}, [], {
                background: "yellow",
                width: "20px",
                height: "30px",
                clipPath: `polygon(0 0, 50% 100%, 100% 0)`,
                margin: "auto",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)",
                zIndex: "10"
            }), 
            canvas
        ], {
            maxWidth: "300px", maxHeight: "300px",
            margin: "auto",
            position: "relative"
        }),
        spin: (angle: number, success: boolean, onStop: ()=>void)=>{
            let a = -1.75; //deg per second^2
            let v0 = Math.sqrt(-2*a*angle); //deg per second
            let x = 0; //deg

            let start: number | undefined = undefined;
            let interval = (timestamp: number)=>{
                if (start === undefined) {start = timestamp;}
                const time = (timestamp - start)/1000;

                x = v0 * time + a*time*time/2;

                canvas.style.transform = `rotate(${x}rad)`;

                if (0 < v0 + a*time) {
                    window.requestAnimationFrame(interval);
                } else {
                    onStop();
                }
            };
            window.requestAnimationFrame(interval);
        },
        color: (index: number, approve: boolean)=>{
            drawSlice(approve?"#4dff4d":"#ff0000", 2*Math.PI * (-0.25 + index/perCount * (1-failRatio)) , alpha);
            drawSlice(approve?"#99ff99":"#ff4d4d", 2*Math.PI * (-0.25 + index/perCount * (1-failRatio)) + alpha, alpha);

            ctx.fillStyle = "#000000";

            ctx.save();
            ctx.translate(0.5*w, 0.5*h);
            drawName(index);
            ctx.restore();
        }
    }
}