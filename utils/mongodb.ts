import mongoose, { Connection, type ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agronet';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCached {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
  cached: typeof mongoose;
}

let cached: MongooseCached = global.mongoose || { conn: null, promise: null, cached: mongoose };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      return mongoose;
    });
  }

  try {
    await cached.promise;
    cached.conn = mongoose.connection;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;