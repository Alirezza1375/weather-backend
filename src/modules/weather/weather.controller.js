import { fetchWeather } from "./weather.service.js";

export const getWeatherByCity = async (req, res, next) => {
  try {
    console.log("Controller hit", req.params);
    const { city } = req.params;

    const data = await fetchWeather(city);

    res.status(200).json(data);
  } catch (err) {
    console.error("faild to get data", err);
    next(err);
  }
};
