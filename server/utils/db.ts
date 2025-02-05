import mongoose, { Connection } from 'mongoose'
import { logger } from './logger'

// Extend the global type to include mongoose property
declare global {
  var mongoose: {
    cached: typeof import("mongoose") 
    conn: null | Connection, 
    promise: null | Promise<mongoose.Mongoose> 
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

// Ensure cached is always initialized
global.mongoose = global.mongoose || { 
  cached: mongoose, 
  conn: null, 
  promise: null 
}
const cached = global.mongoose

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Changed to true to allow buffering
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseModule) => {
        logger.info('MongoDB connected successfully')
        return mongooseModule
      })
      .catch(error => {
        logger.error('MongoDB connection error:', error)
        throw error
      })
  }

  try {
    const mongooseInstance = await cached.promise
    cached.conn = mongooseInstance.connection
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export async function disconnectDB() {
  if (cached.conn) {
    await cached.conn.close()
    cached.conn = null
    cached.promise = null
  }
}

export default connectDB