const Campaign = require("../models/Campaigns");
let Validator = require("validatorjs");

class CampaignsController {
  static instance = null;

  constructor() {
    if (CampaignsController.instance) {
      return CampaignsController.instance;
    }
    CampaignsController.instance = this;
  }

  async createCampaign(req, res) {
    let data = req.body;
    let rules = {
      name: "required",
      description: "required|string",
      status: "required|in:active,inactive",
      startDate: "required|date",
      endDate: "required|date",
      budget: "required|numeric",
      platform: "required|in:app,web",
      "web.url": "required_if:platform,web|url",
    };
    let validation = new Validator(data, rules);
    if (validation.fails()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.errors.all(),
      });
    }
    // check if campaign with the same name exists
    let campaignExists = await Campaign.findOne({
      name: data.name,
    });
    if (campaignExists) {
      return res.status(400).json({
        message: "Campaign with the same name already exists",
      });
    }

    try {
      let campaign = new Campaign(data);
      await campaign.save();
      return res.status(201).json(campaign);
    } catch (error) {
      let message = error.message;
      return res.status(500).json({ message: message });
    }
  }

  async getCampaign(req, res) {
    // get campaign

    let id = req.params.id;
    try {
      let campaign = await Campaign.findById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.status(200).json(campaign);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateCampaign(req, res) {
    // check only the fields that are sent in the request are updated
    // update campaign
    let id = req.params.id;
    let data = req.body;
    let rules = {
      name: "string",
      description: "string",
      status: "in:active,inactive",
      startDate: "date",
      endDate: "date",
      budget: "numeric",
      platform: "in:app,web",
      "web.url": "url",
    };
    let validation = new Validator(data, rules);
    if (validation.fails()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.errors.all(),
      });
    }
    try {
      let campaign = await Campaign.findByIdAndUpdate(id, data, { new: true });
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.status(200).json(campaign);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteCampaign(req, res) {
    // delete campaign
    let id = req.params.id;
    try {
      let campaign = await Campaign.findByIdAndDelete(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCampaigns(req, res) {
    try {
      let campaigns = await Campaign.find();
      return res.status(200).json(campaigns);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = CampaignsController;
