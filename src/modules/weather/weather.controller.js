import { fetchWeather } from "./weather.service.js";

export const getWeatherByCity = async (req, res, next) => {
  console.log("controller hit", req.params);
  try {
    const { city } = req.params;
    const data = await fetchWeather(city);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
