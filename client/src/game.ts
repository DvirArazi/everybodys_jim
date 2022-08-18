import { Cookies } from "typescript-cookie";
import { socket } from ".";
import { Elem } from "./core/Elem";
import { addEntry, deleteEntries, getEntries } from "./game/entries";
import { NewUser } from "./game/newUser";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Title } from "./game/title";

export let Game = () => {
    let clientPageContainer = Elem("div");
    
    const router = (path: string, newGame: boolean = false)=>{
        let clientPage: Node;
        
        if (path.length == 4) {
            path = path.toUpperCase();
        }

        window.history.replaceState("", "", path);
        socket.emit("init", path, getEntries(), newGame,(clientType, toDeletes)=>{
            console.log("Client Type: ", clientType);
            deleteEntries(toDeletes);
            console.log("Entries after delete: " + getEntries());
            
            switch (clientType.type) {
                case "Storyteller":
                    addEntry("Storyteller");
                    clientPage = Storyteller0(clientType.st0data);
                break;
                case "Personality":
                    addEntry("Personality");
                    clientPage = Personality0();
                break;
                case "new":
                    clientPage = NewUser(path.split('/')[1], clientType.datas, router);
                break;
            }

            clientPageContainer.innerHTML = '';
            clientPageContainer.appendChild(clientPage);
        });
    };

    router(window.location.pathname);

    return Elem("div", {}, [
        Title(),
        Spacer(15),
        clientPageContainer
    ], {});
}

// export 