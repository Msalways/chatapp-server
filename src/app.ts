import express from "express";
import originRoutes from "./originRoutes";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./config/config";
import passport from "passport";
import cors from "cors";
import { getMongoClient } from "./lib/mongoClient";
import authRouter from "./routes/authRouter";
import validateUserSession from "./middleware/validateSession";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const clientPromise = getMongoClient();

app.use(
  cors({
    origin: [config.frontend_url],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      clientPromise: clientPromise,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/check", (req, res) => {
  res.status(200).send("Working");
});

app.use("/", validateUserSession, originRoutes);

app.use(errorHandler);
export default app;
