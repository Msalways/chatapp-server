import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config";
import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import prisma from "../../prisma/prismaClient";
import { getChatHistoryCollection } from "../lib/mongoClient";

const llm = new ChatOpenAI({
  configuration: {
    baseURL: config.base_url,
    apiKey: config.api_key,
  },
  model: config.model_name,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer the Question based on Conversation History.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

const baseChain = RunnableSequence.from([
  prompt,
  llm,
  new StringOutputParser(),
]);

const chatWithHistory = new RunnableWithMessageHistory({
  runnable: baseChain,
  getMessageHistory: async (chatId) => {
    console.log("chatId", chatId);
    const collection = await getChatHistoryCollection();
    return new MongoDBChatMessageHistory({
      collection,
      sessionId: chatId,
    });
  },
  historyMessagesKey: "chat_history",
});

async function chatOnOpenAi(sessionId: string, humanInput: string) {
  try {
    const aiResponse = await chatWithHistory.invoke(
      { input: humanInput },
      {
        configurable: { sessionId: sessionId },
      }
    );
    console.log(aiResponse);
    return aiResponse;
  } catch (error) {
    throw error;
  }
}

export default chatOnOpenAi;
