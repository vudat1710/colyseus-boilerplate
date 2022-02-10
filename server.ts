import "module-alias/register";
// import express from "express";
import dotenv from "dotenv";
import logger from "@logger";
// import { createServer } from "http";
import { Server, RedisPresence } from "colyseus";
// import { monitor } from "@colyseus/monitor";
import { MongooseDriver } from "@colyseus/mongoose-driver";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";

dotenv.config();
const PORT = Number(process.env.PORT || 8080);

const transport = new uWebSocketsTransport();

const gameServer = new Server({
  transport,
  driver: new MongooseDriver(process.env.MONGO_URI),
  presence: new RedisPresence(),
});

gameServer.onShutdown(function () {
  logger.info(`Game server is going down.`);
});

gameServer.listen(PORT);

export default gameServer;
