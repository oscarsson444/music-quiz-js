import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  HStack,
  Heading,
  Image,
  Spinner,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useGetAllQuizes } from "../api/quiz";
import { useGetUser } from "../api/user";
import { QuizCard } from "../components/QuizCard";
import { Quiz } from "../types/quizTypes";
import { User } from "../types/userTypes";
import { getScore } from "./singleplayer/BrowseQuizPage";

interface ProfileUser {
  user: User;
  completedQuizzes: { id: string; score: number }[];
  multiplayerGamesPlayed: number;
  multiplayerGamesWon: number;
}

export const ProfilePage = () => {
  const { getAllQuizes } = useGetAllQuizes();
  const { getUser } = useGetUser();
  const user: User = JSON.parse(localStorage.getItem("user") ?? "{}");
  const [profileUser, setProfileUser] = useState<ProfileUser>();
  const [completedQuizzes, setCompletedQuizzes] = useState<Quiz[]>([]);
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchProfileUser = async () => {
      const resp = await getUser(user.email);
      setProfileUser(resp.user);
      const respQuizes = await getAllQuizes();
      const completedQuizzesId = resp.user.completedQuizzes.map(
        (quiz: { id: string; score: number }) => quiz.id
      );
      const completed = respQuizes.quizzes.filter((quiz: Quiz) =>
        completedQuizzesId.includes(quiz._id)
      );
      setCompletedQuizzes(completed);
      const mine = respQuizes.quizzes.filter(
        (quiz: Quiz) => quiz.owner === user.email
      );
      setMyQuizzes(mine);
    };
    fetchProfileUser();
  }, []);

  if (!profileUser) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box
      color="white"
      background={
        "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
      }
      pb={"50px"}
      pl="20px"
      minH={"100vh"}
    >
      <Box>
        <Heading color="red.400">My Account</Heading>
        <HStack mt="20px" align={"start"} spacing={"40px"}>
          <Image boxSize={"100px"} src={user.picture} />
          <Box fontSize={"20px"}>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
          </Box>
        </HStack>
      </Box>
      <Box mt="20px">
        <Heading color="red.400">My Quizzes</Heading>
        {myQuizzes.length === 0 ? (
          <Text>You have not created any quizzes yet!</Text>
        ) : (
          <HStack spacing={"20px"}>
            <Wrap mt="20px">
              {myQuizzes.map((quiz: Quiz) => (
                <QuizCard quiz={quiz} />
              ))}
            </Wrap>
          </HStack>
        )}
      </Box>
      <Box mt="20px">
        <Heading color="red.400">Completed Quizzes</Heading>
        {completedQuizzes.length === 0 ? (
          <Text>You have not completed any quizzes yet!</Text>
        ) : (
          <HStack spacing={"20px"}>
            <Wrap mt="20px">
              {completedQuizzes.map((quiz: Quiz) => (
                <Box>
                  <Box position="absolute">
                    <CheckCircleIcon color={"green"} boxSize={"50px"} />
                    <Text
                      color="green"
                      fontSize={"25px"}
                      fontWeight={"bold"}
                      fontFamily={"cursive"}
                    >
                      {getScore(quiz, profileUser.completedQuizzes)}
                    </Text>
                  </Box>
                  <QuizCard quiz={quiz} />
                </Box>
              ))}
            </Wrap>
          </HStack>
        )}
      </Box>
    </Box>
  );
};
