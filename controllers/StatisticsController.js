const Campaign = require("../models/Campaigns");
const Scan = require("../models/Scans");


class StatisticsController {
    static instance = null;

    constructor() {
        if (StatisticsController.instance) {
            return StatisticsController.instance;
        }
        StatisticsController.instance = this;
    }

    async getCompaignStatistics(req, res) {
        // res.send("Hello from getCompaignStatistics");
        // return;
        let campaignId = req.params.id;
        // i want get statistics for this campaign for every key in schema
        let campaign = await Campaign
            .findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        let scans = await campaign.getScans();


        let statistics = {
            total: scans.length,
            location: {},
            operatingSystem: {},
            device: {},
        };
        // get statistics for location
        scans.forEach(scan => {
            let location = scan.location ?? { country: "unknown" };
            if (!statistics.location[location.country]) {
                statistics.location[location.country] = 0;
            }
            statistics.location[location.country]++;
        });

        // get statistics for operating system
        scans.forEach(scan => {
            let operatingSystem = scan.operatingSystem ?? "unknown";
            if (!statistics.operatingSystem[operatingSystem]) {
                statistics.operatingSystem[operatingSystem] = 0;
            }
            statistics.operatingSystem[operatingSystem]++;
        });

        // get statistics for device
        scans.forEach(scan => {
            let device = scan.device ?? "unknown";
            if (!statistics.device[device]) {
                statistics.device[device] = 0;
            }
            statistics.device[device]++;
        });

        // return statistics
        return res.status(200).json(statistics);

    }
}



module.exports = StatisticsController;