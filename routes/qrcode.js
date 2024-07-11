const express = require("express");
const router = express.Router();
const QRCodeController = require("../controllers/QrCodeController");
const qrCodeController = new QRCodeController();



router.post("/generate",qrCodeController.generateQrCode);

module.exports = router;