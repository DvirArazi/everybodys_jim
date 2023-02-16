import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import { join } from 'path'
import { handler as handle } from './handler';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './shared/types';
import { rooms } from './rooms';
import helmet from 'helmet';

dotenv.config();

const app: Express = express();
const server = http.createServer(app)
const port = process.env.PORT || "1234";
const assetsDir = join(__dirname, "../../client/assets");
const srcDir = join(__dirname, "../../client/src");

app.use(helmet({
    hsts: {
        maxAge: Number.MAX_SAFE_INTEGER,
        includeSubDomains: true,
        preload: true,
      },
}));
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.hostname + req.url);
    }
    return next();
});

app.set('json spaces', 2)
app.use(express.static(assetsDir));
app.use(express.static(join(__dirname, "../../dist/client")));

app.get('/', (req, res) => {
    res.sendFile("./index.html", { root: srcDir });
});

//serve index.html
//================
app.get('/:param', (req, res) => {
    switch (req.params.param) {
        case "rooms": {
            res.json(rooms);
            break;
        }
        default: {
            res.sendFile("./index.html", { root: srcDir });
        }
    }
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