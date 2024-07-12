const mongoose = require("mongoose");
const Scan = require("../models/Scans");


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


// thre are other schemas with name Scans have compaignId as a reference how make function that can access 
// all scans make this function a method on the CampaignSchema

CampaignSchema.methods.getScans = async function () {
  return Scan.find({ campaignId: this._id });
}

module.exports = mongoose.model("Campaign", CampaignSchema);
