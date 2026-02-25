import request from "supertest";
import { jest } from "@jest/globals";

// MUST mock BEFORE importing app
jest.unstable_mockModule("./weather.service.js", () => ({
  fetchWeather: jest.fn(),
}));

const { fetchWeather } = await import("./weather.service.js");
const { default: app } = await import("../../app.js");

describe("GET /api/weather/:city", () => {
  test("returns 200 and formatted response", async () => {
    fetchWeather.mockResolvedValue({
      location: { city: "berlin" },
      temperature: 10,
    });

    const response = await request(app).get("/api/weather/berlin");

    expect(response.status).toBe(200);

    // we test what the route returns
    expect(response.body).toEqual({
      location: { city: "berlin" },
      temperature: 10,
    });

    // ensure service was called correctly
    expect(fetchWeather).toHaveBeenCalledWith("berlin");
  });
});
