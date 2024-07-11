const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
const accessLogStream = require("./helpers/logs");
const mongoose = require("mongoose");

// load routes
const campaigns = require("./routes/campaigns");
const auth = require("./routes/auth");
const qrCode = require("./routes/qrcode");



// ----------- middleware ------------

// Setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// set body parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// ----------- routes ------------
let base = process.env.SERVICE_BASE_PATH || "/api/v1";

app.use(`${base}/campaigns`, campaigns);
app.use(`${base}/auth`, auth);
app.use(`${base}/qrcode`, qrCode);






// ----------- start server ------------
let mongoHost = process.env.MONGO_DB_HOST || "localhost";
let mongoPort = process.env.MONGO_DB_PORT || "27017";
let mongoDbName = process.env.MONGO_DB_NAME || "campaigns";
let mongoUser = encodeURIComponent(process.env.MONGO_DB_USER) || "";
let mongoPass = encodeURIComponent(process.env.MONGO_DB_PASS) || "";


mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}?authSource=admin`).then(() => {
  app.listen(process.env.SERVICE_PORT, process.env.SERVICE_HOST, () => {
    console.log(`Server running at http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/`);
  });
}).catch((err) => {
  console.log(err);
});

