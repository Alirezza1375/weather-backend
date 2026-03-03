import { AppError } from "../../utils/AppError.js";
import { normalizeWeatherData } from "../../utils/normalizeWeatherData.js";

// In-memory cache

const weatherCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export const fetchWeather = async (city) => {
  if (!city) {
    throw new AppError("City is required", 404);
  } else if (city.length < 2 || typeof city !== "string") {
    throw new AppError("Invalid city", 404);
  }

  const normalizedCity = city.toLocaleLowerCase();

  const cachedEntry = weatherCache.get(normalizedCity);

  if (cachedEntry) {
    const isExpired = Date.now() - cachedEntry.timestamp > CACHE_TTL;
    if (!isExpired) {
      console.log("Serving from cache");
      return cachedEntry.data;
    }
    weatherCache.delete(normalizedCity);
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${normalizedCity}&limit=1&appid=${API_KEY}`;

  const geoRes = await fetch(geoAPI);

  if (!geoRes.ok) {
    throw new AppError("Faild to fetch location data", 500);
  }
  const geoData = await geoRes.json();

  if (!geoData.length) {
    throw new AppError("City not found", 404);
  }

  const { lat, lon, country } = geoData[0];

  const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const weatherRes = await fetch(weatherAPI);

  if (!weatherRes.ok) {
    throw new AppError("faild to fetch weather data", 500);
  }
  const weatherRawData = await weatherRes.json();

  const normalizedWeatherData = normalizeWeatherData(
    weatherRawData,
    city,
    country
  );

  weatherCache.set(normalizedCity, {
    data: normalizedWeatherData,
    time: Date.now(),
  });

  return normalizedWeatherData;
};

// geoAPI => http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// current weatherAPI => https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
