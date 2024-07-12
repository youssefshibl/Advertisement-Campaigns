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
let connectionString = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}?authSource=admin`;

mongoose
  .connect(connectionString)
  .then(() => {
    try {
      Campaign.deleteMany({});
      Scan.deleteMany({});
      Conversion.deleteMany({});
      mongoose.connection.close();
      console.log("Cleaned all data");
      process.exit(0);
    } catch (err) {
      console.log(err);
      mongoose.connection.close();
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log(err);
  });
