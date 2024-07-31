import {
  AddIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  IconButton,
  Image,
  ScaleFade,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { QuestionModal } from "../../components/QuestionModal";
import { SaveQuizModal } from "../../components/SaveQuizModal";
import { QuestionItems } from "../../types/quizTypes";
import { BackButton } from "../../components/BackButton";

export const CreateQuizPage = () => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [song, setSong] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionItems[]>([]);
  const [index, setIndex] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSave,
    onOpen: onOpenSave,
    onClose: onCloseSave,
  } = useDisclosure();

  const handleRedo = () => {
    setImage("");
    setSong("");
  };

  const handleNext = () => {
    // Saves this question and creates a new blank one.
    if (index === questions.length) {
      if (question !== "" && answer !== "") {
        setQuestions([
          ...questions,
          {
            question: question,
            answer: answer,
            image: image,
            song: song,
          },
        ]);
        setQuestion("");
        setAnswer("");
        setImage("");
        setSong("");
      }
    } else {
      // Goes to next already created question.
      if (questions.length === index + 1) {
        setQuestion("");
        setAnswer("");
        setImage("");
        setSong("");
      } else {
        setQuestion(questions[index + 1].question);
        setAnswer(questions[index + 1].answer);
        setImage(questions[index + 1].image);
        setSong(questions[index + 1].song);
      }
    }
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    // Goes to previous already created question.
    setQuestion(questions[index - 1].question);
    setAnswer(questions[index - 1].answer);
    setImage(questions[index - 1].image);
    setSong(questions[index - 1].song);
    setIndex((prev) => prev - 1);
  };

  const handleRemoveQuestion = () => {
    // Removes the current question.
    questions.splice(index, 1);
    if (index > 0) {
      handlePrev();
    } else if (index === 0 && questions.length === 0) {
      setQuestion("");
      setAnswer("");
      setImage("");
      setSong("");
    } else {
      handleNext();
    }
  };

  return (
    <Box>
      <Box position={"absolute"} top="10%" left="0">
        <BackButton
          text={"Go to start"}
          handler={() => window.history.back()}
        />
      </Box>
      <QuestionOutlineIcon
        color={"white"}
        mt="30px"
        mr="30px"
        float={"right"}
        boxSize={"40px"}
        cursor={"pointer"}
        onClick={() => setShowInfo(!showInfo)}
      />
      {showInfo && (
        <ScaleFade in={true}>
          <Box
            w="300px"
            h="200px"
            right="7%"
            position={"absolute"}
            zIndex={10}
            background={"white"}
            borderRadius={"20px"}
          >
            <Text p="10px">
              Make your own custom quiz questions. Search for a song, album or
              artist and get data that you can use to form creative questions.
              For example: "When did this album come out", togheter with the
              album cover and a song.
            </Text>
          </Box>
        </ScaleFade>
      )}
      <Tooltip
        label={
          question === "" || answer === ""
            ? "First create a question and an answer"
            : "Go to next question or create it"
        }
      >
        <IconButton
          aria-label="Next"
          size={"lg"}
          position="absolute"
          top="50%"
          right="25%"
          isDisabled={question === "" || answer === ""}
          onClick={handleNext}
        >
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        label={
          questions.length === 0
            ? "There are no previous questions"
            : "Go to previous question"
        }
      >
        <IconButton
          isDisabled={questions.length === 0 || index === 0}
          aria-label="Prev"
          size={"lg"}
          position="absolute"
          top="50%"
          left="25%"
          onClick={handlePrev}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      <Center position="absolute" left="calc(50% - 250px)" top="5%">
        <Tooltip
          label={
            image !== "" || song !== "" ? "Remove chosen image and track" : ""
          }
        >
          <IconButton
            isDisabled={image === "" && song === ""}
            aria-label="Redo"
            borderRadius={"50%"}
            position="absolute"
            top="10%"
            left="5%"
            onClick={handleRedo}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <VStack
          background="radial-gradient(circle at 50% 68.8%, rgb(150, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
          border="1px"
          borderColor={"white"}
          borderRadius={"20px"}
          h="80%"
          w="500px"
          mt="50px"
          p="10px"
        >
          <Center w="90%" h="400px">
            <VStack spacing={"20px"}>
              <Center
                w="300px"
                border="1px"
                borderColor={"gray"}
                borderRadius={"10px"}
                backgroundColor={"rgba(255, 255, 255, 0.5)"}
                h="300px"
              >
                {image !== "" ? (
                  <Image src={image} />
                ) : (
                  <Button
                    w="200px"
                    mt="10px"
                    onClick={() => {
                      setTitle("Image");
                      onOpen();
                    }}
                    leftIcon={<AddIcon />}
                  >
                    Add image
                  </Button>
                )}
              </Center>
              {song !== "" ? (
                <audio
                  controls
                  style={{
                    width: "230px",
                    borderRadius: "10px",
                  }}
                >
                  <source src={song} type="audio/mp3" />
                </audio>
              ) : (
                <Button
                  w="200px"
                  onClick={() => {
                    setTitle("Song");
                    onOpen();
                  }}
                  leftIcon={<AddIcon />}
                >
                  Add track
                </Button>
              )}
            </VStack>
          </Center>
          <Textarea
            background="white"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question here..."
          />
          <Textarea
            background="white"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer here..."
          />
        </VStack>
      </Center>
      <Tooltip label="Exit">
        <IconButton
          position="absolute"
          right="5%"
          bottom="10%"
          boxSize={"50px"}
          borderRadius={"50%"}
          colorScheme="red"
          onClick={handleRemoveQuestion}
          aria-label="Quit"
        >
          <CloseIcon boxSize={"30px"} />
        </IconButton>
      </Tooltip>
      <Tooltip label="Save Quiz">
        <IconButton
          position="absolute"
          right="10%"
          bottom="10%"
          boxSize={"50px"}
          borderRadius={"50%"}
          colorScheme="green"
          aria-label="Finish"
          onClick={onOpenSave}
        >
          <CheckIcon boxSize={"40px"} />
        </IconButton>
      </Tooltip>
      <QuestionModal
        title={title}
        isOpen={isOpen}
        onClose={onClose}
        setImage={setImage}
        setSong={setSong}
      />
      <SaveQuizModal
        isOpen={isOpenSave}
        onClose={onCloseSave}
        questions={questions}
      />
    </Box>
  );
};
