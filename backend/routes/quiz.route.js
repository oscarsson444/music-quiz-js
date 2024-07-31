var express = require("express");
var router = express.Router();
var quizService = require("../services/quiz.service");

router.post("/create", async (req, res) => {
  try {
    const data = await quizService.createQuiz(req.body);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await quizService.getQuizes(req.body);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const data = await quizService.getQuiz(req.params.id);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/finish/:id", async (req, res) => {
  try {
    const data = await quizService.finishQuiz(req.params.id, req.body);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
