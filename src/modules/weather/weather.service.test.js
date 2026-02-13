import { fetchWeather } from "./weather.service.js";
import { AppError } from "../../utils/AppError.js";

describe("fetchWeather", () => {
  test("returns weather data when city is provided", async () => {
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
});
