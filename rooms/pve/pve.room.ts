import { Client, Room } from "colyseus";
import { PVERoom, Player, Enemy, Skill } from "@states/index";
import logger from "@logger";
import { IGameService } from "@interfaces/service/service.interface";
import GameService from "@services/game/game.service";
import { TPlayer, TEnemy, EMatchType } from "@interfaces/game/game.interface";
import { getRandomArbitrary } from "@utils/utils";

export class GameRoom extends Room<PVERoom> {
  maxClients: number = 1;
  playerCount: number = 0;
  private gameService: IGameService = new GameService();
  //   currentPlayer: Player;

  public onCreate(options: any): void | Promise<any> {
    logger.info("Room is created!");
    this.reset();
    this.onCombatMessage();
  }

  public onJoin = async (
    client: Client,
    options: {
      enemyId: number;
      playerId: number;
    }
  ): Promise<any> => {
    logger.info("room created!");

    const playerData: TPlayer = await this.gameService.getPlayerData(
      options.playerId
    );
    const player: Player = new Player(playerData);
    player.sessionId = client.sessionId;
    player.seat = this.playerCount + 1;
    const enemyData: TEnemy = await this.gameService.getMonsterData(
      options.enemyId
    );
    const enemy: Enemy = new Enemy(enemyData);

    this.state.player = player;
    this.state.enemy = enemy;
    this.state.didWin = false;
    await this.gameService.logActionData(
      options.playerId,
      "Join room successful",
      EMatchType.PVE,
      options.enemyId
    );
    this.lock();
  };

  onLeave = async (client: Client, options) => {
    logger.info(`client left ${client.sessionId}`);

    delete this.state.player;
    this.playerCount--;
    await this.gameService.logActionData(
      this.state.player.playerId,
      "Player left",
      EMatchType.PVE,
      this.state.enemy.enemyId
    );
  };

  private onCombatMessage = () => {
    this.onMessage(
      "attack",
      async (_client: Client, data: { name: string }) => {
        const selectedSkill: Skill = this.state.player.skills.filter(
          (s: Skill) => s.name === data.name
        )[0];
        const damage: number = getRandomArbitrary(
          selectedSkill.minDamage,
          selectedSkill.maxDamage
        );
        this.state.enemy.health -= damage;
        if (this.state.enemy.health <= 0) {
          this.state.didWin = true;
          await this.gameService.logActionData(
            this.state.player.playerId,
            "Player win",
            EMatchType.PVE,
            this.state.enemy.enemyId
          );
        } else {
          this.broadcast("bot-attacking");
        }

        await this.gameService.logActionData(
          this.state.player.playerId,
          `Player did ${damage} damage using ${data.name}`,
          EMatchType.PVE,
          this.state.enemy.enemyId
        );
      }
    );

    this.onMessage("bot-attack", async (_client: Client, data: {}) => {
      const damage: number = getRandomArbitrary(
        this.state.enemy.minDamage,
        this.state.enemy.maxDamage
      );
      this.state.player.health -= damage;
      if (this.state.player.health <= 0) {
        this.state.didWin = false;
        await this.gameService.logActionData(
          this.state.player.playerId,
          "Player lost",
          EMatchType.PVE,
          this.state.enemy.enemyId
        );
      } else {
        this.broadcast("client-attacking");
      }

      await this.gameService.logActionData(
        this.state.player.playerId,
        `Enemy did ${damage} damage on player`,
        EMatchType.PVE,
        this.state.enemy.enemyId
      );
    });
  };

  onDispose() {
    logger.info("room destroyed!");
  }

  private reset() {
    this.state.didWin = false;
    this.unlock();
  }
}
