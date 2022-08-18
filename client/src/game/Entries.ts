import { Role } from "types";
import { Entry } from "types";
import { Cookies } from "typescript-cookie";
import { socket } from "..";

export const initEntries = () => {
    let entries = Cookies.get("entries");
    if (entries == undefined) {
        entries = JSON.stringify([]);
        Cookies.set("entries", entries);
    }
}

export const getEntries = (): Entry[] => {
    return JSON.parse(Cookies.get("entries")!.toString());
}

export const setEntries = (entries: Entry[]) => {
    Cookies.set("entries", JSON.stringify(entries));
}

export const addEntry = (role: Role) => {
    let entries = getEntries().concat({
        id: socket.id, role: role
    });

    setEntries(entries);
}

export const deleteEntries = (ids: string[]) => {
    let entries = getEntries();

    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < entries.length;) {
            if (ids[i] == entries[j].id) {
                entries.splice(j);
                break;
            }
        }
    }

    setEntries(entries);
}