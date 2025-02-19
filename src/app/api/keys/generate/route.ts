import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { ApiKey } from '@/lib/models/ApiKey';
import connectDB from '@/lib/mongodb';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limiter.limit.toString(),
            'X-RateLimit-Remaining': limiter.remaining.toString(),
            'X-RateLimit-Reset': limiter.reset.toString(),
          }
        }
      );
    }

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectDB();
    
    // Generate new API key
    const { key, hashedKey } = ApiKey.generateKey();

    // Create new API key record
    await ApiKey.create({
      userId: session.user.sub,
      name,
      key,
      hashedKey,
    });

    return NextResponse.json(
      { key },
      {
        headers: {
          'X-RateLimit-Limit': limiter.limit.toString(),
          'X-RateLimit-Remaining': limiter.remaining.toString(),
          'X-RateLimit-Reset': limiter.reset.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 