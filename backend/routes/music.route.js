var express = require("express");
var router = express.Router();
var cors = require("cors");
var axios = require("axios");

router.get("/fetchSongs", cors(), async function (req, res, next) {
  const query = req.query.song;
  const url =
    'https://api.deezer.com/search?q="' + query + '"&limit=10&output=json';

  try {
    const resp = await axios(url);
    const data = resp.data;
    const songs = data.data.map((item) => ({
      title: item.title,
      songFile: item.preview,
      image: item.album.cover_medium,
      bigImage: item.album.cover_big,
      artistImage: item.artist.picture_medium,
      artistName: item.artist.name,
      albumName: item.album.title,
    }));
    res.send(songs);
  } catch (e) {
    console.log(e);
    throw new Error("Could not fetch songs!");
  }
});

module.exports = router;
