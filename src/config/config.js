"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    db_url: process.env.DATABASE_URL || "",
    db_name: process.env.DB_NAME || "",
    api_key: process.env.API_KEY || "",
    base_url: process.env.BASE_URL || "",
    model_name: process.env.MODEL_NAME || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    frontend_url: process.env.FRONTEND_URL || "",
};
exports.default = config;
