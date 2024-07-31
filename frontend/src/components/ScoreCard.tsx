import { Center, ScaleFade, Text, VStack } from "@chakra-ui/react";
import { GameUser } from "../types/stateTypes";

export const ScoreCard = ({ participants }: { participants: GameUser[] }) => {
  return (
    <ScaleFade in={true}>
      <Center
        borderRadius={"30px"}
        h="100%"
        w="100%"
        border={"1px"}
        borderColor={"white"}
        padding={"40px"}
      >
        <VStack w="100%">
          {participants.map((participant) => (
            <Text fontSize={"25"} color="white">
              {participant.username + ": " + participant.score.toFixed(1)}
            </Text>
          ))}
        </VStack>
      </Center>
    </ScaleFade>
  );
};
