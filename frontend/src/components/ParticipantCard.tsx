import { Box, Text } from "@chakra-ui/react";

export const ParticipantCard = ({
  username,
  score,
}: {
  username: string;
  score?: number;
}) => {
  return (
    <Box
      width={"100%"}
      borderRadius="20px"
      padding="10px"
      textAlign="center"
      backgroundColor={"red.400"}
    >
      {score !== undefined ? (
        <Text>{username + ": " + score.toFixed(1)}</Text>
      ) : (
        <Text>{username}</Text>
      )}
    </Box>
  );
};
