import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function verifyMongoDBConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    // Try to connect
    await mongoose.connect(uri);
    console.log('✅ MongoDB connection successful');
    
    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log(`📊 Connected to database with ${stats.collections} collections`);
    
    // Verify indexes
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      const indexes = await collection.indexes();
      console.log(`   - ${collection.collectionName}: ${indexes.length} indexes`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

verifyMongoDBConnection(); 