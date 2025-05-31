import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import chatOnOpenAi from "../llm/openai";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: string;
    };
  }
}

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chat = await prisma.chat.create({
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
  } catch (error) {
    next(error);
  }
};

const updateChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const { name } = req.body;
    const chat = await prisma.chat.update({
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
  } catch (error) {
    next(error);
  }
};

const listUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const listChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
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

    const messages = await prisma.chat_History.findMany({
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
  } catch (error) {
    next(error);
  }
};

const postChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    await prisma.chat_History.create({
      data: {
        chatId,
        message,
        role: "User",
      },
    });

    const aiResponse = await chatOnOpenAi(chatId, message);
    const addedMessage = await prisma.chat_History.create({
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
  } catch (error) {
    next(error);
  }
};

export {
  createChat,
  listUserChats,
  listChatMessages,
  postChatMessage,
  updateChat,
};
