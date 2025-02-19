import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RSVP } from '@/lib/models/rsvp';
import { sendReminderEmail } from '@/lib/email';

// Event details from environment variables
const eventDate = process.env.NEXT_PUBLIC_EVENT_DATE || '[Event Date]';
const eventTime = process.env.NEXT_PUBLIC_EVENT_TIME || '[Event Time]';
const venueName = process.env.NEXT_PUBLIC_VENUE_NAME || '[Venue Name]';
const venueAddress = process.env.NEXT_PUBLIC_VENUE_ADDRESS || '[Venue Address]';

export async function GET(req: Request) {
  try {
    // Verify secret token to ensure this is called by authorized source
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    if (token !== process.env.REMINDER_API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Get all attending RSVPs
    const rsvps = await RSVP.find({ willAttend: true });

    // Send reminder emails
    const results = await Promise.allSettled(
      rsvps.map(rsvp =>
        sendReminderEmail({
          fullName: rsvp.fullName,
          email: rsvp.email,
          eventDate,
          eventTime,
          venueName,
          venueAddress,
        })
      )
    );

    // Count successes and failures
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      message: `Reminder emails sent`,
      stats: {
        total: rsvps.length,
        succeeded,
        failed,
      }
    });
  } catch (error) {
    console.error('Failed to send reminder emails:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder emails' },
      { status: 500 }
    );
  }
} 