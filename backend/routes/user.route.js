var express = require("express");
var router = express.Router();
var userService = require("../services/user.service");

router.post("/create", async (req, res) => {
  try {
    const data = await userService.createUser(req.body);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/get/:email", async (req, res) => {
  try {
    const data = await userService.getUser(req.params.email);
    if (data.user == null) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
