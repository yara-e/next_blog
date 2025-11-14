import "server-only";
import { MongoClient } from "mongodb";

if (!process.env.DB_URI) {
    throw new Error("Mongo URI not found");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.DB_URI, {
        tls: true,
        tlsAllowInvalidCertificates: false, // optional
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        },
    });
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDB(dbname) {
    try {
        const client = await clientPromise;
        console.log("✅ Connected to DB");
        return client.db(dbname);
    } catch (err) {
        console.error("❌ DB connection error:", err);
        throw err; // important to rethrow
    }
}

export async function getCollection(collectionName) {
    const db = await getDB("next_blog_db");
    return db.collection(collectionName);
}
