import { createContext } from "react";
import { User } from "../types/userTypes";

export type UserContextType = {
  user: User | null; // null is the initial value when no user is signed in.
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: {
    name: "",
    email: "",
    picture: "",
    exp: 0,
  },
  setUser: (user: User | null) => {},
});
