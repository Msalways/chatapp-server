"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_password_1 = require("generate-password");
function randomPassword(length) {
    return (0, generate_password_1.generate)({
        length,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
    });
}
exports.default = randomPassword;
