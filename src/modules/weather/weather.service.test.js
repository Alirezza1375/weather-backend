// fetchWeather
import { AppError } from "../../utils/AppError.js";
import { expect } from "@jest/globals";
import { fetchWeather } from "./weather.service.js";
import request from "supertest";
import app from "../../app.js";

describe("fetchWeather", () => {
  test("returns weatehr data when city is provided", async () => {
    const result = await fetchWeather("berlin");

    expect(result).toEqual({
      city: "berlin",
      temperature: 20,
      condition: "Sunny",
    });
  });

  test("weather data contains temperature", async () => {
    const result = await fetchWeather("berlin");
    expect(result).toHaveProperty("temperature");
  });

  test("weather data contains condition", async () => {
    const result = await fetchWeather("berlin");
    expect(result).toHaveProperty("condition");
  });

  test("throws AppError when city is missing", async () => {
    await expect(fetchWeather()).rejects.toThrow(AppError);
  });

  test("returns 400 when city is empty", async () => {
    const response = await request(app).get("/api/weather/");

    expect(response.status).toBe(404);
  });
});
