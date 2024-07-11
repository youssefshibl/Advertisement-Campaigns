const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  web: {
    type: {
      url: {
        type: String,
      },
    },
  },
  mobile: {
    type: {
      deeplink: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
