import { AppError } from "../../utils/AppError.js";

export const fetchWeather = async (city) => {
  if (!city) {
    throw new AppError("City is required!", 400);
  } else {
    return {
      city,
      temperature: 20,
      condition: "sunny",
    };
  }
};
