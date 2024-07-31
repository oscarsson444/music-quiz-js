import {
  Box,
  VStack,
  Text,
  Image,
  Input,
  Button,
  Center,
  Spinner,
  IconButton,
  HStack,
  InputGroup,
  InputRightAddon,
  Tooltip,
  Fade,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFinishQuiz, useGetQuiz } from "../../api/quiz";
import { useContext, useEffect, useRef, useState } from "react";
import { QuestionItems } from "../../types/quizTypes";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { UserContext } from "../../context/UserContext";

const setInitialArray = (questions: QuestionItems[]) => {
  const array: string[] = [];
  questions.forEach((question) => {
    array.push("");
  });
  return array;
};

const getBackgroundColor = (correctString: string) => {
  switch (correctString) {
    case "correct":
      return "green";
    case "incorrect":
      return "red";
    default:
      return "transparent";
  }
};

const getEmptyStringArray = (questions: QuestionItems[]) => {
  const array: string[] = [];
  questions.forEach((question) => {
    array.push("");
  });
  return array;
};

export const PlayQuizPage = () => {
  const { state } = useLocation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { finishQuiz } = useFinishQuiz();
  const { id, title } = state;
  const { loading: loadQuestions, getQuizQuestions } = useGetQuiz();
  const [questions, setQuestions] = useState<QuestionItems[]>([]);
  const [correctArray, setCorrectArray] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [showResultIcon, setShowResultIcon] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const resp = await getQuizQuestions(id);
      setQuestions(resp.questions);
      setCorrectArray(setInitialArray(resp.questions));
      setGuesses(getEmptyStringArray(resp.questions));
      setLoading(false);
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = questions[activeIndex].song;
      audioRef.current.load();
    }
  }, [activeIndex, questions]);

  useEffect(() => {
    if (
      correctArray.length !== 0 &&
      correctArray.every((element) => element != "")
    ) {
      setDone(true);
    }
  }, [correctArray]);

  const handleGuess = () => {
    const updatedCorrectArray = [...correctArray];
    setShowResultIcon(true);

    if (
      questions[activeIndex].answer.toLowerCase() ===
      guesses[activeIndex].toLowerCase()
    ) {
      updatedCorrectArray[activeIndex] = "correct";
    } else {
      updatedCorrectArray[activeIndex] = "incorrect";
    }

    setCorrectArray(updatedCorrectArray);
  };

  const checkKey = (e: any) => {
    if (e.keyCode === 13) {
      handleGuess();
    }
  };

  document.onkeydown = checkKey;

  if (loading) {
    return (
      <Center>
        <Spinner size={"lg"} />
      </Center>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => prev + 1);
    setShowResultIcon(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => prev - 1);
    setShowResultIcon(false);
  };

  const handleFinish = async () => {
    if (!user) {
      navigate("/singleplayer/browse");
    } else {
      const correctNum = correctArray.filter(
        (element) => element === "correct"
      ).length;
      const totalNum = correctArray.length;
      await finishQuiz(id, parseFloat((correctNum / totalNum).toFixed(2)));
      navigate("/singleplayer/browse");
    }
  };

  const handleQuit = () => {
    navigate("/singleplayer/browse");
  };

  return (
    <Center>
      <Box position="absolute" left="10%">
        <Text color="white" fontSize={"30px"} mb="10px">
          Score:
        </Text>
        <VStack>
          {questions.map((question, index) => (
            <HStack>
              <Box w="40px">
                {index === activeIndex && (
                  <ArrowForwardIcon boxSize={"40px"} color="white" />
                )}
              </Box>
              <Box
                w="40px"
                h="40px"
                border={"1px"}
                borderColor={"white"}
                background={getBackgroundColor(correctArray[index])}
              />
            </HStack>
          ))}
        </VStack>
      </Box>
      {done && (
        <Box
          borderRadius={"20px"}
          w="150px"
          p="10px"
          background={"white"}
          position="absolute"
          right="7.5%"
          top="17%"
        >
          <Text>
            You completed the quiz! Please press this green button to finish it!
          </Text>
        </Box>
      )}

      <Tooltip label="Finish quiz">
        <IconButton
          position="absolute"
          right="10%"
          top="10%"
          boxSize={"50px"}
          borderRadius={"50%"}
          colorScheme="green"
          aria-label="Finish"
          onClick={handleFinish}
        >
          <CheckIcon boxSize={"40px"} />
        </IconButton>
      </Tooltip>
      <Tooltip label="Finish quiz">
        <IconButton
          position="absolute"
          right="5%"
          top="10%"
          boxSize={"50px"}
          borderRadius={"50%"}
          colorScheme="red"
          onClick={handleQuit}
          aria-label="Quit"
        >
          <CloseIcon boxSize={"30px"} />
        </IconButton>
      </Tooltip>

      <HStack mt="40px">
        <IconButton
          color="gray"
          borderRadius={"50%"}
          colorScheme="gray"
          boxSize={"50px"}
          aria-label="Next"
          isDisabled={activeIndex === 0}
          onClick={handlePrev}
        >
          <ChevronLeftIcon boxSize={"40px"} />
        </IconButton>
        <VStack
          spacing={"30px"}
          paddingBottom={"20px"}
          border={"1px"}
          borderRadius={"20px"}
          borderColor={"pink"}
          w="400px"
        >
          <Text
            textAlign={"center"}
            w="100%"
            color="white"
            fontSize={"30px"}
            borderBottom={"1px"}
            borderColor={"pink"}
          >
            {title}
          </Text>
          {showResultIcon ? (
            <Fade in={showResultIcon}>
              {correctArray[activeIndex] === "correct" ? (
                <CheckCircleIcon boxSize={"250px"} color={"green"} />
              ) : (
                <Box boxSize={"250px"}>
                  <Text
                    background={"gray"}
                    p="10px"
                    borderRadius={"20px"}
                    textAlign={"center"}
                    w="250px"
                    position="absolute"
                    color="white"
                    marginTop={"90px"}
                    fontFamily={"cursive"}
                    fontWeight={"bold"}
                  >
                    {"Correct answer: " + questions[activeIndex].answer}
                  </Text>
                  <CloseIcon boxSize={"250px"} color={"red"} />
                </Box>
              )}
            </Fade>
          ) : (
            <Box>
              {correctArray[activeIndex] === "correct" && (
                <CheckCircleIcon
                  position="absolute"
                  boxSize={"50px"}
                  color={"green"}
                />
              )}
              {correctArray[activeIndex] === "incorrect" && (
                <CloseIcon position="absolute" boxSize={"50px"} color={"red"} />
              )}
              <Image src={questions[activeIndex].image} />
            </Box>
          )}
          <audio
            ref={audioRef}
            controls
            style={{ borderRadius: "10px", width: "90%" }}
          >
            <source src={questions[activeIndex].song} type="audio/mp3" />
          </audio>
          <Text w="90%" textAlign={"center"} color="white" fontSize={"20px"}>
            {questions[activeIndex].question}
          </Text>
          <InputGroup w="90%">
            <Tooltip
              label={
                correctArray[activeIndex] !== ""
                  ? "Cannot make another guess!"
                  : ""
              }
            >
              <Input
                color="white"
                placeholder="Enter answer..."
                isDisabled={correctArray[activeIndex] !== ""}
                value={guesses[activeIndex]}
                borderEndRadius={"0px"}
                onChange={(e) => {
                  const updatedGuesses = [...guesses];
                  updatedGuesses[activeIndex] = e.target.value;
                  setGuesses(updatedGuesses);
                }}
              />
            </Tooltip>
            <Tooltip label="The number of characters in the answer">
              <InputRightAddon
                children={
                  guesses[activeIndex].length +
                  "/" +
                  questions[activeIndex].answer.length
                }
              />
            </Tooltip>
          </InputGroup>
          <Button w="90%" onClick={handleGuess} colorScheme="green">
            Guess!
          </Button>
        </VStack>
        <IconButton
          color="gray"
          borderRadius={"50%"}
          colorScheme="gray"
          boxSize={"50px"}
          aria-label="Prev"
          isDisabled={activeIndex === questions.length - 1}
          onClick={handleNext}
        >
          <ChevronRightIcon boxSize={"40px"} />
        </IconButton>
      </HStack>
    </Center>
  );
};
