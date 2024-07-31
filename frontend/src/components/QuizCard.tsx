import { Button, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Quiz } from "../types/quizTypes";

export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  const navigate = useNavigate();
  return (
    <VStack
      w="270px"
      p="10px"
      border="1px"
      borderColor={"white"}
      borderRadius={"10px"}
    >
      <Image src={quiz.image} />
      <Text color="white">{quiz.title}</Text>
      <Text color="white">{"Created by: " + quiz.owner}</Text>
      <Button
        onClick={() =>
          navigate("/singleplayer/play", {
            state: { id: quiz._id, title: quiz.title },
          })
        }
        w="100%"
        colorScheme="green"
      >
        Play
      </Button>
    </VStack>
  );
};
