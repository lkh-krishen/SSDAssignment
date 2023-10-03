const mongoose = require('mongoose');
const Message = require('../models/message');
var express = require('express');
var router = express.Router();

router.post('/send', async function (req, res) {
    const message = new Message(req.body);
    message.save().then((data) => {
        res.status(201).json(data)
    })
})

module.exports = router;