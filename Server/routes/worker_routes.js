var express = require('express');
var guard = require('express-jwt-permissions')();
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        message1: "This is message 1",
        message2: "This is message 2"
    })
})

module.exports = router;