import { AppError } from "../../utils/AppError.js";

export const fetchWeather = async (city) => {
  if (!city) {
    throw new AppError("City is required", 404);
  }
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  const geoRes = await fetch(geoURL);

  if (!geoRes.ok) {
    throw new AppError("faild to fetch location data", 500);
  }
  const geoData = await geoRes.json();

  if (!geoData.length) {
    throw new AppError("City not found", 404);
  }

  const { lat, lon } = geoData[0];

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const weatherRes = await fetch(weatherURL);

  if (!weatherRes.ok) {
    throw new AppError("faild to fetch weather data", 500);
  }

  const weatehrData = await weatherRes.json();

  // normalize weather data in an arrow func
  // return the clean structured data

  return weatehrData;
};

// takes city and returns the weather data
// api to get the lat and lon http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// current weather api https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
// 2.5‑Day / 3‑Hour Forecast API https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
// Air Pollution API https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}
