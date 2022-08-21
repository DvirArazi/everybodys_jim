import chalk from "chalk";
import { Console } from "console";
import { Cookies } from "typescript-cookie";
import { socket } from "..";
import { Entry, ParamData } from "../shared/types";

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

    console.log("Added Entry: ", entry);
}

export const updateEntryId = (currentId: string) => {
    let entries = getEntries();

    for (let entry of entries) {
        if (entry.id == currentId) {
            entry.id = socket.id;
            setEntries(entries);
            return;
        }
    }

    console.log(chalk.red("ERROR: ") + "Could not find entry to update");
}

export const updateEntryName = (name: string) => {
    let entries = getEntries();

    for (let entry of entries) {
        if (entry.id == socket.id) {
            if (entry.role.type != "Personality") {
                console.log(chalk.red("Error: ") + "Entry to rename was not of role type \"Personality\".");
                return;
            }

            entry.role.name = name;
            setEntries(entries);

            console.log("Updated entry: ", entry);
            return;
        }
    }
}

export const deleteEntry = (id: string) => {
    console.log("deleting entries");
    let entries = getEntries();

    let entryI = entries.findIndex(entry=>entry.id == id);
    if (entryI == -1) {
        console.log(chalk.redBright("ERROR: " + "Could not find entry to delete."));
        return;
    }
    entries.splice(entryI, 1);

    setEntries(entries);
}

export const deleteEntriesByIdI = (idIs: number[]) => {
    let entries = getEntries();

    for (let i = idIs.length - 1; i <= 0; i--) {
        entries.splice(idIs[i], 1);
    }

    setEntries(entries);
}