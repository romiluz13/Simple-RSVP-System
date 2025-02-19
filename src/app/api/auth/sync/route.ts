import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOneAndUpdate(
      { auth0Id: session.user.sub },
      {
        auth0Id: session.user.sub,
        email: session.user.email,
        name: session.user.name,
        picture: session.user.picture,
        lastLogin: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Error in sync API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 