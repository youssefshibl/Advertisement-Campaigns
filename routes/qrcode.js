const express = require("express");
const router = express.Router();
const QRCodeController = require("../controllers/QrCodeController");
const qrCodeController = new QRCodeController();



router.post("/generate", async (req, res) => qrCodeController.generateQrCode(req, res));
router.get("/redirection/:id", async (req, res) => qrCodeController.redirectToCampaign(req, res));

module.exports = router;