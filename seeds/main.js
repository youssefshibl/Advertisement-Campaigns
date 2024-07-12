const { faker } = require("@faker-js/faker");
const Campaign = require("../models/Campaigns");
const Scan = require("../models/Scans");
const Conversion = require("../models/Conversions");
const mongoose = require("mongoose");
const path = require("path");
let env_path = path.resolve("./") + "/.env";
require("dotenv").config({ path: env_path });

let mongoHost = process.env.MONGO_DB_HOST || "localhost";
let mongoPort = process.env.MONGO_DB_PORT || "27017";
let mongoDbName = process.env.MONGO_DB_NAME || "campaigns";
let mongoUser = encodeURIComponent(process.env.MONGO_DB_USER) || "";
let mongoPass = encodeURIComponent(process.env.MONGO_DB_PASS) || "";

let deeplink = "twitter://user?screen_name=youssefshebl159";
let webUrl = "https://twitter.com/youssefshebl159";

let NumberOfCampaigns = 2;
let NumberOfScansForCampaign = 300;
let NumberOfConversionsForEveryScanSession = 3;
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

async function main() {
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
      let location = generateLocation();
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
        "Smartphone",
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
        // delay for 30 ms
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }
  }

  mongoose.connection.close();
  console.log("Seeding completed successfully!");
  process.exit(0);
}


function generateLocation() {
  const latitude = faker.location.latitude();
  const longitude = faker.location.longitude();

  const location = {
    range: [
      faker.number.int({ min: 1000000000, max: 4294967295 }), // Example range start
      faker.number.int({ min: 1000000000, max: 4294967295 }), // Example range end
    ],
    country: faker.location.countryCode(),
    region: faker.location.state({ abbreviated: true }),
    eu: faker.datatype.boolean() ? '1' : '0',
    timezone: faker.location.timeZone(),
    city: faker.location.city(),
    ll: [parseFloat(latitude), parseFloat(longitude)],
    metro: faker.number.int({ min: 1, max: 1000 }), // Example metro code
    area: faker.number.int({ min: 500, max: 10000 }), // Example area size
  };

  // Ensure the range is in order
  if (location.range[0] > location.range[1]) {
    [location.range[0], location.range[1]] = [location.range[1], location.range[0]];
  }

  return location;
}

let connectionString = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}?authSource=admin`;

console.log(connectionString);

mongoose
  .connect(connectionString)
  .then(async () => {
    try {
      await main();
    } catch (err) {
      console.log(err);
      // flush the database
      Campaign.deleteMany({});
      Scan.deleteMany({});
      Conversion.deleteMany({});
      mongoose.connection.close();
      console.log("Cleaned all data");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log(err);
  });


