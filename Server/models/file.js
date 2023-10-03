const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: false,
  },
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
