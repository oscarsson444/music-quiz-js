import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  HStack,
  Spinner,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllQuizes } from "../../api/quiz";
import { useGetUser } from "../../api/user";
import { BackButton } from "../../components/BackButton";
import { QuizCard } from "../../components/QuizCard";
import { UserContext } from "../../context/UserContext";
import { Quiz } from "../../types/quizTypes";

export const getScore = (
  quiz: Quiz,
  completedQuizzes: { id: string; score: number }[]
) => {
  const score = completedQuizzes.find((elem) => elem.id === quiz._id)?.score;
  if (score === undefined) return "0%";
  return score * 100 + "%";
};

export const BrowseQuizPage = () => {
  const { loading, getAllQuizes } = useGetAllQuizes();
  const { getUser } = useGetUser();
  const { user } = useContext(UserContext);
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [completedQuizzesIds, setCompletedQuizzesIds] = useState<string[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<
    { id: string; score: number }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizes = async () => {
      const resp = await getAllQuizes();
      if (user) {
        const me = (await getUser(user?.email)).user;
        const ids = me.completedQuizzes.map((quiz: any) => quiz.id);
        setCompletedQuizzesIds(ids);
        setCompletedQuizzes(me.completedQuizzes);
      }
      setQuizes(resp.quizzes);
    };
    fetchQuizes();
  }, []);

  const handleBack = () => {
    navigate("/singleplayer");
  };

  if (loading) {
    return (
      <Center>
        <Spinner size={"lg"} />
      </Center>
    );
  }

  return (
    <Flex
      w={"100%"}
      background={
        "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
      }
      pb={"50px"}
      minH={"calc(100vh - 70px)"}
    >
      <Box position={"absolute"} top="10%" left="0">
        <BackButton text={"Go to start"} handler={handleBack} />
      </Box>

      <HStack>
        <Wrap p="20px" mt="80px">
          {quizes.map((quiz, index) => (
            <Box key={index}>
              {completedQuizzesIds.includes(quiz._id) && (
                <Tooltip
                  label="Completed quiz with a score displayed in percent"
                  aria-label="Completed"
                >
                  <Box position="absolute">
                    <CheckCircleIcon color={"green"} boxSize={"50px"} />
                    <Text
                      color="green"
                      fontSize={"25px"}
                      fontWeight={"bold"}
                      fontFamily={"cursive"}
                    >
                      {getScore(quiz, completedQuizzes)}
                    </Text>
                  </Box>
                </Tooltip>
              )}
              <QuizCard quiz={quiz} />
            </Box>
          ))}
        </Wrap>
      </HStack>
    </Flex>
  );
};
