const Conversion = require("../models/Conversions");
let Validator = require("validatorjs");
let Scan = require("../models/Scans");
const { getRedisClient } = require("../helpers/redis");


class ConversionsController {
  static instance = null;

  constructor() {
    if (ConversionsController.instance) {
      return ConversionsController.instance;
    }
    ConversionsController.instance = this;
  }

  async createConversion(req, res) {
    let data = req.body;
    let uuid = data.uuid;
    let event = data.event;

    let rules = {
      uuid: "required|string",
      event: "required|string",
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
      return res.status(400).json(validation.errors.all());
    }

    // check if this uuid is exist

    let conversionExist = await Scan.findOne({ uuid: uuid });
    if (!conversionExist) {
      return res.status(404).json({ message: "Not found" })
    }

    // get header for auth x-api-key
    let apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // check token from redis
    let redisClient = await getRedisClient();
    let key = `user:${uuid}`;
    let token = await redisClient.hGet(key, "token");
    if (!token || token !== apiKey) {
      return res.status(401).json({ message: "Unauthorized" })
    }


    let conversion = new Conversion({
      uuid,
      event,
    });

    await conversion.save();

    return res.status(201).send("");
  }
}

module.exports = ConversionsController;
