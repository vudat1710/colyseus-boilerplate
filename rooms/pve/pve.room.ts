import { Client, Room } from "colyseus";
import { PVERoom, Player, Enemy, Skill } from "@states/index";
import logger from "@logger";
import { IGameService } from "@interfaces/service/service.interface";
import GameService from "@services/game/game.service";
import { TPlayer, TEnemy, EMatchType } from "@interfaces/game/game.interface";
import { getRandomArbitrary } from "@utils/utils";

export class PveGameRoom extends Room<PVERoom> {
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
    const player: Player = new Player(
      playerData.playerId,
      playerData.username,
      playerData.health,
      playerData.skills
    );
    player.sessionId = client.sessionId;
    player.seat = this.playerCount + 1;
    const enemyData: TEnemy = await this.gameService.getMonsterData(
      options.enemyId
    );
    const enemy: Enemy = new Enemy(enemyData);

    const newState: PVERoom = new PVERoom(player, enemy, false);
    this.setState(newState);

    await this.gameService.logActionData(
      options.playerId,
      "Join room successful",
      EMatchType.PVE,
      options.enemyId
    );
    this.lock();
  };

  onLeave = async (client: Client) => {
    logger.info(`client left ${client.sessionId}`);
    await this.gameService.logActionData(
      this.state.player.getPlayerId,
      "Player left",
      EMatchType.PVE,
      this.state.enemy.getEnemyId
    );
    delete this.state.player;
    this.playerCount--;
  };

  private onCombatMessage = () => {
    this.onMessage("attack", async (client: Client, data: { name: string }) => {
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
        // client.send("bot-attack", {});
        this.broadcast("turn-for-bot", "abc")
        console.log("Enemy's health: ", this.state.enemy.getEnemyHealth);
        return;
      }

      await this.gameService.logActionData(
        this.state.player.playerId,
        `Player did ${damage} damage using ${data.name}`,
        EMatchType.PVE,
        this.state.enemy.enemyId
      );
    });

    this.onMessage("bot-attack", async (client: Client, data: {}) => {
      const damage: number = getRandomArbitrary(
        this.state.enemy.minDamage,
        this.state.enemy.maxDamage
      );
      console.log("bot-damage: ", damage)
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
        this.broadcast("turn-for-player", "abc")
        console.log("Player's health: ", this.state.player.getPlayerHealth);
        return;
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
    this.unlock();
  }
}
