import { Elem } from "../../core/Elem";
import { randRange } from "../../shared/utils";

export const Wheel2 = (pers: {id: string, name: string}[], failRatio: number, dia: number)=>{
    let persCount = pers.length;
    let halfAlpha = (1 - failRatio) * Math.PI/persCount;

    const Slice = (sliceI: number) => {
        let smallY = 0.5 / Math.tan(halfAlpha);
        let bigR = 100 * dia / (2 * smallY);
        let shift = dia/2 * (1 - Math.tan(halfAlpha));

        const HalfSlice = (side: "left"|"right") => {
            return Elem("div", {}, [], {
                zIndex: "32",
                background: side == "left" ? "#4DFFA6" : "#00FF80",
                height: `${bigR}px`,
                width: `${bigR}px`,
                clipPath: side == "left" ? 
                    `polygon(0 0, 0.5% ${smallY}%, 0.7% 0)` :
                    `polygon(0.5% 0, 0.5% ${smallY}%, 1.01% 0)`,
                transformOrigin: `0.5% ${smallY}%`,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translate(${shift}px, 0) rotate(${sliceI * 2*halfAlpha}rad)`,
            });
        };

        let name = Elem("div", {
            innerText: pers[sliceI].name,
        }, [], {
            zIndex: "60",
            position: "relative",
            transformOrigin: `0 50%`,
        });

        window.addEventListener("DOMContentLoaded", ()=>{
            let fontSize = (dia*halfAlpha*15)/name.clientWidth;
            if (fontSize > dia*halfAlpha*.5) {fontSize = dia*halfAlpha*.5;};
            name.style.fontSize = `${fontSize}px`;
            name.style.transform = `translate(${dia/2}px, calc(${dia/2}px - 50%)) rotate(${1.5*Math.PI + sliceI * 2*halfAlpha}rad) translate(${(0.6*dia-name.clientWidth)/2}px, 0)`;
        });

        return Elem("div", {}, [
            HalfSlice("left"),
            HalfSlice("right"),
            name
        ], {
            position: "absolute"
        });
    };

    let halfBeta = 1/10 * Math.PI;
    let smallY = 0.5 / Math.tan(halfBeta);
    let bigR = 100 * dia / (2 * smallY);
    let shift = dia/2 * (1 - Math.tan(halfBeta));

    const FailSlice = (sliceI: number) => {
        const HalfSlice = (side: "left"|"right") => {
            return Elem("div", {}, [], {
                zIndex: "30",
                background: side == "left" ? "red" : "#ff4d4d",
                height: `${bigR}px`,
                width: `${bigR}px`,
                clipPath: side == "left" ? 
                    `polygon(0 0, 0.5% ${smallY}%, 0.7% 0)` :
                    `polygon(0.5% 0, 0.5% ${smallY}%, 1.2% 0)`,
                transformOrigin: `0.5% ${smallY}%`,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translate(${shift}px, 0) rotate(${halfBeta*(2*sliceI + 1) + halfAlpha*(2*persCount - 1)}rad)`,
            });
        };

        let Skull = ()=>{
            let width = 0.2*dia;
            let height = 0.2*dia;

            return Elem("object", {
                data: "skull.svg",
                width: `${width}`,
                height: `${height}`,
            }, [], {
                zIndex: "31",
                position: "absolute",
                transformOrigin: `${width/2}px ${dia/2+height/2}px`,
                transform: `translate(-50%, -50%) rotate(${2*Math.PI*(1-failRatio + sliceI/10) + halfBeta - halfAlpha}rad) translate(0px, ${0.7*height}px)`
            });
        }


        return Elem("div", {}, [
            HalfSlice("left"),
            HalfSlice("right"),
            Skull()
        ]);
    }

    let slices = [];
    for (let i = 0; i < persCount; i++) {
        slices.push(Slice(i));
    }
    for (let i = 0; i < failRatio*10; i++) {
        slices.push(FailSlice(i));
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
        background: "#4DFFA6",
        position: "absolute",
        borderRadius: "50%",
        boxShadow: "0 0 10px gray",
        transformOrigin: "50% 50%",

        overflow: "hidden",
    });

    return {
        elem: Elem("div", {}, [pointer, wheel], {
            position: "relative",
            height: `${dia}px`,
            width: `${dia}px`, 
            margin: "auto",
        }),
        mark: ()=>{},
        spin: (/*angle: number, chosenI: number,*/ onStop: (result: number)=>void) => {
            let dest = Math.random() * 2*Math.PI;
            let rounds = Math.floor(randRange(4, 8)) * 2*Math.PI;
            let chosenI = Math.floor((2*Math.PI-((dest+2*Math.PI-halfAlpha)%(2*Math.PI)))/(2*halfAlpha));
            console.log(pers[chosenI]?.name);
            let a = -1.75; //deg per second^2
            let v0 = Math.sqrt(-2*a*(dest+rounds)); //deg per second
            let x = 0; //deg

            let start: number | undefined = undefined;
            let interval = (timestamp: number)=>{
                if (start === undefined) {start = timestamp;}
                const time = (timestamp - start)/1000;

                x = v0 * time + a*time*time/2;

                wheel.style.transform = `rotate(${x}rad)`;

                if (0 < v0 + a*time) {
                    window.requestAnimationFrame(interval);
                } 
            };
            window.requestAnimationFrame(interval);
        }
    }
}