import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { ApiKey } from '@/lib/models/ApiKey';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const keys = await ApiKey.find(
      { userId: session.user.sub },
      { key: 0, hashedKey: 0 } // Exclude sensitive fields
    ).sort({ createdAt: -1 });

    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 