import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

const cached: GlobalMongoose = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log('📊 Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        retryReads: true
      };

      console.log('🔌 Connecting to MongoDB...', {
        uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') // Hide credentials in logs
      });

      mongoose.set('debug', true); // Enable debug logging
      
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
      cached.conn = await cached.promise;
      
      // Test the connection
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB connection is not ready');
      }

      console.log('✅ Successfully connected to MongoDB', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });

      // List collections
      if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Available collections:', collections.map(c => c.name));
      }

      return cached.conn;
    } catch (e) {
      cached.promise = null;
      console.error('❌ MongoDB connection error:', {
        error: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      });
      throw e;
    }
  } catch (error) {
    console.error('❌ Database connection error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error('Failed to connect to database');
  }
} 