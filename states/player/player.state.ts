import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Skill } from "@states/skill/skill.state";
import { getRandomArbitrary } from "@utils/utils";
import { TPlayer } from "@interfaces/game/game.interface";

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

  constructor(player: TPlayer) {
    super();

    this.username = player.username;
    this.health = player.health;
    this.skills = new ArraySchema<Skill>(
      ...player.skills.map(
        (skill) => new Skill(skill.name, skill.minDamage, skill.maxDamage)
      )
    );
  }
}
