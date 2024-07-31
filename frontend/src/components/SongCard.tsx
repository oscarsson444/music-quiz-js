import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { SongFetchType } from "../types/fetchTypes";

export const SongCard = ({
  song,
  removeSong,
  addSong,
  selected,
}: {
  song: SongFetchType;
  removeSong: (song: SongFetchType) => void;
  addSong: (song: SongFetchType) => void;
  selected: boolean;
}) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = song.songFile;
      audioRef.current.load();
    }
  }, [song]);

  return (
    <Flex
      ref={cardRef}
      w={"100%"}
      position={"relative"}
      textAlign="center"
      color={"white"}
      fontSize={"1.3vw"}
      fontWeight={900}
      fontFamily="monospace"
      border={"solid 2px white"}
      borderRadius={"20px"}
      direction={"column"}
      align="center"
      mt={"40px"}
      p={"10px"}
    >
      <Image
        w={"100%"}
        borderRadius="20px"
        filter="brightness(60%)"
        src={song.image}
      />
      <Text
        position={"absolute"}
        top="40%"
        left="50%"
        w={"80%"}
        transform="translate(-50%, -50%)"
      >
        {song.title}
      </Text>
      <Box
        position={"absolute"}
        w="5vw"
        h="5vw"
        backgroundColor={"white"}
        top="60%"
        left="50%"
        borderRadius={"50%"}
        transform="translate(-50%, -50%)"
        cursor={"pointer"}
        onClick={() => {
          if (audioRef.current) {
            if (playing) {
              audioRef.current.pause();
              setPlaying(false);
            } else {
              audioRef.current.play();
              setPlaying(true);
            }
          }
        }}
      >
        <Box
          position={"absolute"}
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          {!playing ? (
            <IoMdPlay size={"100%"} color="black" />
          ) : (
            <IoMdPause size={"100%"} color="black" />
          )}
        </Box>
      </Box>

      <audio ref={audioRef}>
        <source src={song.songFile} type="audio/mp3" />
      </audio>
      <IconButton
        aria-label="Choose song"
        icon={!selected ? <CheckIcon /> : <CloseIcon />}
        onClick={
          !selected
            ? () => {
                addSong(song);
                if (cardRef.current) cardRef.current.style.display = "none";
              }
            : () => {
                removeSong(song);
                if (cardRef.current) cardRef.current.style.display = "none";
              }
        }
        mt="10px"
        w={"100%"}
        color="white"
        backgroundColor={!selected ? "green.300" : "red.300"}
      ></IconButton>
    </Flex>
  );
};
