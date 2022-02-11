import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Skill } from "@states/skill/skill.state";

export class Player extends Schema {
  @type("int16")
  playerId: number;

  @type("string")
  sessionId: string;

  @type("int16")
  seat: number;

  @type("string")
  username: string;

  @type("int16")
  health: number;

  @type({ array: Skill })
  skills: ArraySchema<Skill> = new ArraySchema<Skill>();

  constructor(
    playerId: number,
    username: string,
    health: number,
    skills: Array<{ name: string; minDamage: number; maxDamage: number }>
  ) {
    super();

    this.playerId = playerId;
    this.username = username;
    this.health = health;
    this.skills = new ArraySchema<Skill>(
      ...skills.map(
        (skill) => new Skill(skill.name, skill.minDamage, skill.maxDamage)
      )
    );
  }

  public get getPlayerId() {
    return this.playerId;
  }
}
