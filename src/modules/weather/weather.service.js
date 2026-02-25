import { AppError } from "../../utils/AppError.js";
import { normalizeWeatherData } from "../../utils/normalizeWeatherData.js";

export const fetchWeather = async (city) => {
  if (!city) {
    throw new AppError("city is required", 404);
  } else if (city.length < 2 || typeof city !== "string") {
    throw new AppError("City is not valid", 400);
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  const geoRes = await fetch(geoAPI);

  if (!geoRes.ok) {
    throw new AppError("faild to fetch location data", 500);
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
  const rawWeatherData = await weatherRes.json();

  const normalizedWeatherData = normalizeWeatherData(
    rawWeatherData,
    city,
    country
  );

  return normalizedWeatherData;
};

// geoAPI => http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// current weatherAPI => https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
