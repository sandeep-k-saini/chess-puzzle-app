import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Use a simple module-level cache
let isConnected = false;

async function connectDB() {
  // If already connected, return early
  if (isConnected) {
    return mongoose;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    isConnected = db.connection.readyState === 1;
    console.log('MongoDB connected successfully');
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;
