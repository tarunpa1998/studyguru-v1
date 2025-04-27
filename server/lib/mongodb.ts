import mongoose from 'mongoose';
import { log } from '../vite';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyglobal';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        log('Connected to MongoDB', 'mongodb');
        return mongoose;
      })
      .catch((error) => {
        log(`Error connecting to MongoDB: ${error.message}`, 'mongodb');
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;