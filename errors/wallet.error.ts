export class GameError extends Error {
  public code: number;
  constructor(code: number, message: string, ...args: any) {
    super(...args);
    this.code = code;
    this.message = message;
  }
}

