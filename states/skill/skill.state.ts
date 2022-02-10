import { Schema, type } from "@colyseus/schema";

export class Skill extends Schema {
  @type("string")
  name: string;

  @type("int16")
  minDamage: number;

  @type("int16")
  maxDamage: number;

  constructor(name: string, minDamage: number, maxDamage: number) {
    super();
    this.name = name;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
  }
}
