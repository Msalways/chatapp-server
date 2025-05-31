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
exports.updateChat = exports.postChatMessage = exports.listChatMessages = exports.listUserChats = exports.createChat = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const openai_1 = __importDefault(require("../llm/openai"));
const createChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield prismaClient_1.default.chat.create({
            data: {
                user: {
                    connect: { id: req.user.id },
                },
                name: "New Chat",
            },
            select: {
                id: true,
                name: true,
            },
        });
        res.status(200).json({ message: "Chat created successfully", chat });
    }
    catch (error) {
        next(error);
    }
});
exports.createChat = createChat;
const updateChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { name } = req.body;
        const chat = yield prismaClient_1.default.chat.update({
            where: {
                id: chatId,
            },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });
        res.status(200).json({ message: "Chat updated successfully", chat });
    }
    catch (error) {
        next(error);
    }
});
exports.updateChat = updateChat;
const listUserChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield prismaClient_1.default.chat.findMany({
            where: {
                userId: req.user.id,
            },
            select: {
                id: true,
                name: true,
            },
        });
        res.status(200).json(chats);
    }
    catch (error) {
        next(error);
    }
});
exports.listUserChats = listUserChats;
const listChatMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const chat = yield prismaClient_1.default.chat.findUnique({
            where: {
                id: chatId,
            },
            select: {
                id: true,
                name: true,
            },
        });
        if (!chat) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }
        const messages = yield prismaClient_1.default.chat_History.findMany({
            where: {
                chatId: chatId,
            },
            select: {
                id: true,
                message: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        next(error);
    }
});
exports.listChatMessages = listChatMessages;
const postChatMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { message } = req.body;
        yield prismaClient_1.default.chat_History.create({
            data: {
                chatId,
                message,
                role: "User",
            },
        });
        const aiResponse = yield (0, openai_1.default)(chatId, message);
        const addedMessage = yield prismaClient_1.default.chat_History.create({
            data: {
                chatId,
                message: aiResponse,
                role: "Assistant",
            },
            select: {
                message: true,
                role: true,
                createdAt: true,
            },
        });
        res
            .status(200)
            .json({ message: "Message sent successfully", aiResponse: addedMessage });
    }
    catch (error) {
        next(error);
    }
});
exports.postChatMessage = postChatMessage;
