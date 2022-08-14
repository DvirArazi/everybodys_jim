import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import { join } from 'path'
import { handler as handle } from './handler';

dotenv.config();

const app: Express = express();
const server = http.createServer(app)
const port = process.env.PORT;
const assetsDir = join(__dirname, "../../client/assets");
const srcDir = join(__dirname, "../../client/src");

app.use(express.static(assetsDir));
app.use(express.static(join(__dirname, "../../dist/client")));

//serve index.html
//================
app.get('/*', (req: Request, res: Response) => {
  res.sendFile("./index.html", {root: srcDir});
});

//create socket.io server
//=======================
export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

//listen to websocket messages
//============================
handle();

//listen on port
//==============
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});