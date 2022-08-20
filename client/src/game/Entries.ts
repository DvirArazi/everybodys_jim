import chalk from "chalk";
import { Console } from "console";
import { Cookies } from "typescript-cookie";
import { socket } from "..";
import { Entry, Role } from "../shared/types";

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

export const addEntry = (entry: Entry) => {
    let entries = getEntries().concat(entry);

    setEntries(entries);
}

export const updateEntry = (currentId: string, newId: string) => {
    let entries = getEntries();

    for (let entry of entries) {
        if (entry.id == currentId) {
            entry.id = newId;
            setEntries(entries);
            return;
        }
    }

    console.log(chalk.red("ERROR: ") + "Could not find entry to update");
}

export const deleteEntries = (ids: number[]) => {
    let entries = getEntries();

    for (let id of ids) {
        entries.splice(id);
    }

    console.log(entries);

    setEntries(entries);
}