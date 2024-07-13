const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const app = express();
const accessLogStream = require("./helpers/logs");
const mongoose = require("mongoose");
const { getRedisClient } = require("./helpers/redis");
let redisClient = null;

// load routes
const campaigns = require("./routes/campaigns");
const auth = require("./routes/auth");
const qrCode = require("./routes/qrcode");
const conversions = require("./routes/conversions");
const statics = require("./routes/statistics");

// ----------- middleware ------------
const corsOption = {
  origin: "*",
};
app.use(cors(corsOption));

// Setup the logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: accessLogStream }));
}

// set body parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// ----------- routes ------------
let base = process.env.SERVICE_BASE_PATH || "/api/v1";

app.use(`${base}/campaigns`, campaigns);
app.use(`${base}/auth`, auth);
app.use(`${base}/qrcode`, qrCode);
app.use(`${base}/conversions`, conversions);
app.use(`${base}/statistics`, statics);

app.get("/test", (req, res) => {
  res.send("Hello World");
});

// ----------- start server ------------
async function startServer() {
  let mongoHost = process.env.MONGO_DB_HOST || "localhost";
  let mongoPort = process.env.MONGO_DB_PORT || "27017";
  let mongoDbName = process.env.MONGO_DB_NAME || "campaigns";
  let mongoUser = encodeURIComponent(process.env.MONGO_DB_USER) || "";
  let mongoPass = encodeURIComponent(process.env.MONGO_DB_PASS) || "";

  let connectionString = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}?authSource=admin`;

  if (process.env.NODE_ENV != "test") {
    console.log(connectionString);
  }

  mongoose
    .connect(connectionString)
    .then(async () => {
      if (process.env.NODE_ENV != "test") {
        console.log("MongoDB connected");
      }
      redisClient = await getRedisClient();
      if (process.env.NODE_ENV != "test") {
        console.log("Redis connected");
        app.listen(process.env.SERVICE_PORT, process.env.SERVICE_HOST, () => {
          console.log(
            `Server running at http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/`
          );
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  if (process.env.NODE_ENV == "test") {
    while (!redisClient) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

async function stopServer() {
  await mongoose.connection.close();
  if (redisClient) {
    await redisClient.quit();
  }
}

if (process.env.NODE_ENV != "test") {
  startServer();
}

module.exports = { app, startServer, stopServer };
