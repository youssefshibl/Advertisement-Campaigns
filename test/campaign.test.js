const request = require("supertest");
const { app, startServer, stopServer } = require("../app");
const Campaign = require("../models/Campaigns");
const Scan = require("../models/Scans");
const Conversion = require("../models/Conversions");

beforeAll(async () => {
  await startServer(true);
});

afterAll(async () => {
  await Campaign.deleteMany({});
  await Scan.deleteMany({});
  await Conversion.deleteMany({});
  await stopServer();
});

let base_path = process.env.SERVICE_BASE_PATH || "/api/v1";

describe("Test the conversions routes", () => {
  let token = null;
  test("Login with valid credentials", async () => {
    let credentials = {
      email: "youssef@gmail.com",
      password: "123456",
    };
    const response = await request(app)
      .post(base_path + "/auth/login")
      .send(credentials);

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  let data = {
    name: "My Campaign1",
    description: "This is a description of my campaign.",
    status: "active",
    startDate: "2022-01-01 00:00:00",
    endDate: "2022-12-31 00:00:00",
    budget: 1000,
    web: {
      url: "https://www.facebook.com/youssefshebl159/",
    },
    mobile: {
      deeplink: "twitter://user?screen_name=youssefshebl159",
    },
  };

  let id;
  test("Create a new campaign", async () => {
    const response = await request(app)
      .post(base_path + "/campaigns/create")
      .send(data)
      .set("Authorization", "Bearer " + token);

    try {
      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(data.name);
      expect(response.body.description).toBe(data.description);
      expect(response.body.status).toBe(data.status);
      expect(response.body.startDate).toBe(
        new Date(data.startDate).toISOString()
      );
      expect(response.body.endDate).toBe(new Date(data.endDate).toISOString());
      expect(response.body.budget).toBe(data.budget);
      expect(response.body.web.url).toBe(data.web.url);
      expect(response.body.mobile.deeplink).toBe(data.mobile.deeplink);
      id = response.body._id;
    } catch (error) {
      console.log(response.body);
      throw error;
    }
  });

  test("Get created campaign", async () => {
    const response = await request(app)
      .get(base_path + "/campaigns/" + id)
      .set("Authorization", "Bearer " + token);

    try {
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(data.name);
      expect(response.body.description).toBe(data.description);
      expect(response.body.status).toBe(data.status);
      expect(response.body.startDate).toBe(
        new Date(data.startDate).toISOString()
      );
      expect(response.body.endDate).toBe(new Date(data.endDate).toISOString());
      expect(response.body.budget).toBe(data.budget);
      expect(response.body.web.url).toBe(data.web.url);
      expect(response.body.mobile.deeplink).toBe(data.mobile.deeplink);
    } catch (error) {
      console.log(response.body);
      throw error;
    }
  });

  test("Get all compaigns and check if created campaign is in the list", async () => {
    const response = await request(app)
      .get(base_path + "/campaigns")
      .set("Authorization", "Bearer " + token);

    try {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      let campaign = response.body.find((c) => c._id == id);
      expect(campaign).toBeDefined();
    } catch (error) {
      console.log(response.body);
      throw error;
    }
  });

  test("Update the created campaign", async () => {
    let newData = {
      name: "My Campaign1 Updated",
      description: "This is a description of my campaign. Updated",
      status: "inactive",
      startDate: "2022-01-01 00:00:00",
      endDate: "2022-12-31 00:00:00",
      budget: 2000,
      web: {
        url: "https://www.facebook.com/youssefshebl159/",
      },
      mobile: {
        deeplink: "twitter://user?screen_name=youssefshebl159",
      },
    };

    const response = await request(app)
      .put(base_path + "/campaigns/" + id)
      .send(newData)
      .set("Authorization", "Bearer " + token);

    try {
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(newData.name);
      expect(response.body.description).toBe(newData.description);
      expect(response.body.status).toBe(newData.status);
      expect(response.body.startDate).toBe(
        new Date(newData.startDate).toISOString()
      );
      expect(response.body.endDate).toBe(
        new Date(newData.endDate).toISOString()
      );
      expect(response.body.budget).toBe(newData.budget);
      expect(response.body.web.url).toBe(newData.web.url);
      expect(response.body.mobile.deeplink).toBe(newData.mobile.deeplink);
    } catch (error) {
      console.log(response.body);
      throw error;
    }
  });

  test("Delete a campaign", async () => {
    const response = await request(app)
      .delete(base_path + "/campaigns/" + id)
      .set("Authorization", "Bearer " + token);

    try {
      expect(response.statusCode).toBe(204);
    } catch (error) {
      console.log(response.body);
      throw error;
    }
  });
});
