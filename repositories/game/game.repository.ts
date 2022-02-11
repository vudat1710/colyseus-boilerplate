import "module-alias/register";
import {
  postgresConnection,
  logConnection,
} from "@connection/postgres/postgres.connection";
import { IGameRepository } from "@interfaces/repository/repo.interface";
import { GAME_PROCEDURES } from "@constants";
import {
  EMatchType,
  TEnemy,
  TEnemyR,
  TPlayer,
  TPlayerDataR,
} from "@interfaces/game/game.interface";
import { GameError } from "@errors/wallet.error";
import logger from "@logger";
require("dotenv").config();

export class GameRepository implements IGameRepository {
  public getPlayerData = async (playerId: number): Promise<TPlayer> => {
    try {
      const result: TPlayerDataR = await postgresConnection.func(
        GAME_PROCEDURES.GET_PLAYER_DATA_BY_ID,
        [playerId]
      );
      const player: TPlayer = {
        playerId: result[0].playerid,
        username: result[0].username,
        health: result[0].health,
        skills: result.map((row) => ({
          name: row.name,
          minDamage: row.mindamage,
          maxDamage: row.maxdamage,
        })),
      };

      return player;
    } catch (_err: any) {
      const logMessage: string = _err.hint;
      logger.error(logMessage);
      throw new GameError(_err.code, logMessage);
    }
  };

  public logPlayerAction = async (
    playerId: number,
    message: string,
    match_type: EMatchType,
    enemyId: number
  ): Promise<boolean> => {
    try {
      await logConnection.func(GAME_PROCEDURES.INSERT_ACTION_LOG, [
        playerId,
        enemyId,
        message,
        match_type,
        new Date().getTime(),
      ]);

      return true;
    } catch (_err: any) {
      const logMessage: string = _err.hint;
      logger.error(logMessage);
      throw new GameError(_err.code, logMessage);
    }
  };

  public getMonsterData = async (monsterId: number): Promise<TEnemy> => {
    try {
      const result: TEnemyR = await postgresConnection.func(
        GAME_PROCEDURES.GET_MONSTER_DATA_BY_ID,
        [monsterId]
      );

      const enemy: TEnemy = {
        enemyId: result[0].enemyid,
        maxDamage: result[0].maxdamage,
        name: result[0].name,
        minDamage: result[0].mindamage,
        health: result[0].health,
      };
      return enemy;
    } catch (_err: any) {
      const logMessage: string = _err.hint;
      logger.error(logMessage);
      throw new GameError(_err.code, logMessage);
    }
  };
}
