"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const originRoutes_1 = __importDefault(require("./originRoutes"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const config_1 = __importDefault(require("./config/config"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const mongoClient_1 = require("./lib/mongoClient");
const validateSession_1 = __importDefault(require("./middleware/validateSession"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const clientPromise = (0, mongoClient_1.getMongoClient)();
app.use((0, cors_1.default)({
    origin: [config_1.default.frontend_url],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: connect_mongo_1.default.create({
        clientPromise: clientPromise,
        collectionName: "sessions",
        ttl: 24 * 60 * 60,
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: config_1.default.NODE_ENV === "production",
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/check", (req, res) => {
    console.log(config_1.default.frontend_url);
    res.status(200).send("Working");
});
app.use("/", validateSession_1.default, originRoutes_1.default);
app.use(errorHandler_1.default);
exports.default = app;
