export enum GameView {
  START = 1,
  SONG_SELECT = 2,
  LOBBY = 3,
  MATCH = 4,
}

export type GameUser = {
  username: string;
  userType: string;
  userId?: string;
  score: number;
};

export type GameState = {
  view: GameView;
  user: GameUser | null;
  participants: GameUser[];
  match: { matchId: number } | null;
};
