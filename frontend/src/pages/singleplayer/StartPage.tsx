import { Box, Button, Center, Tooltip, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { BackButton } from "../../components/BackButton";

export const StartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  return (
    <Center h="calc(100vh - 70px)">
      <Box position={"absolute"} top="10%" left="0">
        <BackButton text="Select gamemode" handler={() => navigate("/")} />
      </Box>
      <VStack w="20%" spacing={"10px"}>
        <Tooltip
          placement="top"
          label={!user ? "Sign in to create your own quiz" : ""}
        >
          <Button
            isDisabled={!user}
            w="100%"
            borderRadius={"20px"}
            background={"red.400"}
            color={"white"}
            onClick={() => navigate("/singleplayer/create")}
          >
            Create your custom quiz
          </Button>
        </Tooltip>
        <Button
          w="100%"
          borderRadius={"20px"}
          colorScheme="green"
          color={"white"}
          onClick={() => navigate("/singleplayer/browse")}
        >
          Browse custom quizzes
        </Button>
      </VStack>
    </Center>
  );
};
