import { io, Socket } from "socket.io-client";
import { game } from "./game";
import { CardOp } from "./game/cardOp";
import { Goal } from "./game/card/column/goal";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

document.body.appendChild(game());
// document.body.appendChild(Attribute("goal"));