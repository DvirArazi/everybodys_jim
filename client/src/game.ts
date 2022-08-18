import { socket } from ".";
import { Elem } from "./core/Elem";
import { addEntry, deleteEntries, getEntries } from "./game/entries";
import { NewUser } from "./game/newUser";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Title } from "./game/title";
import { ClientData } from "./shared/types";

export let Game = () => {
    let clientPageContainer = Elem("div");
    
    let router = (clientData: ClientData) => {
        switch (clientData.type) {
            // case "Storyteller":
            //         addEntry("Storyteller");
            //         clientPage = Storyteller0(newData.st0data);
            //     break;
            //     case "Personality":
            //         addEntry("Personality");
            //         clientPage = Personality0();
            //     break;
        }
    }

    const init = (path: string, newGame: boolean = false)=>{
        let clientPage: Node;
        
        if (path.length == 4) {
            path = path.toUpperCase();
        }

        window.history.replaceState("", "", path);
        socket.emit("init", path, getEntries(), newGame,(newData, toDeletes)=>{
            console.log("Client Type: ", newData);
            console.log("To deletes: ", toDeletes);
            deleteEntries(toDeletes);
            console.log("Entries after delete: " + getEntries());
            
            switch (newData.type) {
                
                case "new":
                    clientPage = NewUser(path.split('/')[1], newData.datas, init);
                break;
            }

            clientPageContainer.innerHTML = '';
            clientPageContainer.appendChild(clientPage);
        });
    };

    init(window.location.pathname);

    return Elem("div", {}, [
        Title(),
        Spacer(15),
        clientPageContainer
    ], {});
}

// export 