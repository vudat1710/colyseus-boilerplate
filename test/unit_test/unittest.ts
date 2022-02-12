import "module-alias/register";
import { ColyseusTestServer, boot } from "@colyseus/testing";
import { Server } from "colyseus";
import { MongooseDriver } from "@colyseus/mongoose-driver";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { PveGameRoom } from "@rooms/pve/pve.room";
import dotenv from "dotenv";
import assert from "assert";
dotenv.config();

// (async () => {
  
//   const transport = new uWebSocketsTransport();

//   const gameServer = new Server({
//     transport,
//     driver: new MongooseDriver(process.env.MONGO_URI),
//     // presence: new RedisPresence(),
//   });
//   gameServer.define("pve", PveGameRoom);
//   const colyseus: ColyseusTestServer = await boot(gameServer);
//   const room = await colyseus.createRoom("pve", {});
//   const client1 = await colyseus.connectTo(room, { playerId: 1, enemyId: 1 });
  
//     client1.send("attack", { name: "kamehameha" });
//     client1.onMessage("turn-for-bot", () => {
//       console.log("test")
//       client1.send("bot-attack")

//   })

//   client1.onMessage("turn-for-player", () => {
//       console.log("test");
//       // client1.send("bot-attack")
//       client1.send("attack", {name: "kamehameha"})
//       // client1.send("attack", { name: "kamehameha" });
//       // client1.send("attack", { name: "kamehameha" });
//       // client1.send("attack", { name: "kamehameha" });
//   })

// })()


describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;
  const transport = new uWebSocketsTransport();

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
    client1.send("attack", { name: "kamehameha" });

    // wait for specific a message
    // await room.waitForMessage("attack");

    // await client1.waitForNextMessage();

    // client1.send("bot-attack", {});
    client1.onMessage("turn-for-bot", () => {
        client1.send("bot-attack")
    })
  
    client1.onMessage("turn-for-player", () => {
        console.log("test");
        // client1.send("bot-attack")
        client1.send("attack", {name: "kamehameha"})
    })

    client1.onMessage("turn-for-bot", () => {
      client1.send("attack", {name: "kamehameha"})
    })

    
    // client1.send("attack", { name: "kamehameha" });
    // client1.send("bot-attack", {});
    // client1.send("attack", { name: "kamehameha" });
    // client1.send("bot-attack", {});
    // client1.send("attack", { name: "kamehameha" });
    // client1.send("bot-attack", {});
    // client1.send("attack", { name: "kamehameha" });
    // client1.send("bot-attack", {});
    // await room.waitForMessage("bot-attack")
    // await client1.waitForMessage("attack");

    // make your assertions
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);
  });
});
