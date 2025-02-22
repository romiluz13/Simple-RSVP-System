import mongoose from 'mongoose';

// Global interface for mongoose connection
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose type
declare global {
  var mongoose: GlobalMongoose | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Global cached connection
const cached: GlobalMongoose = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  try {
    // If we have a cached connection, return it
    if (cached.conn) {
      console.log('📊 Using cached database connection');
      return cached.conn;
    }

    // If we don't have a cached connection but have a connecting promise, wait for it
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

      mongoose.set('debug', process.env.NODE_ENV === 'development');
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

      // List collections in development
      if (process.env.NODE_ENV === 'development' && mongoose.connection.db) {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Available collections:', collections.map(c => c.name));
      }

      return cached.conn;
    } catch (error) {
      cached.promise = null;
      console.error('❌ MongoDB connection error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  } catch (error) {
    console.error('❌ Database connection error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Export the mongoose instance for direct access when needed
export { mongoose }; 