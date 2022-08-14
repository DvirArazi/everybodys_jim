import { io, Socket } from "socket.io-client";
import { game } from "./game";
import { Card } from "./game/card";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

document.body.style.textAlign = "center";
document.body.style.maxWidth = "500px";
document.body.style.margin = "auto";
document.body.style.overflowX = "hidden";
document.body.style.overflowY = "scroll";
// document.body.appendChild(game());
document.body.appendChild(Card("onPersonality", 2, 2, ()=>{}, ()=>{}).elem);
// document.body.appendChild(Attribute("goal"));