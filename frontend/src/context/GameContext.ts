import { createContext } from "react";
import { GameState, GameView } from "../types/stateTypes";

export type GameStateContextType = {
  gameState: GameState;
  setGameState: (appState: GameState) => void;
};

export const GameContext = createContext<GameStateContextType>({
  gameState: {
    view: GameView.START,
    user: null,
    participants: [],
    match: null,
  },
  setGameState: (gameState: GameState) => {},
});
