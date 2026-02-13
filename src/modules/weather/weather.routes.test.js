import request from "supertest";
import app from "../../app.js";
import { expect } from "@jest/globals";

describe("GET /api/weather/:city", () => {
  test("returns 200 and weather data", async () => {
    const response = await request(app).get("/api/weather/berlin");

    expect(response.status).toBe(200);
    expect(response.body.city).toBe("berlin");
  });
});
