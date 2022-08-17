import { Cookies } from "typescript-cookie";
import { socket } from "..";

export const setEntries = () => {
    let entries = Cookies.get("entries");
    if (entries == undefined) {
        entries = JSON.stringify([]);
        Cookies.set("entries", entries);
    }
}

export const addEntry = (role: Role) => {
    let entries = Cookies.get("entries");
    let updatedEntries = JSON.parse(entries!.toString()).concat({
        id: socket.id, role: role
    });

    Cookies.set("entries", JSON.stringify(updatedEntries));
}

export const getEntries = (): Entry[] => {
    return JSON.parse(Cookies.get("entries")!.toString());
}