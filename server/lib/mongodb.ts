import mongoose from 'mongoose';
import { log } from '../vite';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Tarunpaa:Tarunlove%401998@replitdb.0m1olav.mongodb.net/Studyguru?retryWrites=true&w=majority&appName=replitdb';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection | null> | null } = { conn: null, promise: null };

// Add to global scope if needed for persistence
if (typeof global !== 'undefined') {
  // @ts-ignore: Adding custom property to global
  if (!global.mongoose) {
    // @ts-ignore: Adding custom property to global
    global.mongoose = { conn: null, promise: null };
  }
  // @ts-ignore: Reading custom property from global
  cached = global.mongoose;
}

/**
 * Connect to MongoDB database
 * Returns a mongoose connection object or null if connection fails
 */
async function connectToDatabase() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          log('Connected to MongoDB', 'mongodb');
          return mongoose.connection;
        })
        .catch((error) => {
          log(`Error connecting to MongoDB: ${error.message}`, 'mongodb');
          console.error('API Error:', error);
          // Clear the promise to allow retry later
          cached.promise = null;
          throw error; // Re-throw to be caught by the outer catch
        });
    }

    try {
      cached.conn = await cached.promise;
    } catch (error) {
      log(`Error retrieving MongoDB connection: ${error}`, 'mongodb');
      cached.promise = null;
      return null;
    }
    return cached.conn;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export default connectToDatabase;