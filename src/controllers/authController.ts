import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import bcrypt from "bcrypt";
import { User, UserCredentials } from "../modals/user";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // This tells Passport to use 'email' field instead of 'username'
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log("Email:", email, "Password:", password);
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Invalid password" });
        }
        const { email: userEmail, id } = user;
        return done(null, { email: userEmail, id });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const userLogin = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request body:", req.body); // Add this to debug what's being received

  const { email, password }: UserCredentials = req.body;

  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      next(err);
      return;
    }
    console.log(user, "USER");

    if (!user) {
      console.log("Authentication failed:", info); // Log the failure reason
      res.status(500).json({
        message: info?.message || "Authentication failed",
      });
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error logging in:", err);
        next(err);
        return;
      }
      res.status(200).send({ user });
      return;
    });
  })(req, res, next);
};

const userLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logout successful" });
    return;
  });
};

export { userLogin, userLogout };
