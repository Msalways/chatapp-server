"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatRouter_1 = __importDefault(require("./routes/chatRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const originRoutes = (0, express_1.Router)();
originRoutes.use("/Users/", userRoutes_1.default);
originRoutes.use("/chats", 
//   (req, res, next) => {
//     res.status(200).json({ message: "Chats" });
//   },
chatRouter_1.default);
originRoutes.use("/Auth/", authRouter_1.default);
exports.default = originRoutes;
