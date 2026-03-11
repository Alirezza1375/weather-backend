import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { normalizeWeatherData } from "../../utils/normalizeWeatherData.js";
import { getCache, setCache, deleteCache } from "../../utils/cache.js";

export const fetchWeather = async (city) => {
  if (!city || city.length < 2) {
    throw new AppError("City is required", 400);
  }
  if (typeof city !== "string") {
    throw new AppError("Invalid city", 400);
  }

  const normalizedCity = city.toLowerCase();

  const cachedEntry = getCache(normalizedCity);

  if (cachedEntry) {
    const CACHED_TTL = 5 * 60 * 1000;
    const isExpired = Date.now() - cachedEntry.timestamp > CACHED_TTL;

    if (!isExpired) {
      console.log("Serving from cache");
      return cachedEntry.data;
    }
    deleteCache(normalizedCity);
  }

  const API_KEY = env.OPENWEATHER_API_KEY;
  const geoApi = `http://api.openweathermap.org/geo/1.0/direct?q=${normalizedCity}&limit=1&appid=${API_KEY}`;

  const geoRes = await fetch(geoApi);

  if (!geoRes.ok) {
    throw new AppError("faild to fetch location data", 500);
  }
  const geoData = await geoRes.json();

  if (!geoData.length) {
    throw new AppError("City not found", 500);
  }

  const { lat, lon, country } = geoData[0];

  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const weatherRes = await fetch(weatherApi);

  if (!weatherRes.ok) {
    throw new AppError("faild to fetch weather data", 500);
  }

  const weatherRawData = await weatherRes.json();

  const weatherData = normalizeWeatherData(weatherRawData, city, country);

  setCache(normalizedCity, {
    data: weatherData,
    timestamp: Date.now(),
  });

  return weatherData;
};
// geoAPI => http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// current weatherAPI => https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
