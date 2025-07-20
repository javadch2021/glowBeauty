// Server-only file - MongoDB imports
import { MongoClient, Db } from "mongodb";

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "remix_ecommerce";

// Global connection variables
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB and return the database instance
 */
export async function connectToDatabase(): Promise<Db> {
  try {
    // If already connected, return existing connection
    if (client && db) {
      return db;
    }

    console.log("Connecting to MongoDB...");

    // Create new MongoDB client
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    // Connect to MongoDB
    await client.connect();

    // Get database instance
    db = client.db(DATABASE_NAME);

    console.log(`Successfully connected to MongoDB database: ${DATABASE_NAME}`);

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error(
      `MongoDB connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get the database instance (assumes connection is already established)
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.");
  }
  return db;
}

/**
 * Close the MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return client !== null && db !== null;
}

/**
 * Initialize MongoDB connection on server startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await connectToDatabase();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// Collection names constants
export const COLLECTIONS = {
  PRODUCTS: "products",
  CUSTOMERS: "customers",
  ORDERS: "orders",
  ACTIVITY: "activity",
} as const;

// Export types for better TypeScript support
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
