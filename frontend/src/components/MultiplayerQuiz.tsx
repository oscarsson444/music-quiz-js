import { Box, Center } from "@chakra-ui/react";
import { useState } from "react";
import { GameState, GameView } from "../types/stateTypes";
import { GameContext } from "../context/GameContext";
import { StartPage } from "../pages/multiplayer/StartPage";
import { LobbyPage } from "../pages/multiplayer/LobbyPage";
import { SongSelectionPage } from "../pages/multiplayer/SongSelectionPage";
import { MatchPage } from "../pages/multiplayer/MatchPage";

export const MultiplayerQuiz = () => {
  const [gameState, setGameState] = useState<GameState>({
    view: GameView.START,
    user: null,
    participants: [],
    match: null,
  });
  const value = { gameState, setGameState };

  return (
    <GameContext.Provider value={value}>
      <Box
        width={"100%"}
        background={
          "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
        }
        h="calc(100vh - 70px)"
      >
        <Center>
          {gameState.view === GameView.START && <StartPage />}
          {gameState.view === GameView.LOBBY && <LobbyPage />}
          {gameState.view === GameView.SONG_SELECT && <SongSelectionPage />}
          {gameState.view === GameView.MATCH && <MatchPage />}
        </Center>
      </Box>
    </GameContext.Provider>
  );
};
