import { Cookies } from "typescript-cookie";
import { socket } from ".";
import { Elem } from "./core/Elem";
import { addEntry, getEntries } from "./game/Entries";
import { NewUser } from "./game/newUser";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Title } from "./game/title";

export let Game = () => {
    let clientPageContainer = Elem("div");
    
    let router = (path: string)=>{
        console.log(getEntries());
        window.history.replaceState("", "", path);
        clientPageContainer.innerHTML = '';
        socket.emit("init", path, getEntries(), (clientType)=>{
            switch (clientType.type) {
                case "Storyteller":
                    addEntry("storyteller");
                    clientPageContainer.appendChild(Storyteller0(clientType.roomcode));
                break;
                case "Personality":
                    addEntry("personality");
                    clientPageContainer.appendChild(Personality0());
                break;
                case "new":
                    clientPageContainer.appendChild(NewUser(path.split('/')[1], ()=>{router("/st")}, (path)=>{router(path)}));
                break;
            }
        })
    };
    router(window.location.pathname);

    return Elem("div", {}, [
        Title(),
        Spacer(15),
        clientPageContainer
    ], {});
}