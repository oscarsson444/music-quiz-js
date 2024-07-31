var express = require("express");
var matchService = require("../services/match.service");
var router = express.Router();

/*
 * Create a match
 */
router.post("/create", async (req, res) => {
  try {
    const data = await matchService.createMatch(req);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/join", async (req, res) => {
  try {
    const data = await matchService.joinMatch(req);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    res.status(200).json(await matchService.removeMatch(req.params.id));
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
    throw e;
  }
});

router.post("/songs", async (req, res) => {
  try {
    const data = await matchService.selectSongs(req);
    res.status(201).json(data);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
    throw e;
  }
});

module.exports = router;
