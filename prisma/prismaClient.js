"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const prisma = new prisma_1.PrismaClient({
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
});
exports.default = prisma;
