const mongoose = require("mongoose");

const activeMatchesSchema = new mongoose.Schema({
  matches: [{ type: Number, ref: "Match" }],
});

const matchSchema = new mongoose.Schema({
  _id: {
    required: true,
    type: Number,
  },
  maxSongs: {
    required: true,
    type: Number,
  },
  currentSong: {
    type: String,
  },
  currentTitle: {
    type: String,
  },
});

const participantSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  userType: {
    required: true,
    type: String, // "leader" or "normal"
  },
  score: {
    required: true,
    type: Number,
  },
  matchId: {
    required: true,
    type: Number,
  },
  socketId: {
    required: true,
    type: String,
  },
});

const songSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  bigImage: {
    required: false,
    type: String,
  },
  url: {
    required: true,
    type: String,
  },
  participantId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  matchId: {
    required: true,
    type: Number,
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  owner: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  rating: {
    required: true,
    type: Number,
  },
});

const questionSchema = new mongoose.Schema({
  question: {
    required: true,
    type: String,
  },
  answer: {
    required: true,
    type: String,
  },
  song: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  quizId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  completedQuizzes: {
    required: true,
    type: [{ id: mongoose.Schema.Types.ObjectId, score: Number }],
    default: [],
  },
  multiplayerGamesPlayed: {
    required: true,
    type: Number,
    default: 0,
  },
  multiplayerGamesWon: {
    required: true,
    type: Number,
    default: 0,
  },
});

const ActiveMatches = mongoose.model("ActiveMatches", activeMatchesSchema);
const Match = mongoose.model("Match", matchSchema);
const Participant = mongoose.model("Participant", participantSchema);
const Song = mongoose.model("Song", songSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const Question = mongoose.model("Question", questionSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  Match,
  ActiveMatches,
  Participant,
  Song,
  Quiz,
  Question,
  User,
};
