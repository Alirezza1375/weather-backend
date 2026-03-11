import dotenv from "dotenv";
dotenv.config();
import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 5001 }),
  OPENWEATHER_API_KEY: str(),
});
