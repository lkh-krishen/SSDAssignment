const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    messageContent: {
        type: String,
        required: true,
    },
    savedBy: [{
        type: String,
        required: false
    }]
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
