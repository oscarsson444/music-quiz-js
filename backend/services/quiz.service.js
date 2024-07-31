var { Quiz, Question, User } = require("../models/model");

const createQuiz = async (quizObj) => {
  try {
    const questions = quizObj.questions;
    const title = quizObj.title;
    const email = quizObj.email;

    const newQuiz = new Quiz({
      title,
      owner: email,
      image: questions[0].image,
      rating: 0,
    });
    const newQuizResp = await newQuiz.save();

    for (const question of questions) {
      const newQuestion = new Question({
        ...question,
        quizId: newQuizResp._id,
      });
      await newQuestion.save();
    }

    return { quiz: newQuizResp };
  } catch (e) {
    console.log(e);
    throw new Error("Quiz can not be created!");
  }
};

const getQuizes = async () => {
  try {
    const quizzes = await Quiz.find();
    return { quizzes: quizzes };
  } catch (e) {
    console.log(e);
    throw new Error("Quizes can not be found!");
  }
};

const getQuiz = async (id) => {
  try {
    const questions = await Question.find({ quizId: id });
    return { questions: questions };
  } catch (e) {
    console.log(e);
    throw new Error("Quiz can not be found!");
  }
};

const finishQuiz = async (id, data) => {
  try {
    const email = data.email;
    const score = data.score;
    const newElement = { id: id, score: score };
    const user = await User.findOne({ email: email });

    if (user.completedQuizzes.find((element) => element.id == id)) {
      const newCompletedQuizzes = user.completedQuizzes.map((element) => {
        if (element.id == id) {
          return newElement;
        } else {
          return element;
        }
      });
      return await user.updateOne(
        { $set: { completedQuizzes: newCompletedQuizzes } },
        { new: true }
      );
    } else {
      return await user.updateOne(
        { $push: { completedQuizzes: newElement } },
        { new: true }
      );
    }
  } catch (e) {
    console.log(e);
    throw new Error("Quiz can not be found!");
  }
};

module.exports = { createQuiz, getQuizes, getQuiz, finishQuiz };
