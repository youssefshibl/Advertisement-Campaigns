const { faker } = require("@faker-js/faker");
const Campaign = require("../models/Campaigns");
const Scan = require("../models/Scans");
const Conversion = require("../models/Conversions");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

let mongoHost = process.env.MONGO_DB_HOST || "localhost";
let mongoPort = process.env.MONGO_DB_PORT || "27017";
let mongoDbName = process.env.MONGO_DB_NAME || "campaigns";
let mongoUser = encodeURIComponent(process.env.MONGO_DB_USER) || "";
let mongoPass = encodeURIComponent(process.env.MONGO_DB_PASS) || "";

let deeplink = "twitter://user?screen_name=youssefshebl159";
let webUrl = "https://twitter.com/youssefshebl159";

let NumberOfCampaigns = 10;
let NumberOfScansForCampaign = 10;
let NumberOfConversionsForEveryScanSession = 5;
let ConversionsEvents = [
  "click about",
  "click contact",
  "click services",
  "click home",
  "typeing in search bar",
  "click on search button",
  "click on search result",
  "click on contact form",
  "click on submit button",
  "click on services",
  "set location",
  "click on location",
  "click on map",
  "click on directions",
  "make a purchase",
  "click on checkout",
  "click on add to cart",
  "click on product",
  "click on category",
  "click on logourl",
];

function main() {
  Campaign.deleteMany({});
  Scan.deleteMany({});
  Conversion.deleteMany({});
  for (let i = 0; i < NumberOfCampaigns; i++) {
    let name = faker.company.name();
    let description = faker.lorem.sentence();
    let status = faker.helpers.arrayElement(["active", "inactive"]);
    let startDate = faker.date.recent();
    let endDate = faker.date.future();
    let budget = faker.helpers.arrayElement([1000, 2000, 3000, 4000, 5000]);
    let web = {
      url: webUrl,
    };
    let mobile = {
      deeplink: deeplink,
    };
    let campaign = new Campaign({
      name,
      description,
      status,
      startDate,
      endDate,
      budget,
      web,
      mobile,
    });
    campaign.save();
    console.log(i + " Campaign created successfully! with name: ", name);

    for (let j = 0; j < NumberOfScansForCampaign; j++) {
      let uuid = faker.string.uuid();
      let date = faker.date.recent();
      let ip = faker.internet.ip();
      let location = faker.location.city();
      let operatingSystem = faker.helpers.arrayElement([
        "Windows",
        "Linux",
        "Mac",
        "Android",
        "iOS",
      ]);
      let device = faker.helpers.arrayElement([
        "Desktop",
        "Laptop",
        "Tablet",
        "Mobile",
        "smartphone",
        "iPhone",
        "iPad",
      ]);
      let scan = new Scan({
        campaignId: campaign.id,
        uuid,
        scannedAt: date,
        ip,
        location,
        operatingSystem,
        device,
      });
      scan.save();
      console.log("    " + j + " Scan created successfully! with uuid: ", uuid);

      let events = [];
      events.push("scan");
      for (let k = 0; k < NumberOfConversionsForEveryScanSession; k++) {
        events.push(faker.helpers.arrayElement(ConversionsEvents));
      }
      events.push("exit");

      for (let k = 0; k < events.length; k++) {
        let conversion = new Conversion({
          uuid,
          event: events[k],
        });
        conversion.save();
        console.log(
          "            " + k + " Conversion created successfully! with event: ",
          events[k]
        );
      }
    }
  }

  mongoose.connection.close();
  console.log("Seeding completed successfully!");
  process.exit(0);
}

let connectionString = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}?authSource=admin`;

console.log(connectionString);

mongoose
  .connect(connectionString)
  .then(() => {
    try {
      main();
    } catch (err) {
      console.log(err);
      // flush the database
      Campaign.deleteMany({});
      Scan.deleteMany({});
      Conversion.deleteMany({});
      mongoose.connection.close();
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log(err);
  });
