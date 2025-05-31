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
const openai_1 = require("@langchain/openai");
const config_1 = __importDefault(require("../config/config"));
const runnables_1 = require("@langchain/core/runnables");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const mongodb_1 = require("@langchain/mongodb");
const mongoClient_1 = require("../lib/mongoClient");
const llm = new openai_1.ChatOpenAI({
    configuration: {
        baseURL: config_1.default.base_url,
        apiKey: config_1.default.api_key,
    },
    model: config_1.default.model_name,
});
const prompt = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant. Answer the Question based on Conversation History.",
    ],
    new prompts_1.MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
]);
const baseChain = runnables_1.RunnableSequence.from([
    prompt,
    llm,
    new output_parsers_1.StringOutputParser(),
]);
const chatWithHistory = new runnables_1.RunnableWithMessageHistory({
    runnable: baseChain,
    getMessageHistory: (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("chatId", chatId);
        const collection = yield (0, mongoClient_1.getChatHistoryCollection)();
        return new mongodb_1.MongoDBChatMessageHistory({
            collection,
            sessionId: chatId,
        });
    }),
    historyMessagesKey: "chat_history",
});
function chatOnOpenAi(sessionId, humanInput) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const aiResponse = yield chatWithHistory.invoke({ input: humanInput }, {
                configurable: { sessionId: sessionId },
            });
            console.log(aiResponse);
            return aiResponse;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = chatOnOpenAi;
