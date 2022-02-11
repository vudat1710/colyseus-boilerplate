import "module-alias/register";
import { ColyseusTestServer, boot } from "@colyseus/testing";
import { Server } from "colyseus";
import { MongooseDriver } from "@colyseus/mongoose-driver";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { PveGameRoom } from "@rooms/pve/pve.room";
import dotenv from "dotenv";
import assert from "assert";
dotenv.config();
const transport = new uWebSocketsTransport();

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;
  const gameServer = new Server({
    transport,
    driver: new MongooseDriver(process.env.MONGO_URI),
    // presence: new RedisPresence(),
  });
  gameServer.define("pve", PveGameRoom);
  after(async () => colyseus.shutdown());
  before(async () => (colyseus = await boot(gameServer)));
  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async () => {
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom("pve", {});

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room, { playerId: 1, enemyId: 1 });

    // make your assertions
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);
  });
});
