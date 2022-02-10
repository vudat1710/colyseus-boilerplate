import { TPlayer, EMatchType, TEnemy } from "@interfaces/game/game.interface";

export interface IGameRepository {
  getPlayerData(playerId: number): Promise<TPlayer>;
  logPlayerAction(
    playerId: number,
    message: string,
    match_type: EMatchType,
    enemyId: number
  ): Promise<boolean>;
  getMonsterData(monsterId: number): Promise<TEnemy>;
}
