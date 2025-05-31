"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoClient = getMongoClient;
exports.getMongoDB = getMongoDB;
exports.getChatHistoryCollection = getChatHistoryCollection;
const config_1 = __importDefault(require("../config/config"));
const mongodb_1 = require("mongodb");
const uri = config_1.default.db_url;
const dbName = config_1.default.db_name;
let client = null;
let db = null;
function getMongoClient() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!client) {
                client = new mongodb_1.MongoClient(uri, {
                    tlsAllowInvalidCertificates: true,
                    tls: true,
                });
                yield client.connect();
            }
            return client;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
function getMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db) {
            const mongoClient = yield getMongoClient();
            db = mongoClient.db(dbName);
        }
        return db;
    });
}
function getChatHistoryCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield getMongoDB();
        return db.collection("Chat_History");
    });
}
