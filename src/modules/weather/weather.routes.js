import Router from "express";
import { getWeatherByCity } from "./weather.controller.js";

const router = Router();

router.get("/:city", getWeatherByCity);

export default router;
