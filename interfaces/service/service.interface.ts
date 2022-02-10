import { TPlayer, TEnemy } from "@interfaces/game/game.interface";

export interface IGameService {
  getPlayerData(playerId: number): Promise<TPlayer>;
  getMonsterData(enemyId: number): Promise<TEnemy>;
  logActionData(
    playerId: number,
    message: string,
    match_type: number,
    enemyId: number
  ): Promise<boolean>;
}
