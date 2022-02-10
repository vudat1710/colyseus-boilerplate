import { Schema, type } from "@colyseus/schema";
import { IPvERoom } from "@interfaces/game/game.interface";
import { Enemy } from "@states/enemy/enemy.state";
import { Player } from "@states/player/player.state";

export class PVERoom extends Schema {
  @type(Player)
  player: Player;

  @type(Enemy)
  enemy: Enemy;

  @type("boolean")
  didWin: boolean = false;

  constructor(pveRoom: IPvERoom) {
    super();
    this.player = new Player(pveRoom.player);
    this.enemy = new Enemy(pveRoom.enemy);
  }
}
