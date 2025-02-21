import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { RSVP } from '@/lib/models/rsvp';

export async function GET() {
  try {
    await connectToDatabase();

    // Get total RSVPs
    const totalRsvps = await RSVP.countDocuments();

    // Get attending count
    const attending = await RSVP.countDocuments({ willAttend: true });

    // Get not attending count
    const notAttending = await RSVP.countDocuments({ willAttend: false });

    // Get total guests
    const totalGuests = await RSVP.aggregate([
      { $match: { willAttend: true } },
      { $group: { _id: null, total: { $sum: '$guestCount' } } }
    ]);

    // Get recent responses
    const recentResponses = await RSVP.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName email willAttend guestCount createdAt');

    return NextResponse.json({
      totalRsvps,
      attending,
      notAttending,
      totalGuests: totalGuests[0]?.total || 0,
      recentResponses
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 