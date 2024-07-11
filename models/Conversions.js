const mongoose = require("mongoose");

const ConversionSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversion", ConversionSchema);
