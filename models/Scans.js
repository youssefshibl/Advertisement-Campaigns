const mongoose = require("mongoose");


const locationSchema = new mongoose.Schema({
    range: {
        type: [Number],
    },
    country: {
        type: String,
    },
    region: {
        type: String,
    },
    eu: {
        type: String,
    },
    timezone: {
        type: String,
    },
    city: {
        type: String,
    },
    ll: {
        type: [Number],
    },
    metro: {
        type: Number,
    },
    area: {
        type: Number,
    }
});



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
    location: locationSchema,
    operatingSystem: {
        type: String,
    },
    device: {
        type: String,
    },
});


module.exports = mongoose.model("Scan", ScanSchema);