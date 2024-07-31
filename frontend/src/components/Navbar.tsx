import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isVisibleAvatar, setIsVisibleAvatar] = useState<boolean>(
    user?.picture ? true : false
  );

  useEffect(() => {
    if (Date.now() > user?.exp! * 1000) {
      setUser(null);
      setIsVisibleAvatar(false);
      localStorage.removeItem("user");
    }
    setIsVisibleAvatar(user?.picture ? true : false);
  }, [user]);

  return (
    <SimpleGrid
      columns={3}
      h={"70px"}
      borderBottom={"1px"}
      borderColor={"white"}
    >
      <GridItem gridColumn={2}>
        <Center>
          <Box
            borderRadius={"10px"}
            _hover={{ background: "rgba(255,255,255,0.1)" }}
            onClick={() => navigate("/")}
          >
            <Text
              cursor={"pointer"}
              background={
                "linear-gradient(112.1deg, rgb(200, 38, 57) 20.4%, rgb(200, 200, 200) 90.2%)"
              }
              backgroundClip={"text"}
              fontSize={"40px"}
              fontWeight={"bold"}
              fontFamily={"monospace"}
            >
              Music Quizzer
            </Text>
          </Box>
        </Center>
      </GridItem>
      <GridItem gridColumn={3} mr="10px" mt="10px">
        <Box float={"right"} hidden={isVisibleAvatar} id="g_id_button" />
        <Flex display={isVisibleAvatar ? "block" : "none"} float="right">
          <Menu>
            <MenuButton>
              <Avatar src={user?.picture} name={user?.name} />
            </MenuButton>
            <MenuList zIndex={1000}>
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                }}
              >
                My page
              </MenuItem>
              <Divider />
              <MenuItem
                mt="5px"
                onClick={() => {
                  setUser(null);
                  setIsVisibleAvatar(false);
                  navigate("/");
                  localStorage.removeItem("user");
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
    </SimpleGrid>
  );
};

{
  /*  */
}
