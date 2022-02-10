import { Schema, type } from "@colyseus/schema";
import { TEnemy } from "@interfaces/game/game.interface";

export class Enemy extends Schema {
    @type('string')
    name: string;

    @type('string')
    type: string;

    @type('string')
    level: string;

    @type('int16')
    minDamage: number;

    @type('int16')
    maxDamage: number;

    constructor(enemy: TEnemy) {
        super();
        this.name = enemy.name;
        this.minDamage = enemy.minDamage;
        this.maxDamage = enemy.maxDamage;
    }
}
