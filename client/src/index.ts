import { io, Socket } from "socket.io-client";
import { Elem } from "./core/Elem";
import { Game } from "./game";
import { Button } from "./game/button";
import { Card } from "./game/card";
import { Column } from "./game/card/column";
import { Attribute } from "./game/card/column/attribute";
import { initEntries } from "./game/entries";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Storyteller1 } from "./game/storyteller1";
import { ClientToServerEvents, ServerToClientEvents } from "./shared/types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

initEntries();

document.body.style.overflowX = "hidden";
document.body.style.overflowY = "scroll";
document.body.style.background = "#14ffff";
document.body.appendChild(Elem("div", {}, [
    Game()
    // storyteller0("AAAA")
    // Personality0()
    // Storyteller1()
    // Card("onStoryteller", 2, 2, ()=>{}, ()=>{}).elem
], {
    textAlign: "center",
    maxWidth: "500px",
    margin: "auto",
    fontFamily: "rubik",
    fontWeight: "bold",
    fontSize: "20px"
}));