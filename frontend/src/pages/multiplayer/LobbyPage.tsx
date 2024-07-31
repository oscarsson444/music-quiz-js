import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { socket } from "../../context/socket";
import { GameContext } from "../../context/GameContext";
import { GameView } from "../../types/stateTypes";
import { BackButton } from "../../components/BackButton";
import { ParticipantCard } from "../../components/ParticipantCard";
import { useNavigate } from "react-router-dom";

export const LobbyPage = () => {
  const { gameState, setGameState } = useContext(GameContext);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinMatch", {
        username: gameState.user?.username,
        matchId: gameState.match?.matchId,
      });
    });
    socket.on("match", (data) => {
      if (gameState.match !== null) {
        if (data.status === "JOIN") {
          const usernames = gameState.participants.map(
            (participant) => participant.username
          );
          if (!usernames.includes(data.username)) {
            const tempState = { ...gameState };
            tempState.participants.push({
              username: data.username,
              userType: "normal",
              score: 0,
            });
            setGameState(tempState);
          }
        } else if (data.status === "LEAVE") {
          const tempState = { ...gameState };
          const index = tempState.participants.indexOf(data.socketId);
          tempState.participants.splice(index, 1);
          setGameState(tempState);
        } else if (data.status === "SONG_SELECT") {
          const newState = {
            ...gameState,
            view: GameView.SONG_SELECT,
            participants: gameState.participants,
            match: { matchId: gameState.match.matchId },
          };
          setGameState(newState);
        }
      }
    });

    return () => {
      socket.off("match");
      socket.off("connect");
    };
  }, []);

  const handleStartMatch = () => {
    socket.emit("selectSongs", { matchId: gameState.match?.matchId });
  };

  const handleLeaveLobby = (matchId: number | undefined) => {
    socket.emit("leaveMatch", { matchId: matchId });
    setGameState({
      view: GameView.START,
      user: null,
      participants: [],
      match: null,
    });
  };

  return (
    <Box w="100%">
      <Box position={"absolute"} top="10%" left="0">
        <BackButton
          text="Leave Lobby"
          handler={() => {
            handleLeaveLobby(gameState.match?.matchId);
            navigate("/multiplayer");
          }}
        />
      </Box>

      <Flex justify={"space-evenly"} w="100%">
        <VStack
          width={"25%"}
          p="20px"
          mt="20vh"
          borderRadius={"30px"}
          border="1px"
          color="white"
        >
          <Text fontWeight={900} fontSize={24} textAlign={"center"}>
            {"Match ID: " + gameState.match?.matchId}
          </Text>
          {gameState.user?.userType === "leader" && (
            <Button
              mt="5%"
              w={"100%"}
              marginBottom="5%"
              borderRadius={"20px"}
              backgroundColor={"green.300"}
              colorScheme="green"
              onClick={handleStartMatch}
            >
              Start match
            </Button>
          )}
          <Text fontWeight={900} fontSize={24}>
            Participants
          </Text>
          {gameState.participants.map((participant) => (
            <ParticipantCard
              key={participant.username}
              username={participant.username}
            />
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};
