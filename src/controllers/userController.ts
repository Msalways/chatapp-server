import { NextFunction, Request, Response } from "express";
import { UserModel } from "../modals/user";
import prisma from "../../prisma/prismaClient";
import randomPassword from "../../reusables/random_passoword";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email }: UserModel = req.body;
    const password = randomPassword(8);
    const hashedPassword = await bcrypt.hashSync(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ password });
    return;
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getSessionInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session || !req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export { createUser, listUsers, getSessionInfo };
