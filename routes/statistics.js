const express = require("express");
const router = express.Router();
const StatisticsController = require("../controllers/StatisticsController");

const statisticsController = new StatisticsController();


router.get("/compaign/:id", async (req, res) => statisticsController.getCompaignStatistics(req, res));


module.exports = router;
