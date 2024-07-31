import { Box, useToast } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useCreateUser, useGetUser } from "./api/user";
import { Navbar } from "./components/Navbar";
import { UserContext } from "./context/UserContext";
import { JwtPayload } from "./types/parseTypes";
import { User } from "./types/userTypes";

declare const google: any;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const value = { user, setUser };
  const location = useLocation();
  const { createUser } = useCreateUser();
  const { getUser } = useGetUser();
  const toast = useToast();

  const handleCallbackResponse = async (response: any) => {
    const decoded: JwtPayload = jwt_decode(response.credential);
    const respUser = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      exp: decoded.exp,
    };
    const resp = await getUser(respUser.email);
    if (resp.status === 404) {
      const createResp = await createUser(respUser.email);
      if (createResp.status !== 201) {
        toast({
          title: "Error",
          description: "Could not create user!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }
    localStorage.setItem("user", JSON.stringify(respUser));
    setUser(respUser);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "595145346096-hbn3tkvrravddm2p1o7tm1k579aa8f3k.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("g_id_button"), {
      height: 50,
      type: "large",
    });
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <UserContext.Provider value={value}>
      <Box
        height={"100vh"}
        width={"100vw"}
        position={"absolute"}
        background={
          location.pathname === "/"
            ? "transparent"
            : "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
        }
      >
        {location.pathname === "/" && (
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height={"100%"}
            zIndex={-1}
            background={"black"}
          >
            <video autoPlay muted loop>
              <source src={process.env.PUBLIC_URL + "/dj.mp4"} />
            </video>
          </Box>
        )}
        <Navbar />
        <Outlet />
      </Box>
    </UserContext.Provider>
  );
}

export default App;
