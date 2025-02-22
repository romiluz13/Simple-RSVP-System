import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { RSVP } from '@/lib/models/rsvp';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all RSVPs sorted by creation date
    const rsvps = await RSVP.find({})
      .sort({ createdAt: -1 })
      .select('fullName email willAttend guestCount createdAt');

    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
} 