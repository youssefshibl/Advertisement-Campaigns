const express = require("express");
const router = express.Router();
const StatisticsController = require("../controllers/StatisticsController");
let auth = require("../middleware/auth");

const statisticsController = new StatisticsController();

router.get("/compaign/:id", auth, async (req, res) =>
  statisticsController.getCompaignStatistics(req, res)
);

module.exports = router;
