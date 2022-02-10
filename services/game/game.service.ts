import { IGameService } from "@interfaces/service/service.interface";
import { GameRepository } from "@repositories/game/game.repository";
import { TEnemy, TPlayer } from "@interfaces/game/game.interface";
import logger from "@logger";

export default class GameService implements IGameService {
  private gameRepoInstance = new GameRepository();

  public getPlayerData = async (playerId: number): Promise<TPlayer> => {
    const result: TPlayer = await this.gameRepoInstance.getPlayerData(playerId);
    logger.info(`Get player data: ${playerId} successfully.`);
    return result;
  };

  public getMonsterData = async (enemyId: number): Promise<TEnemy> => {
    const result: TEnemy = await this.gameRepoInstance.getMonsterData(enemyId);
    logger.info(`Get enemy data: ${enemyId} successfully.`);
    return result;
  };

  public logActionData = async (
    playerId: number,
    message: string,
    match_type: number,
    enemyId: number
  ): Promise<boolean> => {
    const result: boolean = await this.gameRepoInstance.logPlayerAction(
      playerId,
      message,
      match_type,
      enemyId
    );

    return result;
  };
}
