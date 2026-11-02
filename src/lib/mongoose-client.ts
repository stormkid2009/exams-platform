/**
 * connectToDB Function
 * 
 * This function establishes a connection to the MongoDB database using Mongoose.
 * It checks for an existing connection and reuses it to prevent multiple connections 
 * from being opened during hot reloads in development.
 * 
 * It retrieves the MongoDB connection string from the environment variable `MONGODB_URI`.
 * If the connection string is not defined, an error is thrown.
 * 
 * The function returns a promise that resolves to the Mongoose connection.
 * 
 * Caching is implemented using a global variable to maintain a single connection 
 * across multiple calls, ensuring efficient resource usage.
 * 
 * @throws {Error} If the `MONGODB_URI` environment variable is not defined.
 */
import mongoose from "mongoose";

// Get the MongoDB connection string from the environment variable.
// This is a string that identifies the MongoDB instance that we should connect to.
// If the environment variable is not defined, this will be undefined.
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  var mongoose: MongooseCache | undefined; // Must be `var` to survive hot reloads
}

/** Shape of the cached Mongoose connection stored on `global`. */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
};
global.mongoose = cached;



async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // it was false and I updated to true to solve connection delay
    };
    // narrowing to avoid typscript error if mongodburi is undefined
    if(MONGODB_URI){

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}

export default connectToDB;
