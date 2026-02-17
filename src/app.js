import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import weatherRouter from "./modules/weather/weather.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather/", weatherRouter);
app.use(globalErrorHandler);

export default app;
