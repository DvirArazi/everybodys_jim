import { Elem } from "../../core/Elem";
import { randRange } from "../../shared/utils";

export const Wheel = (sliceNames: string[], dia: number)=>{
    const Slice = (sliceI: number) => {
        let smallY = 0.5 / Math.tan(Math.PI/sliceNames.length);
        let bigR = 100 * dia / (2 * smallY);
        let shift = dia/2 * (1 - Math.tan(Math.PI/sliceNames.length));

        const HalfSlice = (sliceI: number, side: "left"|"right") => {
            return Elem("div", {}, [], {
                zIndex: "30",
                background: side == "left" ? "#4DFFA6" : "#00FF80",
                height: `${bigR}px`,
                width: `${bigR}px`,
                clipPath: side == "left" ? 
                    `polygon(0 0, 0.5% ${smallY}%, 0.5% 0)` :
                    `polygon(0.5% 0, 0.5% ${smallY}%, 1% 0)`,
                transformOrigin: `0.5% ${smallY}%`,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translate(${shift}px, 0) rotate(${sliceI * 360/sliceNames.length}deg)`,
            });
        };

        let name = Elem("div", {
            innerText: sliceNames[sliceI],
        }, [], {
            zIndex: "40",
            position: "relative",
            transformOrigin: `0 50%`,
            transform: `translate(${dia/2}px, calc(${dia/2}px - 50%)) rotate(${270 + (sliceI) * 360/sliceNames.length}deg) translate(${dia/6}px, 0)`,
        });

        window.addEventListener("DOMContentLoaded", ()=>{
            let fontSize = (dia/2*10)/name.clientWidth;
            if (fontSize > dia/8) {fontSize = dia/8;};
            name.style.fontSize = `${fontSize}px`;
        });

        return Elem("div", {}, [
            HalfSlice(sliceI, "left"),
            HalfSlice(sliceI, "right"),
            name
        ], {
            position: "absolute"
        });
    };

    let slices = [];
    for (let i = 0; i < sliceNames.length; i++) {
        slices.push(Slice(i));
    }

    let pointer = Elem("div", {}, [Elem("div", {}, [], {
        zIndex: "50",
        background: "yellow",
        height: `${0.1*dia}px`,
        width: `${dia}px`,
        clipPath: `polygon(45% 0, 50% 100%, 55% 0)`,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translate(0, -50%)"
    })], {
        position: "absolute",
        margin:"auto",
        textAlign: "center"
    });

    let wheel = Elem("div", {}, slices, {
        height: `${dia}px`,
        width: `${dia}px`,
        background: "#4ed4c6",
        position: "absolute",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 0 10px gray",
        
        transformOrigin: "50% 50%",
    });

    return {
        elem: Elem("div", {}, [pointer, wheel], {
            position: "relative",
            height: `${dia}px`,
            width: `${dia}px`, 
            margin: "auto",
        }),
        spin: (onStop: (result: number)=>void) => {
            let rand = Math.floor(Math.random() * sliceNames.length);
            let rounds = Math.floor(randRange(4, 8));
            let varAngle = 45/sliceNames.length;
            let variation = randRange(-varAngle, varAngle);
            let dest = 360*(rounds+rand/sliceNames.length)+variation;
            console.log(rand, rounds, variation, dest);
            let a = -100; //deg per second^2
            let v0 = Math.sqrt(-2*a*dest); //deg per second
            let x = 0; //deg
            
            let startTime = Date.now();
            let time = Date.now() - startTime;

            let inverval = setInterval(()=>{
                time = (Date.now() - startTime)/1000;

                x = v0 * time + a*time*time/2;

                wheel.style.transform = `rotate(${x}deg)`;

                if (0 >= a*time+v0) {
                    clearInterval(inverval);
                } 
            }, 0);
        }
    }
}