import "module-alias/register";
import express from "express";
import dotenv from "dotenv";
import logger from "@logger";
import { createServer } from "http";
import { Server } from "colyseus";
// import { monitor } from "@colyseus/monitor";
import { MongooseDriver } from "@colyseus/mongoose-driver";
// import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { PveGameRoom } from "@rooms/pve/pve.room";
import path from "path";
import serveIndex from "serve-index";

dotenv.config();
const PORT = Number(process.env.PORT || 8080);
const app = express();
// console.log(path.join(__dirname, "static"));
app.use("/", serveIndex(path.join(__dirname, "static"), { icons: true }));
app.use("/", express.static(path.join(__dirname, "static")));
const server = createServer(app);
const transport = new WebSocketTransport({ server });

const gameServer = new Server({
  transport,
  driver: new MongooseDriver(process.env.MONGO_URI),
  // server: createServer(app),
  // presence: new RedisPresence(),
});

gameServer.onShutdown(function () {
  logger.info(`Game server is going down.`);
});
gameServer.define("pve", PveGameRoom).enableRealtimeListing();

gameServer.listen(PORT);

export default gameServer;
