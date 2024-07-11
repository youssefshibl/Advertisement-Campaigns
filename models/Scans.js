const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    },
    scannedAt: {
        type: Date,
        default: Date.now,
    },
    ip: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    operatingSystem: {
        type: String,
    },
    device: {
        type: String,
    },
});


module.exports = mongoose.model("Scan", ScanSchema);