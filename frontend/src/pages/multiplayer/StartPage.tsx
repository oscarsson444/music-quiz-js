import { Box, Button, Flex, Input, VStack, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useCreateMatch } from "../../api/match";
import { socket } from "../../context/socket";
import { GameContext } from "../../context/GameContext";
import { GameView } from "../../types/stateTypes";
import { BackButton } from "../../components/BackButton";

export const StartPage = () => {
  const [username, setUsername] = useState<string>("");
  const { createMatch, joinMatch } = useCreateMatch();
  const [join, setJoin] = useState<boolean>(false);
  const [matchId, setMatchId] = useState<string>("");
  const { setGameState } = useContext(GameContext);
  const toast = useToast();

  const handleInputUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleInputMatchId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchId(event.target.value);
  };
  const handleCreateClick = async () => {
    if (username === "") {
      toast({
        title: "Username cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const resp = await createMatch(username, socket.id, "leader");
    socket.emit("createMatch", {
      username: username,
      matchId: resp.matchData._id,
    });
    const newUser = {
      username: username,
      userType: resp.userData.userType,
      userId: resp.userData._id,
      score: 0,
    };
    const newState = {
      view: GameView.LOBBY,
      user: newUser,
      participants: [newUser],
      match: { matchId: resp.matchData._id },
    };
    setGameState(newState);
  };

  const handleJoin = () => {
    setJoin(true);
  };

  const handleJoinMatch = async (matchId: string) => {
    const resp = await joinMatch(username, matchId, socket.id, "normal");
    socket.emit("joinMatch", { username: username, matchId: Number(matchId) });
    const participants = resp.participants.map((p: any) => ({
      username: p.username,
      userType: p.userType,
      score: 0,
    }));

    const newUser = {
      username: username,
      userType: "normal",
      userId: resp.user._id,
      score: 0,
    };
    const newState = {
      view: GameView.LOBBY,
      user: newUser,
      participants: participants,
      match: { matchId: Number(matchId) },
    };
    setGameState(newState);
  };
  return (
    <Box w="100%">
      <Box position={"absolute"} top="10%" left="0">
        <BackButton
          text={"Select gamemode"}
          handler={() => {
            window.history.back();
            if (join) setJoin(!join);
          }}
        />
      </Box>
      <Flex w={"100%"} align="center" justify={"center"}>
        <VStack mt={"20%"} width="20%">
          {!join && (
            <Box width={"100%"}>
              <Input
                background={"white"}
                focusBorderColor={"pink"}
                width={"100%"}
                type="text"
                placeholder="Select a username..."
                value={username}
                onChange={handleInputUsername}
              />
              <Button
                mt={"10px"}
                width="100%"
                borderRadius={"20px"}
                backgroundColor="red.400"
                colorScheme={"hotpink"}
                onClick={handleCreateClick}
              >
                Create a match
              </Button>
            </Box>
          )}
          {join && (
            <Input
              background={"white"}
              focusBorderColor={"pink"}
              width={"100%"}
              type="text"
              placeholder="Enter match id"
              value={matchId}
              onChange={handleInputMatchId}
            />
          )}
          <Button
            width="100%"
            borderRadius={"20px"}
            colorScheme="green"
            color={"white"}
            onClick={join ? () => handleJoinMatch(matchId) : handleJoin}
          >
            Join match
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};
