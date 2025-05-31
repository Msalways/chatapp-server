import { Router } from "express";
import {
  createUser,
  getSessionInfo,
  listUsers,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", listUsers);

userRouter.post("/", createUser);

userRouter.get("/validate", getSessionInfo);

export default userRouter;
