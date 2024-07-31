var { Participant } = require("../models/model");

const createParticipant = async (username, freeId, socketId, userType) => {
  const data = new Participant({
    username: username,
    userType: userType,
    score: 0,
    matchId: freeId,
    socketId: socketId,
  });

  try {
    return await data.save();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const addScore = async (participantId, score) => {
  try {
    // Get the current score of the participant
    const participant = await Participant.findOne({
      participantId: participantId,
    });

    // Update the score
    await Participant.updateOne(
      { _id: participantId },
      { score: participant.score + Number(score) }
    );
  } catch (e) {
    console.log(e);
    throw new Error("Score can not be added!");
  }
};

const getParticipantBySocket = async (socketId) => {
  try {
    return await Participant.findOne({ socketId: socketId });
  } catch (e) {
    console.log(e);
    throw new Error("Participant can not be found!");
  }
};

module.exports = { createParticipant, addScore, getParticipantBySocket };
