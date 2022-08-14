import { socket } from ".";
import { Elem } from "./core/Elem";
import { personality0 } from "./game/personality0";
import { storyteller0 } from "./game/storyteller0";
import { Title } from "./game/title";

export let game = () => {
    let clientPageContainer = Elem("div");

    socket.emit("clientType", window.location.href.split('/')[3], (clientType)=>{
        switch (clientType.type) {
            case "Storyteller":
                clientPageContainer.appendChild(storyteller0(clientType.roomcode));
                break;
            case "Personality":
                clientPageContainer.appendChild(personality0(clientType.roomFound));
        }
    });

    return Elem("div", {}, [
        Title(),
        clientPageContainer
    ], {
        // textAlign: "center"
    });
}