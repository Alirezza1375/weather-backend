import { afterEach, beforeEach, expect } from "@jest/globals";
import { fetchWeather } from "./weather.service.js";
import { jest } from "@jest/globals";
import { AppError } from "../../utils/AppError.js";
import app from "../../app.js";
import request from "supertest";

describe("fetchWeather", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns normalize weather data", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: 52.52, lon: 13.41, country: "DE" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cod: 200,
          base: "stations",
          id: 2950159,
          timezone: 3600,
          name: "Berlin",
          coord: { lon: 13.41, lat: 52.52 },
          dt: 1700000000,
          visibility: 10000,
          main: {
            temp: 20,
            feels_like: 19,
            temp_min: 18,
            temp_max: 22,
            pressure: 1012,
            humidity: 60,
          },
          wind: { speed: 3.4, deg: 180 },
          clouds: { all: 20 },
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "clear sky",
              icon: "01d",
            },
          ],
          sys: {
            country: "DE",
            sunrise: 1700000000,
            sunset: 1700040000,
            type: 2,
            id: 2037,
          },
        }),
      });
    const result = await fetchWeather("berlin");

    expect(result.location.city).toBe("berlin");
    expect(result.current.temperature.current).toBe(20);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("thorws AppError when geoRes response is not ok", async () => {
    fetch
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, json: () => [] });

    await expect(fetchWeather()).rejects.toThrow(AppError);
  });

  test("throws AppError when city is not found", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => [],
      })
      .mockResolvedValueOnce({ ok: true, json: () => [] });

    await expect(fetchWeather()).rejects.toThrow(AppError);
  });

  test("returns 400 for invalid city", async () => {
    const response = await request(app).get("/api/weather/1");

    expect(response.status).toBe(400);
  });

  test("throws AppError when city is invalid (name less than 2)", async () => {
    await expect(fetchWeather("a")).rejects.toThrow(AppError);
  });

  test("throws AppError when city is invalid (number as city)", async () => {
    await expect(fetchWeather(1)).rejects.toThrow(AppError);
  });
});
