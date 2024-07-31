import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Progress,
  ScaleFade,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../context/GameContext";
import { socket } from "../../context/socket";
import { GameView } from "../../types/stateTypes";
import { BackButton } from "../../components/BackButton";
import { ParticipantCard } from "../../components/ParticipantCard";
import { ScoreCard } from "../../components/ScoreCard";
import { useNavigate } from "react-router-dom";

const enum MatchStatus {
  SHOW_SCORE = 1,
  IS_SPECTATING = 2,
  IS_PLAYING = 3,
  IS_WAITING = 4,
}

export const MatchPage = () => {
  // Status parameters
  const { gameState, setGameState } = useContext(GameContext);
  const [matchStatus, setMatchStatus] = useState(MatchStatus.IS_WAITING);
  const [counter, setCounter] = useState(5);
  const [status, setStatus] = useState("Match starting in:");

  // Game parameters
  const [guess, setGuess] = useState("");
  const [letterArray, setLetterArray] = useState<string[]>([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Song parameters
  const [songUrl, setSongUrl] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songImage, setSongImage] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      if (matchStatus !== MatchStatus.IS_WAITING) {
        setStatus("Wait for next round!");
      }
      socket.emit("joinMatch", {
        username: gameState.user?.username,
        matchId: gameState.match?.matchId,
      });
    });
    socket.on("match", (data) => {
      if (gameState.match !== null) {
        // Remove user from match if they leave
        if (data.status === "LEAVE") {
          const tempState = { ...gameState };
          const index = tempState.participants.indexOf(data.socketId);
          tempState.participants.splice(index, 1);
          setGameState(tempState);
        }
        // Event for when server sends a new song
        else if (data.status === "SONG") {
          // Game is finished if sever sends empty song
          if (!data.songTitle) {
            setStatus("Game finished!");
            setMatchStatus(MatchStatus.SHOW_SCORE);
            audioRef.current?.pause();
          } else {
            if (audioRef.current) audioRef.current.volume = 1.0;
            setStatus("");
            const title = (data.songTitle as string).toUpperCase();
            setSongImage(data.songImage);
            setSongTitle(title.toUpperCase().replace(/\s/g, ""));
            setSongUrl(data.songUrl);

            if (data.participantId !== gameState.user?.userId) {
              setMatchStatus(MatchStatus.IS_PLAYING);
              setLetterArray(Array.from(title));
            } else {
              setMatchStatus(MatchStatus.IS_SPECTATING);
            }
          }
        } else if (data.status === "TIMER") {
          if (audioRef.current && !audioRef.current.paused) {
            const fadeOutDuration = 4000;
            const fadeOutSteps = 40;
            const fadeOutStepSize = audioRef.current?.volume / fadeOutSteps;
            const timer = setInterval(() => {
              if (
                audioRef.current &&
                audioRef.current.volume > 0 + fadeOutStepSize
              ) {
                audioRef.current.volume -= fadeOutStepSize;
              } else {
                clearInterval(timer);
              }
            }, fadeOutDuration / fadeOutSteps);
          }
          setCounter(data.counter);
          if (data.counter === 0) {
            setStatus("");
          }
        } else if (data.status === "SCORE") {
          // Update score in gameState
          const participantsAndScore = data.score;
          const tempState = { ...gameState };
          participantsAndScore.map(
            (participant: { username: string; score: number }) => {
              const index = tempState.participants.findIndex(
                (p) => p.username === participant.username
              );
              tempState.participants[index].score += participant.score;
            }
          );
          setGameState(tempState);

          setMatchStatus(MatchStatus.SHOW_SCORE);
          setCounter(5);
          reset();
          setStatus("New song incoming in: ");
        } else if (data.status === "TIMEOUT") {
          setMatchStatus(MatchStatus.SHOW_SCORE);
          setCounter(5);
          reset();
          setStatus("Time's up! New song incoming in: ");
        }
      }
    });

    return () => {
      socket.off("match");
      socket.off("connect");
    };
  }, []);

  const checkKey = (e: any) => {
    if (e.keyCode === 13) {
      handleGuess();
    } else if (e.keyCode === 8) {
      const index = letterIndex - 1;
      if (index < 0) return;
      let letterElement = document.getElementById("letter_" + index);
      if (letterElement?.className.includes("transparent")) {
        letterElement = document.getElementById("letter_" + (index - 1));
        if (letterElement) {
          letterElement.innerHTML = "";
          setLetterIndex((prev) => prev - 1);
        }
      }
      if (letterElement) {
        letterElement.innerHTML = "";
      }
      setLetterIndex((prev) => prev - 1);
      setGuess((prev) => prev.slice(0, -1));
    } else {
      if (letterIndex >= letterArray.length) return;
      const letter = String.fromCharCode(e.keyCode);
      let letterElement = document.getElementById("letter_" + letterIndex);
      if (letterElement?.className.includes("transparent")) {
        letterElement = document.getElementById("letter_" + (letterIndex + 1));
        setLetterIndex((prev) => prev + 1);
      }
      if (letterElement) {
        letterElement.innerHTML = letter;
        setLetterIndex((prev) => prev + 1);
      }
      setGuess((prev) => prev + letter);
    }
  };

  document.onkeydown = checkKey;

  const handleGuess = () => {
    if (guess === songTitle) {
      setStatus("Correct guess!");
      setMatchStatus(MatchStatus.IS_SPECTATING);
      socket.emit("score", {
        matchId: gameState.match?.matchId,
        username: gameState.user?.username,
        participantId: gameState.user?.userId,
        url: songUrl,
      });
    } else {
      setStatus("Wrong guess!");
    }
  };

  const handleLeaveMatch = (matchId: number | undefined) => {
    socket.emit("leaveMatch", { matchId: matchId });
    setGameState({
      view: GameView.START,
      user: null,
      participants: [],
      match: null,
    });
  };

  const handleProgress = () => {
    if (audioRef.current)
      setProgress(
        Math.ceil(
          (audioRef.current?.currentTime / audioRef.current?.duration) * 100
        )
      );
  };

  const reset = () => {
    setProgress(0);
    setSongTitle("");
    setSongImage("");
    setLetterIndex(0);
    setGuess("");

    for (let i = 0; i < letterArray.length; i++) {
      const letterElement = document.getElementById("letter_" + i);
      if (letterElement) {
        letterElement.remove();
      }
    }
    setLetterArray([]);
  };

  return (
    <Box w="100%" h={"calc(100vh - 70px)"}>
      <Box position={"absolute"} top="10%" left="0">
        <BackButton
          text={"Leave match"}
          handler={() => {
            handleLeaveMatch(gameState.match?.matchId);
          }}
        />
      </Box>

      <Flex w="100%" h={"90%"}>
        <VStack
          w="30%"
          h={"fit-content"}
          m={"30px"}
          p={"30px"}
          border={"1px"}
          borderColor={"white"}
          mt={"15%"}
          borderRadius="30px"
        >
          {gameState.participants.map((participant) => (
            <Box w={"90%"}>
              <ParticipantCard
                username={participant.username}
                score={participant.score}
              />
            </Box>
          ))}
        </VStack>
        <VStack
          w={"70%"}
          gap={"30px"}
          m="30px"
          justify="center"
          border={"2px"}
          borderRadius="30px"
          borderColor="red.400"
          p={"30px"}
          h="100%"
        >
          {songUrl.length > 0 && (
            <audio
              ref={audioRef}
              key={songUrl}
              autoPlay={true}
              onTimeUpdate={handleProgress}
            >
              <source src={songUrl} type="audio/mp3" />
            </audio>
          )}

          <Text color={"white"} fontSize={"30px"}>
            {status} {counter > 0 && status !== "Game finished!" ? counter : ""}
          </Text>

          {matchStatus === MatchStatus.IS_PLAYING && (
            <VStack h={"100%"}>
              <Box w="100%">
                <Progress w="60vw" value={progress} mb="30px" />
              </Box>
              <Center>
                <Image
                  maxH="40vh"
                  src={process.env.PUBLIC_URL + "/Question_Mark.png"}
                />
              </Center>

              <HStack
                p={"40px"}
                overflowWrap={"anywhere"}
                flexWrap={"wrap"}
                rowGap={"10px"}
                justify="center"
              >
                {letterArray.map((letter, index) => (
                  <Box
                    textAlign={"center"}
                    verticalAlign={"middle"}
                    fontSize={"1.5vw"}
                    fontFamily={"monospace"}
                    id={"letter_" + index}
                    className={
                      letter === " " || letter === "'" ? "transparent" : ""
                    }
                    w={"2.5vw"}
                    h="2.5vw"
                    display={letter === "'" ? "none" : "block"}
                    backgroundColor={letter === " " ? "transparent" : "white"}
                  ></Box>
                ))}
              </HStack>
              <Center>
                <Button
                  width="200px"
                  borderRadius={"20px"}
                  backgroundColor="green.300"
                  colorScheme={"green"}
                  onClick={handleGuess}
                >
                  Guess!
                </Button>
              </Center>
            </VStack>
          )}
          {matchStatus === MatchStatus.IS_SPECTATING && (
            <Box h={"100%"}>
              <Box w="100%">
                <Progress w="60vw" value={progress} mb="30px" />
              </Box>
              <Center>
                <ScaleFade in={true}>
                  <Image h="50vh" src={songImage} />
                </ScaleFade>
              </Center>
            </Box>
          )}
          {matchStatus === MatchStatus.SHOW_SCORE && (
            <Box h={"100%"} w="100%">
              <Center h="100%">
                <ScoreCard participants={gameState.participants} />
              </Center>
            </Box>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};
