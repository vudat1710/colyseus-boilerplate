import { Client, Room } from "colyseus";
import { PVERoom, Player, Enemy } from "@states/index";
import logger from "@logger";
import { IGameService } from "@interfaces/service/service.interface";
import GameService from "@services/game/game.service";
import { TPlayer, TEnemy } from "@interfaces/game/game.interface";

export class GameRoom extends Room<PVERoom> {
  maxClients: number = 1;
  playerCount: number = 0;
  private gameService: IGameService = new GameService();
  //   currentPlayer: Player;

  public onCreate(options: any): void | Promise<any> {
    logger.info("Room is created!");
    this.reset();
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
    this.state.currentTurn = client.sessionId;
    this.state.didWin = false;
    this.lock();
  };

  onLeave(client: Client) {
    logger.info(`client left ${client.sessionId}`);

    delete this.state.player;
    this.playerCount--;
  }

  private onCombatMessage = () => {
    this.onMessage("attack", (client: Client, data: any) => {

    })
  }

  onDispose() {
    logger.info("room destroyed!");
  }

  private reset() {
    this.state.currentTurn = "";
    this.state.didWin = false;
    this.unlock();
  }
}
