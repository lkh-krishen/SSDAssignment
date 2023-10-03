const mongoose = require("mongoose");
const Message = require("../models/message");
var express = require("express");
var router = express.Router();

router.get("/", async function (req, res) {
  const allMessages = await Message.find();
  res.status(200).json({ messages: allMessages });
});

router.patch("/save/:id", async function (req, res) {

  Message.updateOne(
    { _id: req.params.id },
    { $push: { savedBy: req.body.userEmail } }
  ).then((data) => res.status(200).json(data));
});

router.patch("/unsave/:id", async function (req, res) {
  let messageToUpdate = await Message.findOne({ _id: req.params.id });
  const newSavedByList = messageToUpdate.savedBy.filter((email) => email !== req.body.userEmail);

  Message.updateOne(
    { _id: req.params.id },
    { $set: { savedBy: newSavedByList } }
  ).then((data) => res.status(200).json(data));
});

module.exports = router;
