const Conversion = require("../models/Conversions");
let Validator = require("validatorjs");

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

    let conversion = new Conversion({
      uuid,
      event,
    });

    await conversion.save();

    return res.status(201).send("");
  }
}

module.exports = ConversionsController;
