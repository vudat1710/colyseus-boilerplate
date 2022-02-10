export type TPlayer = {
  username: string;
  health: number;
  skills: Array<{ name: string; minDamage: number; maxDamage: number }>;
};

export interface TEnemy {
  health: number;
  name: string;
  minDamage: number;
  maxDamage: number;
}

export interface IPvERoom {
  currentTurn: string;
  player: TPlayer;
  enemy: TEnemy;
  didWin?: boolean;
}

export type TPlayerDataR = Array<{
  username: string;
  health: number;
  name: string;
  minDamage: number;
  maxDamage: number;
}>;

export type TEnemyR = Array<TEnemy>;

export enum EMatchType {
  PVE,
  PVP,
}
