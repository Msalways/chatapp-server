import config from "../config/config";
import { MongoClient, Collection, Db } from "mongodb";

const uri = config.db_url;
const dbName = config.db_name;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  try {
    if (!client) {
      client = new MongoClient(uri, {
        // tlsAllowInvalidCertificates: true,
        tls: true,
      });
      await client.connect();
    }
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getMongoDB(): Promise<Db> {
  if (!db) {
    const mongoClient = await getMongoClient();
    db = mongoClient.db(dbName);
  }
  return db;
}

export async function getChatHistoryCollection(): Promise<Collection> {
  const db = await getMongoDB();
  return db.collection("Chat_History");
}
