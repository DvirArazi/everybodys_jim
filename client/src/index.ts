import { io, Socket } from "socket.io-client";
import { Elem } from "./core/Elem";
import { Game } from "./game";
import { Button } from "./game/button";
import { Card0 } from "./game/card0";
import { Column } from "./game/card/column";
import { Attribute } from "./game/card/column/attribute";
import { initEntries } from "./game/entries";
import { Personality0 } from "./game/personality0";
import { Spacer } from "./game/spacer";
import { Storyteller0 } from "./game/storyteller0";
import { Storyteller1 } from "./game/storyteller1";
import { ClientToServerEvents, ServerToClientEvents } from "./shared/types";
import { Card1 } from "./game/card1";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

initEntries();

document.body.style.overflowX = "hidden";
document.body.style.overflowY = "scroll";
document.body.style.background = "#14ffff";
document.body.appendChild(Elem("div", {}, [
    // Game()
    // storyteller0("AAAA")
    // Personality0()
    // Storyteller1()
    // Card("Personality", 2, 2, ()=>{}).elem
    Card1()
], {
    textAlign: "center",
    maxWidth: "500px",
    margin: "auto",
    fontFamily: "rubik",
    fontWeight: "bold",
    fontSize: "20px"
}));