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
    this.lock();
  };

  onLeave(client) {
    logger.info(`client left ${client.sessionId}`);

    delete this.state.player;
    this.playerCount--;
  }

  //     onMessage (client, message) {
  //         console.log("message received", message);

  //         if (!message) return;

  //         let player: Player = this.state.player;

  //         if (!player) return;

  //         let command: string = message['command'];

  //         switch (command) {
  //             case 'init':
  //                 let newPlayer =
  //             default:
  //                 console.log('unknown command');
  //         }
  //     }

  onDispose() {
    logger.info("room destroyed!");
  }
}
