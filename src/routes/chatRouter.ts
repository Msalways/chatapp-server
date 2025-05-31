import { Router } from "express";
import {
  createChat,
  listChatMessages,
  listUserChats,
  postChatMessage,
  updateChat,
} from "../controllers/chatControllers";

const chatRouter = Router();

chatRouter.get("/", listUserChats);

chatRouter.post("/", createChat);

chatRouter.put("/:chatId", updateChat);

chatRouter.get("/:chatId", listChatMessages);

chatRouter.post("/:chatId/message", postChatMessage);

export default chatRouter;
