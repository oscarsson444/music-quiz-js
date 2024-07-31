import { Box, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const GamemodeSelect = () => {
  const [hoverRight, setHoverRight] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const navigate = useNavigate();

  const boxStyle = {
    zIndex: 1,
    cursor: "pointer",
    w: "50%",
    h: "100%",
    background: "transparent",
  };

  const textStyle = {
    width: "50%",
    top: "50%",
    backgroundClip: "text",
    fontWeight: "bold",
    fontFamily: "monospace",
  };

  return (
    <Box h="calc(100vh - 70px)">
      <HStack spacing={0} width={"100%"} height={"100%"}>
        <Box
          textAlign={"center"}
          {...boxStyle}
          _hover={{
            backgroundColor: "rgba(250, 0, 100, 0.1)",
            fontSize: "50px",
          }}
          onMouseEnter={() => setHoverLeft(true)}
          onMouseLeave={() => setHoverLeft(false)}
          onClick={() => navigate("/singleplayer")}
        >
          <Text
            transition={"all 0.3s ease-in-out"}
            fontSize={hoverLeft ? "50px" : "30px"}
            background={
              "linear-gradient(112.1deg, rgb(200, 200, 200) 20.4%, rgb(255, 255, 255) 90.2%)"
            }
            position={"absolute"}
            textAlign={"center"}
            {...textStyle}
          >
            Singleplayer
          </Text>
        </Box>
        <Box
          {...boxStyle}
          _hover={{ backgroundColor: "rgba(255, 250, 250, 0.1)" }}
          textAlign={"center"}
          onMouseEnter={() => setHoverRight(true)}
          onMouseLeave={() => setHoverRight(false)}
          onClick={() => navigate("/multiplayer")}
        >
          <Text
            transition={"all 0.3s ease-in-out"}
            fontSize={hoverRight ? "50px" : "30px"}
            position={"absolute"}
            textAlign={"center"}
            background={
              "linear-gradient(112.1deg, rgb(200, 200, 200) 20.4%, rgb(255, 255, 255) 90.2%)"
            }
            {...textStyle}
          >
            Multiplayer
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};
