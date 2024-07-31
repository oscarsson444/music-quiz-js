var { Match, ActiveMatches, Participant, Song } = require("../models/model");
var { createParticipant } = require("../services/participant.service");

const createMatch = async (req) => {
  try {
    // Find free match id and make the match creator as participant
    const activeMatches = await ActiveMatches.find();
    const freeId = findFreeId(activeMatches[0].matches);
    const user = await createParticipant(
      req.body.username,
      freeId,
      req.body.socketId,
      req.body.userType
    );

    // Create a match, push it to active matches id's
    const data = new Match({
      _id: freeId,
      maxSongs: 4,
    });
    const matchData = await data.save();
    activeMatches[0].matches.push(freeId);
    activeMatches[0].save();
    return { matchData: matchData, userData: user };
  } catch (e) {
    // Delete created participant if match could not be created
    await Participant.deleteMany({ matchId: matchId });
    console.log(e);
    throw e;
  }
};

/*
 * Create a Participant that is connected to matchId
 */
const joinMatch = async (req) => {
  try {
    const activeMatches = await ActiveMatches.find();
    const matchId = Number(req.body.matchId);
    if (!activeMatches[0].matches.includes(matchId)) {
      throw new Error("No active match with this id!");
    }
    const user = await createParticipant(
      req.body.username,
      req.body.matchId,
      req.body.socketId,
      req.body.userType
    );
    const participants = await Participant.find({ matchId: req.body.matchId });
    return { user: user, participants: participants };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

/*
 * Find a free match id
 */
const findFreeId = (activeIds) => {
  while (1) {
    var val = Math.floor(1000 + Math.random() * 9000);
    if (!(val in activeIds)) {
      return val;
    }
  }
};

/*
 * Removes match, participants and songs of a match
 */
const removeMatch = async (matchId) => {
  try {
    await Song.deleteMany({ matchId: matchId });
    await Participant.deleteMany({ matchId: matchId });
    const activeMatches = await ActiveMatches.find();
    await activeMatches[0].updateOne({ $pull: { matches: matchId } });
    await Match.deleteOne({ _id: matchId });
  } catch (e) {
    console.log(e);
    throw new Error("Match can not be removed!");
  }
};

const getScore = async (matchId) => {
  try {
    const participants = await Participant.find({ matchId: matchId });
    const score = participants.map((participant) => {
      return {
        username: participant.username,
        score: participant.score,
      };
    });
    return score;
  } catch (e) {
    console.log(e);
    throw new Error("Score can not be fetched!");
  }
};

const selectSongs = (req) => {
  try {
    const matchId = req.body.matchId;
    const participantId = req.body.userId;
    const songs = req.body.songs;
    songs.map(async (song) => {
      const newSong = new Song({
        title: song.title,
        url: song.songFile,
        image: song.image,
        bigImage: song.bigImage,
        participantId: participantId,
        matchId: matchId,
      });
      await newSong.save();
    });
    return songs;
  } catch (e) {
    console.log(e);
    throw new Error("Songs can not be selected!");
  }
};

module.exports = { createMatch, removeMatch, joinMatch, selectSongs, getScore };
