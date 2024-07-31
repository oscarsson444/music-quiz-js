import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { QuestionItems } from "../types/quizTypes";
import { useApi } from "./api";

export const useSaveQuiz = () => {
  const { loading, fetchData } = useApi();
  const { user } = useContext(UserContext);

  const saveQuiz = async (questions: QuestionItems[], title: string) => {
    const resp = await fetchData({
      method: "POST",
      url: "/quiz/create",
      data: {
        title: title,
        email: user?.email,
        questions: questions,
      },
    });
    if (resp?.status === 201) {
      return resp.data;
    } else {
      throw new Error("Could not save quiz!");
    }
  };

  return { loading, saveQuiz };
};

export const useGetAllQuizes = () => {
  const { loading, fetchData } = useApi();

  const getAllQuizes = async () => {
    const resp = await fetchData({
      method: "GET",
      url: "/quiz/all",
    });
    if (resp?.status === 200) {
      return resp.data;
    } else {
      throw new Error("Could not get all quizes!");
    }
  };

  return { loading, getAllQuizes };
};

export const useGetQuiz = () => {
  const { loading, fetchData } = useApi();

  const getQuizQuestions = async (id: string) => {
    const resp = await fetchData({
      method: "GET",
      url: `/quiz/get/${id}`,
    });
    if (resp?.status === 200) {
      return resp.data;
    } else {
      throw new Error("Could not get quiz!");
    }
  };

  return { loading, getQuizQuestions };
};

export const useFinishQuiz = () => {
  const { loading, fetchData } = useApi();
  const { user } = useContext(UserContext);

  const finishQuiz = async (id: string, score: number) => {
    const resp = await fetchData({
      method: "POST",
      url: `/quiz/finish/${id}`,
      data: {
        score: score,
        email: user?.email,
      },
    });
    if (resp?.status === 200) {
      return resp.data;
    } else {
      throw new Error("Could not finish quiz!");
    }
  };

  return { loading, finishQuiz };
};
