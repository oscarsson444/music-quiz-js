import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  VStack,
  Image,
  Text,
  ModalFooter,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SongFetchType } from "../types/fetchTypes";
import { useSong } from "../api/song";

const enum SearchType {
  ALBUM = "album",
  ARTIST = "artist",
}

export const QuestionModal = ({
  title,
  isOpen,
  onClose,
  setImage,
  setSong,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  setImage: (image: string) => void;
  setSong: (song: string) => void;
}) => {
  const [searchType, setSearchType] = useState<string>(SearchType.ALBUM);
  const [color, setColor] = useState<string>("green");
  const [searchText, setSearchText] = useState<string>("");
  const [items, setItems] = useState<SongFetchType[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>();
  const { getSong } = useSong();

  useEffect(() => {
    setSearchType(SearchType.ALBUM);
  }, [isOpen]);

  const handleTabChange = (e: number) => {
    switch (e) {
      case 0:
        setSearchType(SearchType.ALBUM);
        setColor("green");
        break;
      case 1:
        setSearchType(SearchType.ARTIST);
        setColor("pink");
        break;
      default:
        setSearchType(SearchType.ALBUM);
    }
    setHighlightIndex(undefined);
    setSearchText("");
    setItems([]);
  };

  const handleClick = () => {
    if (title === "Image") {
      if (searchType === SearchType.ALBUM) {
        setImage(items[highlightIndex!].image);
      } else {
        setImage(items[highlightIndex!].artistImage as string);
      }
    } else {
      setSong(items[highlightIndex!].songFile);
    }
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setHighlightIndex(undefined);
    setSearchText("");
    setItems([]);
  };

  const checkKey = (e: any) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  document.onkeydown = checkKey;

  const handleSearch = async () => {
    const result = await getSong(searchText);
    let uniqeResult: SongFetchType[] = [];
    if (title === "Image") {
      if (searchType === SearchType.ALBUM) {
        uniqeResult = result.filter(
          (item, index, array) =>
            array.findIndex((t) => t.image === item.image) === index
        );
      } else if (searchType === SearchType.ARTIST) {
        uniqeResult = result.filter(
          (item, index, array) =>
            array.findIndex((t) => t.artistImage === item.artistImage) === index
        );
      }
    } else {
      uniqeResult = result;
    }
    setItems(uniqeResult);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody maxH="60vh" overflow={"scroll"} mb="30px">
          {title === "Image" && (
            <Tabs onChange={handleTabChange} variant="soft-rounded" mb="5px">
              <TabList overflow={"hidden"}>
                <Tab _selected={{ color: "white", bg: "green.400" }}>Album</Tab>
                <Tab _selected={{ color: "white", bg: "pink.400" }}>Artist</Tab>
              </TabList>
            </Tabs>
          )}
          <HStack>
            <Input
              placeholder={"Search for albums, artists or songs..."}
              value={searchText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(event.target.value)
              }
            />
            <IconButton
              colorScheme={color}
              aria-label="Search"
              onClick={handleSearch}
              icon={<SearchIcon />}
            />
          </HStack>
          <VStack mt="20px" spacing={"15px"}>
            {items.map((item, index) => (
              <Box
                m="5px"
                border={highlightIndex === index ? "2px" : "1px"}
                background={highlightIndex === index ? "gray.200" : "white"}
                borderColor={color}
                borderRadius={"20px"}
                p="10px"
                key={index}
                w="250px"
                textAlign={"center"}
                onClick={() => setHighlightIndex(index)}
                _highlighted={{ border: "2px", borderColor: "green" }}
              >
                {title === "Image" ? (
                  <Box>
                    <Image
                      src={
                        searchType === SearchType.ALBUM
                          ? item.image
                          : item.artistImage
                      }
                    />
                    <Text>
                      {searchType === SearchType.ALBUM
                        ? item.albumName
                        : item.artistName}
                    </Text>
                  </Box>
                ) : (
                  <Box>
                    <Image src={item.image} />
                    <Text>{item.title}</Text>
                    <Box
                      backgroundColor={"blue.400"}
                      width="230px"
                      borderRadius={"10px"}
                    >
                      <audio
                        controls
                        style={{
                          width: "230px",
                          borderRadius: "10px",
                        }}
                      >
                        <source src={item.songFile} type="audio/mp3" />
                      </audio>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Tooltip
            label={
              highlightIndex === undefined ? "Click on an object first!" : ""
            }
          >
            <Button
              isDisabled={highlightIndex === undefined}
              colorScheme={color}
              mr={3}
              onClick={handleClick}
            >
              Choose
            </Button>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
