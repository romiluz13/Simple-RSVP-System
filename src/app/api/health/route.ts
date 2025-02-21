
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

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
      mongodb: 'connected',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Failed to connect to MongoDB'
      },
      { status: 500 }
    );
  }
} 