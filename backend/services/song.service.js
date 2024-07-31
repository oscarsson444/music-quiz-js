var { Song } = require("../models/model");

const getSong = async (matchId) => {
  try {
    const songs = await Song.find({ matchId: matchId });
    console.log(songs);
    if (songs.length === 0) return null;
    const song = songs[Math.floor(Math.random() * songs.length)];
    return song;
  } catch (e) {
    console.log(e);
    throw new Error("Can not find song!");
  }
};

const getSongByName = async (matchId, url) => {
  try {
    return await Song.findOne({ matchId: matchId, url: url });
  } catch (e) {
    console.log(e);
    throw new Error("Can not find song!");
  }
};

const removeSong = async (songId) => {
  try {
    const song = await Song.findById(songId);
    if (!song) return;
    await song.remove();
  } catch (e) {
    console.log(e);
  }
};

module.exports = { removeSong, getSong, getSongByName };
