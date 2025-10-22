import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

// Connect to MongoDB once and reuse the connection
async function connect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  }
  return client;
}

// Original function - returns collection references
export default async function connectDB() {
  try {
    await connect();
    const db = client.db("JobQuest");
    return {
      users: db.collection("users"),
      jobs: db.collection("jobs"),
      reviews: db.collection("reviews"),
      community: db.collection("community"),
      appliedJobs: db.collection("appliedJobs"),
    };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// New function - returns the database instance (useful for GridFS)
export async function getDatabase() {
  try {
    await connect();
    return client.db("JobQuest");
  } catch (error) {
    console.error("Failed to get database:", error);
    throw error;
  }
}

// Get the MongoDB client instance
export async function getClient() {
  try {
    await connect();
    return client;
  } catch (error) {
    console.error("Failed to get client:", error);
    throw error;
  }
}