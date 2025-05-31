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
exports.getSessionInfo = exports.listUsers = exports.createUser = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const random_passoword_1 = __importDefault(require("../../reusables/random_passoword"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const password = (0, random_passoword_1.default)(8);
        const hashedPassword = yield bcrypt_1.default.hashSync(password, 10);
        yield prismaClient_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        res.status(200).json({ password });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const listUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prismaClient_1.default.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.listUsers = listUsers;
const getSessionInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session || !req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        res.status(200).json({ user: req.user });
    }
    catch (error) {
        next(error);
    }
});
exports.getSessionInfo = getSessionInfo;
