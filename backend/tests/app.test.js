const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  jest.setTimeout(60000);
  // Use a completely isolated, clean MongoMemoryServer for this test suite
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("ServiceHub Backend Integration Tests", () => {
  let userToken = "";

  it("should successfully register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "password123",
        phone: "+91 99999 88888",
        role: "customer"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toEqual("testuser@test.com");
    userToken = res.body.token;
  });

  it("should fail to register user with existing email", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User 2",
        email: "testuser@test.com",
        password: "password123",
        role: "customer"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should get user profile using token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toEqual("testuser@test.com");
  });

  it("should return loyalty wallet balance for the registered customer", async () => {
    const res = await request(app)
      .get("/api/wallet/my")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("balance");
  });

  it("should perform server-side geocoding for Delhi", async () => {
    const res = await request(app)
      .get("/api/geocode")
      .query({ address: "New Delhi" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("lat");
    expect(res.body).toHaveProperty("lng");
  });
});
