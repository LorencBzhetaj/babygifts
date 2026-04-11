// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI nuk është vendosur në .env.local');
}

// 1. Shto tipin për TypeScript/IDE autocomplete (opsionale por e dobishme)
let cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // 2. Shto këto për production në Vercel
      maxPoolSize: 10,          // max lidhje paralele
      serverSelectionTimeoutMS: 5000,  // dështo shpejt nëse Atlas nuk përgjigjet
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // 3. Reset promise nëse lidhja dështoi, kështu mund të riprovo
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;