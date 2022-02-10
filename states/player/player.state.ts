import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Skill } from "@states/skill/skill.state";
import { getRandomArbitrary } from "@utils/utils";
import { TPlayer } from "@interfaces/game/game.interface";

export class Player extends Schema {
  @type("string")
  sessionId: string;

  @type("int16")
  seat: number;

  @type("int16")
  health: number;

  @type({ array: Skill })
  skills: ArraySchema<Skill> = new ArraySchema<Skill>();

  // @type(Skill)
  // skill1: Skill = new Skill("heyyaaa", getRandomArbitrary(5, 10));

  // @type(Skill)
  // skill2: Skill = new Skill("boomboomboom", getRandomArbitrary(11, 20));

  // @type(Skill)
  // skill3: Skill = new Skill("kamehameha", getRandomArbitrary(21, 30));

  constructor(player: TPlayer) {
    super();

    this.health = player.health;
    const a = player.skills.map(
      (skill) => new Skill(skill.name, skill.minDamage, skill.maxDamage)
    );
    this.skills = new ArraySchema<Skill>(
      ...player.skills.map(
        (skill) => new Skill(skill.name, skill.minDamage, skill.maxDamage)
      )
    );
  }
}
