import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
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
    
    if (!process.env.REMINDER_API_SECRET || token !== process.env.REMINDER_API_SECRET) {
      console.error('Unauthorized reminder attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Get all attending RSVPs
    const rsvps = await RSVP.find({ willAttend: true });
    
    console.log(`Found ${rsvps.length} attending RSVPs to send reminders to`);

    // Send reminder emails
    const results = await Promise.allSettled(
      rsvps.map(async rsvp => {
        try {
          await sendReminderEmail({
            fullName: rsvp.fullName,
            email: rsvp.email,
            eventDate,
            eventTime,
            venueName,
            venueAddress,
            guestCount: rsvp.guestCount,
          });
          console.log(`Reminder sent successfully to ${rsvp.email}`);
          return { email: rsvp.email, status: 'success' };
        } catch (error) {
          console.error(`Failed to send reminder to ${rsvp.email}:`, error);
          return { email: rsvp.email, status: 'failed', error };
        }
      })
    );

    // Count successes and failures
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log('Reminder sending completed:', { succeeded, failed });

    return NextResponse.json({
      message: 'Reminder emails processed',
      stats: {
        total: rsvps.length,
        succeeded,
        failed,
      }
    });
  } catch (error) {
    console.error('Failed to process reminder emails:', error);
    return NextResponse.json(
      { error: 'Failed to process reminder emails' },
      { status: 500 }
    );
  }
} 