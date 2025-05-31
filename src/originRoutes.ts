import { Router } from "express";
import userRouter from "./routes/userRoutes";
import chatRouter from "./routes/chatRouter";
import authRouter from "./routes/authRouter";

const originRoutes = Router();

originRoutes.use("/Users/", userRouter);

originRoutes.use(
  "/chats",
  //   (req, res, next) => {
  //     res.status(200).json({ message: "Chats" });
  //   },
  chatRouter
);

originRoutes.use("/Auth/", authRouter);

export default originRoutes;
