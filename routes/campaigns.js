const express = require("express");
const router = express.Router();
const CampaignsController = require("../controllers/CampaignsController");
const campaignsController = new CampaignsController();
const auth_middle_ware = require("../middleware/auth");

// make crud for campaigns
router.post("/create", auth_middle_ware, campaignsController.createCampaign);
router.get("/:id", campaignsController.getCampaign);
router.put("/:id", auth_middle_ware, campaignsController.updateCampaign);
router.delete("/:id", auth_middle_ware, campaignsController.deleteCampaign);
router.get("/", campaignsController.getCampaigns);

module.exports = router;
