const Campaign = require("../models/Campaigns");
const Validator = require("validatorjs");
const UUId = require("uuid");
const Scan = require("../models/Scans");
const geoip = require("geoip-lite");
const DeviceDetector = require("node-device-detector");
const { request } = require("express");
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

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
      campaign = await Campaign.findOne({
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

    let url = campaign?.web?.url;
    if (!url) {
      return res.status(400).json({ message: "Campaign not have web url" });
    }
    // generate UUId
    let qrcode_endpoint = process.env.QRCODE_ENDPOINT;
    let qrcode_url = `${qrcode_endpoint}/${campaign.id}`;
    return res.status(200).json({ url: qrcode_url });
  }

  async redirectToCampaign(req, res) {
    let id = req.params.id;
    let uuid = UUId.v4();
    request.uuid = uuid;
    let campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (campaign.status !== "active") {
      return res.status(400).json({ message: "Campaign is not active" });
    }
    // check if user agent is mobile or web
    const result = detector.detect(req.headers["user-agent"]);
    request.user_agent = result;
    let mobile = await this.detectMob(result.device.type);

    // save info of qrcode scanned
    await this.SaveInfoOfQrcodeScannded(req, campaign);

    // redirect to campaign
    if (!mobile) {
      let app_name = process.env.SERVICE_NAME;
      let url = `${campaign.web.url}?uuid=${uuid}&app_name=${app_name}`;
      return res.redirect(url);
    } else {
      // Send HTML with script to redirect to the app
      let appDeepLink = `${campaign.mobile.deeplink}?uuid=${uuid}`;

      let html = `
         <!DOCTYPE html>
         <html>
         <head>
             <title>Redirecting...</title>
             <script type="text/javascript">
                 function redirectToApp() {
                     var appLink = "${appDeepLink}";
                     window.location.href = appLink;
                 }
                 window.onload = redirectToApp;
             </script>
         </head>
         <body>
             <p>Redirecting to the app...</p>
         </body>
         </html>
     `;
      return res.send(html);
    }
  }

  async SaveInfoOfQrcodeScannded(req, campaign) {
    let uuid = req.uuid;
    let date = new Date();
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    let location = geo ?? {};
    console.log(location);
    let device = req.user_agent.device?.type;
    let operatingSystem = req.user_agent.os?.name;
    let scan = new Scan({
      campaignId: campaign.id,
      uuid: uuid,
      scannedAt: date,
      ip: ip,
      location: location,
      operatingSystem: operatingSystem || "Unknown",
      device: device || "Unknown",
    });

    await scan.save();
  }

  async detectMob(device) {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
      /SymbianOS/i,
      /Opera Mini/i,
      /Smartphone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return device.match(toMatchItem);
    });
  }
}

module.exports = QrCodeController;
