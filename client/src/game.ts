import { socket } from ".";
import { personality0 } from "./game/personality0";
import { storyteller0 } from "./game/storyteller0";
import { Title } from "./game/title";

export let game = () => {
    let clientPageContainer = document.createElement("div");
    socket.emit("clientType", window.location.href.split('/')[3], (clientType)=>{
        switch (clientType.type) {
            case "Storyteller":
                clientPageContainer.appendChild(storyteller0(clientType.roomcode));
                break;
            case "Personality":
                clientPageContainer.appendChild(personality0(clientType.roomFound));
        }
    });
    
    let div = document.createElement("div");
        let title0 = Title();
        div.appendChild(title0);
        div.appendChild(clientPageContainer);
    return div;
}