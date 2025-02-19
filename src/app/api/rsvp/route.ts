import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RSVP } from '@/lib/models/rsvp';
import { sendConfirmationEmail, sendReminderEmail } from '@/lib/email';

// Event details from environment variables
const eventDate = process.env.NEXT_PUBLIC_EVENT_DATE || '[Event Date]';
const eventTime = process.env.NEXT_PUBLIC_EVENT_TIME || '[Event Time]';
const venueName = process.env.NEXT_PUBLIC_VENUE_NAME || '[Venue Name]';
const venueAddress = process.env.NEXT_PUBLIC_VENUE_ADDRESS || '[Venue Address]';

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get all RSVPs
    const rsvps = await RSVP.find({}).sort({ submittedAt: -1 });

    // Calculate statistics
    const totalCount = rsvps.length;
    const attendingCount = rsvps.filter(rsvp => rsvp.willAttend).length;
    
    // Calculate total guests
    const totalGuests = rsvps.reduce((sum, rsvp) => {
      return sum + (rsvp.willAttend ? rsvp.guestCount : 0);
    }, 0);

    return NextResponse.json({
      rsvps,
      stats: {
        total: totalCount,
        attending: attendingCount,
        notAttending: totalCount - attendingCount,
        totalGuests
      }
    });
  } catch (error) {
    console.error('Failed to fetch RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, willAttend } = body;
    
    // Parse guest count strictly
    let guestCount = 1; // Default to 1
    if (body.guestCount) {
      const parsed = parseInt(body.guestCount, 10);
      if (!isNaN(parsed)) {
        guestCount = parsed;
      }
    }

    // Validate input
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Create RSVP document
    const rsvp = await RSVP.create({
      fullName,
      email,
      willAttend,
      guestCount: willAttend ? Math.max(1, guestCount) : 0
    });

    // Send confirmation email if attending
    if (willAttend) {
      try {
        await sendConfirmationEmail({
          fullName,
          email,
          eventDate,
          eventTime,
          venueName,
          venueAddress,
          guestCount: rsvp.guestCount,
        });

        // Schedule reminder email
        const eventDateTime = new Date('2025-02-28T13:00:00');
        const reminderTime = new Date(eventDateTime.getTime() - (24 * 60 * 60 * 1000));
        const now = new Date();
        
        if (reminderTime > now) {
          const timeoutMs = reminderTime.getTime() - now.getTime();
          setTimeout(async () => {
            try {
              await sendReminderEmail({
                fullName,
                email,
                eventDate,
                eventTime,
                venueName,
                venueAddress,
                guestCount: rsvp.guestCount,
              });
            } catch (reminderError) {
              console.error('Failed to send reminder email:', reminderError);
            }
          }, timeoutMs);
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json(
      { message: 'RSVP submitted successfully', rsvp },
      { status: 201 }
    );
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
} 