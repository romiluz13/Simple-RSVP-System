import { NextResponse } from 'next/server';
import { connectToDatabase, mongoose } from '@/lib/database';

export async function GET() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    await connectToDatabase();
    
    // Test if we can list collections
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ MongoDB connected successfully. Collections:', collections.map(c => c.name));
    
    return NextResponse.json({
      status: 'healthy',
      mongodb: {
        status: 'connected',
        readyState: mongoose.connection.readyState,
        collections: collections.map(c => c.name)
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        hasSendGrid: !!process.env.SENDGRID_API_KEY,
        hasEventDetails: !!(
          process.env.NEXT_PUBLIC_EVENT_DATE &&
          process.env.NEXT_PUBLIC_EVENT_TIME &&
          process.env.NEXT_PUBLIC_VENUE_NAME &&
          process.env.NEXT_PUBLIC_VENUE_ADDRESS
        )
      }
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 