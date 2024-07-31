import { SongFetchType } from "../types/fetchTypes";
import { useApi } from "./api";

export const useSong = () => {
  const { loading, fetchData } = useApi();

  const getSong = async (query: string): Promise<SongFetchType[]> => {
    const resp = await fetchData({
      method: "GET",
      url: "musicAPI/fetchSongs",
      params: { song: query },
    });
    if (resp?.status === 200) {
      return resp.data;
    } else {
      throw new Error("Could not fetch songs!");
    }
  };

  return { loading, getSong };
};
