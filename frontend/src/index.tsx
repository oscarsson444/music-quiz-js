import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { GamemodeSelect } from "./components/GamemodeSelect";
import { MultiplayerQuiz } from "./components/MultiplayerQuiz";
import ErrorPage from "./errorPage";
import { ProfilePage } from "./pages/ProfilePage";
import { BrowseQuizPage } from "./pages/singleplayer/BrowseQuizPage";
import { CreateQuizPage } from "./pages/singleplayer/CreateQuizPage";
import { PlayQuizPage } from "./pages/singleplayer/PlayQuizPage";
import { StartPage } from "./pages/singleplayer/StartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <GamemodeSelect />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/multiplayer",
        element: <MultiplayerQuiz />,
      },
      {
        path: "/singleplayer",
        element: <StartPage />,
      },
      {
        path: "/singleplayer/create",
        element: <CreateQuizPage />,
      },
      {
        path: "/singleplayer/browse",
        element: <BrowseQuizPage />,
      },
      {
        path: "/singleplayer/play",
        element: <PlayQuizPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
