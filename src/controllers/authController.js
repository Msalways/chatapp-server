"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.userLogin = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_local_1 = require("passport-local");
const passport_1 = __importDefault(require("passport"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email", // This tells Passport to use 'email' field instead of 'username'
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Email:", email, "Password:", password);
        const user = yield prismaClient_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: "Invalid password" });
        }
        const { email: userEmail, id } = user;
        return done(null, { email: userEmail, id });
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.default.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
const userLogin = (req, res, next) => {
    console.log("Request body:", req.body); // Add this to debug what's being received
    const { email, password } = req.body;
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            next(err);
            return;
        }
        console.log(user, "USER");
        if (!user) {
            console.log("Authentication failed:", info); // Log the failure reason
            res.status(500).json({
                message: (info === null || info === void 0 ? void 0 : info.message) || "Authentication failed",
            });
            return;
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Error logging in:", err);
                next(err);
                return;
            }
            res.status(200).send({ user });
            return;
        });
    })(req, res, next);
};
exports.userLogin = userLogin;
const userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: "Logout successful" });
        return;
    });
};
exports.userLogout = userLogout;
