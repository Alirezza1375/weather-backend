import express from "express";
import cors from "cors";
import weatherRouter from "./modules/weather/weather.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import morgan from "morgan";
import { apiLimiter } from "./middleware/rateLimiter.js";
import healthRouter from "./modules/routes/health.routes.js";

const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use("/api", apiLimiter);

app.use("/api/weather", weatherRouter);
app.use("/api/health", healthRouter);

app.use(globalErrorHandler);

export default app;
