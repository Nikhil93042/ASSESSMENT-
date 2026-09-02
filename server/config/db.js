import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let isConnected = false;
let mongoMemoryInstance = null;

export const connectDB = async () => {
  // Reuse existing active connection if connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const primaryURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/personainsight';
  
  try {
    console.log('[DB] Establishing cached MongoDB connection...');
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 3000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.warn(`[DB] Primary connection to ${primaryURI} failed (${error.message}). Initializing embedded database fallback...`);
    
    try {
      if (!mongoMemoryInstance) {
        mongoMemoryInstance = await MongoMemoryServer.create();
      }
      const fallbackURI = mongoMemoryInstance.getUri();
      const conn = await mongoose.connect(fallbackURI);
      isConnected = true;
      console.log('MongoDB connected successfully (Embedded Mode)');
      return conn;
    } catch (memErr) {
      console.error('[DB] MongoDB connection failed:', memErr.message);
      isConnected = false;
      return null;
    }
  }
};

export const getDbStatus = () => {
  const state = mongoose.connection.readyState;
  return {
    connected: state === 1,
    state,
    host: mongoose.connection.host || 'none',
    name: mongoose.connection.name || 'none'
  };
};
