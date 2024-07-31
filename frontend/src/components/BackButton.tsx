import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

export const BackButton = ({
  text,
  handler,
}: {
  text: string;
  handler: () => void;
}) => {
  return (
    <Button
      aria-label="Go back"
      ml={"20px"}
      size="lg"
      background={"red.400"}
      onClick={handler}
    >
      <ArrowBackIcon mr={"10px"} />
      {text}
    </Button>
  );
};
