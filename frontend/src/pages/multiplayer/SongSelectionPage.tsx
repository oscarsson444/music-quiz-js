import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useLockSongs } from "../../api/match";
import { useSong } from "../../api/song";
import { socket } from "../../context/socket";
import { GameContext } from "../../context/GameContext";
import { SongFetchType } from "../../types/fetchTypes";
import { GameView } from "../../types/stateTypes";
import { BackButton } from "../../components/BackButton";
import { SongCard } from "../../components/SongCard";
import { useNavigate } from "react-router-dom";

export const SongSelectionPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [songs, setSongs] = useState<SongFetchType[] | null>(null);
  const [viewChosen, setViewChosen] = useState<boolean>(false);
  const [chosenSongs, setChosenSongs] = useState<SongFetchType[]>([]);
  const { gameState, setGameState } = useContext(GameContext);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(event.target.value);
  const navigate = useNavigate();
  const {
    loading,
    getSong,
  }: {
    loading: boolean;
    getSong: (query: string) => Promise<SongFetchType[]>;
  } = useSong();
  const { lockSongs } = useLockSongs(gameState.user?.userId);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinMatch", {
        username: gameState.user?.username,
        matchId: gameState.match?.matchId,
      });
    });
    socket.on("match", (data: { status: string }) => {
      if (data.status === "START") {
        setGameState({
          ...gameState,
          view: GameView.MATCH,
        });
      }
    });

    return () => {
      socket.off("match");
      socket.off("connect");
    };
  }, []);

  const searchButton = async () => {
    const songs = await getSong(searchText);
    filterSongName(songs);
  };

  const handleSwitch = () => {
    setViewChosen(!viewChosen);
  };

  /*
   * Removes all non All Non-Alphanumeric Characters and cuts them off
   * if there is a non alphanumeric character in the middle of the string
   * and then trims it
   */
  const filterSongName = (songs: SongFetchType[]) => {
    const regex = /[^a-zA-Z0-9\s\']+/;
    let filtered = songs.map((song) => {
      const firstNonAlphanumeric = song.title.match(regex);
      return firstNonAlphanumeric
        ? {
            ...song,
            title: song.title
              .substring(0, firstNonAlphanumeric.index)
              .replace(regex, "")
              .trim(),
          }
        : song;
    });
    setSongs(filtered);
  };

  // TODO emit to lobby that someone is ready
  const handleLockSongs = async () => {
    await lockSongs(gameState.match?.matchId, chosenSongs);
  };

  const handleStartMatch = async () => {
    await lockSongs(gameState.match?.matchId, chosenSongs);
    setGameState({
      ...gameState,
      view: GameView.MATCH,
    });
    socket.emit("getSong", { matchId: gameState.match?.matchId });
  };

  const checkKey = (e: any) => {
    if (e.keyCode === 13) {
      searchButton();
    }
  };

  document.onkeydown = checkKey;

  const handleLeaveLobby = (matchId: number | undefined) => {
    socket.emit("leaveMatch", { matchId: matchId });
    setGameState({
      view: GameView.START,
      user: null,
      participants: [],
      match: null,
    });
  };

  const removeSong = (song: SongFetchType) => {
    const index = chosenSongs.map((s) => s.title).indexOf(song.title);
    const newChosenSongs = chosenSongs;
    if (index > -1) {
      newChosenSongs.splice(index, 1);
    }
    setChosenSongs(newChosenSongs);
  };

  const addSong = (song: SongFetchType) => {
    const newChosenSongs = chosenSongs;
    newChosenSongs.push(song);
    setChosenSongs(newChosenSongs);
  };

  return (
    <Flex
      justify={"center"}
      w={"100%"}
      background={
        "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
      }
      pb={"50px"}
      minH="calc(100vh - 70px)"
    >
      <Box position={"absolute"} top="10%" left="0">
        <BackButton
          text="Leave Lobby"
          handler={() => {
            handleLeaveLobby(gameState.match?.matchId);
            navigate("/multiplayer");
          }}
        />
      </Box>
      <VStack w="20%" mt="50px">
        <HStack w={"100%"}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<AddIcon color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Song name and artist..."
              value={searchText}
              onChange={handleChange}
              backgroundColor="white"
            />
          </InputGroup>
          <IconButton
            aria-label="Switch"
            icon={<HamburgerIcon />}
            backgroundColor={"green.400"}
            onClick={handleSwitch}
          />
        </HStack>
        {!viewChosen && (
          <Box w={"100%"}>
            <Button w={"100%"} isLoading={loading} onClick={searchButton}>
              Search!
            </Button>
            {songs &&
              songs
                .filter((item) => {
                  const songFiles = chosenSongs.map((song) => song.songFile);
                  return !songFiles.includes(item.songFile);
                })
                .map((item, index) => (
                  <SongCard
                    key={index}
                    song={{
                      title: item.title,
                      songFile: item.songFile,
                      image: item.image,
                      bigImage: item.bigImage,
                    }}
                    selected={false}
                    addSong={addSong}
                    removeSong={removeSong}
                  />
                ))}
          </Box>
        )}
        {viewChosen && (
          <Box w={"100%"}>
            {gameState.user?.userType === "leader" ? (
              <Button w={"100%"} onClick={handleStartMatch}>
                Start match
              </Button>
            ) : (
              <Button w={"100%"} onClick={handleLockSongs}>
                Lock in songs
              </Button>
            )}
            {chosenSongs &&
              chosenSongs.map((item, index) => (
                <SongCard
                  key={index}
                  song={{
                    title: item.title,
                    songFile: item.songFile,
                    image: item.image,
                    bigImage: item.bigImage,
                  }}
                  selected={true}
                  addSong={addSong}
                  removeSong={removeSong}
                />
              ))}
          </Box>
        )}
      </VStack>
    </Flex>
  );
};
