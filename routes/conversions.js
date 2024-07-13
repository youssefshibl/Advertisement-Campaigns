const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth");

const ConversionController = require("../controllers/ConversionsController");
const conversionController = new ConversionController();

router.post("/push", async (req, res) =>
  conversionController.createConversion(req, res)
);

router.get("/list/:uuid", auth, async (req, res) =>
  conversionController.getConversion(req, res)
);

module.exports = router;
