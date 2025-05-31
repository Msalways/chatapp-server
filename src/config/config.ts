import dotenv from "dotenv";

dotenv.config();

interface Config {
  db_url: string;
  api_key: string;
  base_url: string;
  NODE_ENV: string;
  model_name: string;
  port: number;
  db_name: string;
  frontend_url: string;
}

const config: Config = {
  db_url: process.env.DATABASE_URL || "",
  db_name: process.env.DB_NAME || "",
  api_key: process.env.API_KEY || "",
  base_url: process.env.BASE_URL || "",
  model_name: process.env.MODEL_NAME || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  frontend_url: process.env.FRONTEND_URL || "",
};

export default config;
