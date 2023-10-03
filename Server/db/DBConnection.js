const mongoose = require("mongoose");
require("dotenv").config();

const DBConnection = () => {
    mongoose
        .connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Database connected");
        });
};

module.exports = DBConnection;