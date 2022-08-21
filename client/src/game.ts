import { socket } from ".";
import { Elem } from "./core/Elem";
import { addEntry, deleteEntriesByIdI, getEntries, updateEntryId } from "./game/entries";
import { NewUser } from "./game/newUser";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Storyteller1 } from "./game/storyteller1";
import { Title } from "./game/title";
import { ParamData } from "./shared/types"

export let Game = () => {
    let clientPageContainer = Elem("div");
    let setPage = (elem: Node)=>{
        clientPageContainer.innerHTML = "";
        clientPageContainer.appendChild(elem);
    };

    let role: ParamData;
    let param = window.location.pathname.split('/')[1];
    if (param == "st") {
        role = {type: "Storyteller"};
    } else if (param.length == 4) {
        role = {type: "Personality", roomcode: param.toUpperCase()};
    } else {
        role = {type: "NewUser"};
    }

    socket.on("deleteEntries", (indexes)=>{
        deleteEntriesByIdI(indexes);
    });

    socket.on("addEntry", (entry)=>{
        addEntry(entry);
    });

    socket.on("updateEntryId", (currentId)=>{
        updateEntryId(currentId);
    })

    socket.on("createNewUser", (entries)=>{
        setPage(NewUser(role, entries));
    });

    socket.on("construct", (clientData)=>{
        switch (clientData.type) {
            case "St0Data": {
                history.replaceState("", "", "st")
                setPage(Storyteller0(clientData.st0data));
                break;
            }
            case "Ps0Data": {
                history.replaceState("", "", clientData.ps0data.roomcode)
                setPage(Personality0(clientData.ps0data));
                break;
            }
            case "St1Data": {
                setPage(Storyteller1(clientData.st1data));
                break;
            }
        }
    });

    console.log(getEntries());
    socket.emit("init", role, getEntries());

    return Elem("div", {}, [
        Title(),
        Spacer(15),
        clientPageContainer
    ], {});
}
