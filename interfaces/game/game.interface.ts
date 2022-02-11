export type TPlayer = {
  playerId: number;
  username: string;
  health: number;
  skills: Array<{ name: string; minDamage: number; maxDamage: number }>;
};

export type TEnemy = {
  enemyId: number;
  health: number;
  name: string;
  minDamage: number;
  maxDamage: number;
};

export interface IPvERoom {
  currentTurn: string;
  player: TPlayer;
  enemy: TEnemy;
  didWin?: boolean;
}

export type TPlayerDataR = Array<{
  playerid: number;
  username: string;
  health: number;
  name: string;
  mindamage: number;
  maxdamage: number;
}>;

export type TEnemyR = Array<{
  enemyid: number;
  health: number;
  name: string;
  mindamage: number;
  maxdamage: number;
}>;

export enum EMatchType {
  PVE,
  PVP,
}
