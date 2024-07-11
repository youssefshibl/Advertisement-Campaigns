const express = require("express");
const router = express.Router();

const ConversionController = require("../controllers/ConversionsController");
const conversionController = new ConversionController();

router.post("/push", async (req, res) =>
  conversionController.createConversion(req, res)
);

module.exports = router;
