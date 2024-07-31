import { useApi } from "./api";

export const useCreateUser = () => {
  const { loading, fetchData } = useApi();
  const createUser = async (email: string) => {
    const resp = await fetchData({
      method: "POST",
      url: "/user/create",
      data: {
        email: email,
      },
    });
    if (resp?.status === 201) {
      return resp.data;
    } else {
      throw new Error("Could not create user!");
    }
  };
  return { loading, createUser };
};

export const useGetUser = () => {
  const { loading, fetchData } = useApi();
  const getUser = async (email: string) => {
    const resp = await fetchData({
      method: "GET",
      url: `/user/get/${email}`,
    });
    if (resp?.status === 200) {
      return resp.data;
    } else {
      return resp;
    }
  };
  return { loading, getUser };
};
