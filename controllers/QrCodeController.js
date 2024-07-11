const Campaign = require("../models/Campaigns");
let Validator = require("validatorjs");
const UUId = require("uuid");


// make new object for generating QR code applay singleton pattern



class QrCodeController {
    static instance = null;

    constructor() {
        if (QrCodeController.instance) {
            return QrCodeController.instance;
        }
        QrCodeController.instance = this;
    }

    async generateQrCode(req, res) {

        let data = req.body;
        // check if data have name or id
        if (!data.name && !data.id) {
            return res.status(400).json({ message: "Name or id is required" });
        }
        let campaign;
        if (data.name) {
            campaign = await Campaign.findOne
                ({
                    name: data.name,
                });
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
        }
        if (data.id) {
            campaign = await Campaign.findById(data.id);
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
        }
        // check if campaign is active
        if (campaign.status !== "active") {
            return res.status(400).json({ message: "Campaign is not active" });
        }

        // generate QR code
        // fist check platform

        let platform = campaign.platform;
        if (platform === "web") {
            let url = campaign.web.url;
            // generate UUId
            let uuid = UUId.v4();
            let qrcode_endpoint = process.env.QRCODE_ENDPOINT;
            let qrcode_url = `${qrcode_endpoint}/${campaign.id}/${uuid}`;
            return res.status(200).json({ url: qrcode_url });

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
            let message = error.message;
            return res.status(500).json({ message: message });
        }
    }
}





module.exports = QrCodeController;