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

  constructor(player: Player, enemy: Enemy, didWin: boolean) {
    super();
    this.player = player;
    this.enemy = enemy;
    this.didWin = false;
  }
}
