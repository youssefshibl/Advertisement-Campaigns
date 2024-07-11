const Campaign = require("../models/Campaigns");
let Validator = require("validatorjs");
const UUId = require("uuid");
const Scan = require("../models/Scans");


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

    async redirectToCampaign(req, res) {
        let id = req.params.id;
        let uuid = req.params.uuid;
        let campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        if (campaign.status !== "active") {
            return res.status(400).json({ message: "Campaign is not active" });
        }
        let platform = campaign.platform;
        await this.SaveInfoOfQrcodeScannded(req, campaign);
        if (platform === "web") {
            let app_name = process.env.SERVICE_NAME;
            let url = `${campaign.web.url}?uuid=${uuid}&app_name=${app_name}`;
            return res.redirect(url);
        }
    }

    async SaveInfoOfQrcodeScannded(req, campaign) {

        let uuid = req.params.uuid;
        let date = new Date();
        let ip = req.ip;
        let location = req.headers["cf-ipcountry"] ?? "unknown";
        let operationSystem = req.headers["user-agent"];
        let device = req.headers["user-agent"];
        let scan = new Scan({
            campaignId: campaign.id,
            uuid: uuid,
            scannedAt: date,
            ip: ip,
            location: location,
            operatingSystem: operationSystem,
            device: device,
        });

        await scan.save();
    }

}





module.exports = QrCodeController

