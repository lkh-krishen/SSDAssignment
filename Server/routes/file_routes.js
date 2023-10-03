const mongoose = require("mongoose");
const File = require("../models/file");
var express = require("express");
var router = express.Router();

router.post("/add", async function (req, res) {
  const file = new File(req.body);
  file.save().then((data) => {
    res.status(201).json(data);
  });
});

router.get("/", async function (req, res) {
  const allFiles = await File.find();
  res.status(200).json({ files: allFiles });
});

module.exports = router;
