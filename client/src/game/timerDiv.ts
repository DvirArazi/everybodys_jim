import { Elem } from "../core/Elem";

export const TimerDiv = () => {
    let line = (seconds: number)=>`${seconds} seconds left to vote`;
    let div = Elem("div");

    let maxTime = 60;
    let start = Date.now();
    let interval = setInterval(()=>{
        let time = maxTime - (Date.now() - start)/1000;
        if (time <= 0) {
            clearInterval(interval);
            return;
        }

        div.innerText = line(Math.floor(time));
    }, 100);

    return div;
}