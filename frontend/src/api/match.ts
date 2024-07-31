import { SongFetchType } from "../types/fetchTypes";
import { useApi } from "./api";

export const useCreateMatch = () => {
  const { loading, fetchData } = useApi();

  const createMatch = async (
    username: string,
    socketId: string,
    userType: string
  ) => {
    const resp = await fetchData({
      method: "POST",
      url: "match/create",
      data: { username: username, socketId: socketId, userType: userType },
    });
    if (resp?.status === 201) {
      return resp.data;
    } else {
      throw new Error("Could not create macth!");
    }
  };

  const joinMatch = async (
    username: string,
    matchId: string,
    socketId: string,
    userType: string
  ) => {
    const resp = await fetchData({
      method: "POST",
      url: "match/join",
      data: {
        username: username,
        matchId: matchId,
        socketId: socketId,
        userType: userType,
      },
    });
    if (resp?.status === 201) {
      return resp.data;
    } else {
      throw new Error("Could not join match!");
    }
  };

  return { loading, createMatch, joinMatch };
};

export const useLockSongs = (userId: string | undefined) => {
  const { loading, fetchData } = useApi();

  const lockSongs = async (
    matchId: string | number | undefined,
    songs: SongFetchType[]
  ) => {
    const resp = await fetchData({
      method: "POST",
      url: "match/songs",
      data: { matchId: matchId, songs: songs, userId: userId },
    });
    if (resp?.status === 201) {
      return resp.data;
    } else {
      throw new Error("Could not lock songs!");
    }
  };

  return { loading, lockSongs };
};
