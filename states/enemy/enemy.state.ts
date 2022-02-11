import { Schema, type } from "@colyseus/schema";
import { TEnemy } from "@interfaces/game/game.interface";

export class Enemy extends Schema {
  @type("int16")
  enemyId: number;

  @type("string")
  name: string;

  @type("int16")
  health: number;

  @type("int16")
  minDamage: number;

  @type("int16")
  maxDamage: number;

  constructor(enemy: TEnemy) {
    super();
    this.enemyId = enemy.enemyId;
    this.name = enemy.name;
    this.minDamage = enemy.minDamage;
    this.maxDamage = enemy.maxDamage;
    this.health = enemy.health;
  }

  public get getEnemyId() {
    return this.enemyId;
  }
}
