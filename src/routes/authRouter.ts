import { Router } from "express";
import { userLogin, userLogout } from "../controllers/authController";
import { createUser } from "../controllers/userController";

const authRouter = Router();

authRouter.post("/login", userLogin);

authRouter.post("/signup", createUser);

authRouter.post("/logout", userLogout);

export default authRouter;
