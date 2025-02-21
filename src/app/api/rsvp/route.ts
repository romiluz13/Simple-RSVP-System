import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { RSVP } from '@/lib/models/rsvp';
import { sendConfirmationEmail, sendReminderEmail, sendAdminNotification } from '@/lib/email';

// Event details from environment variables
const eventDate = process.env.NEXT_PUBLIC_EVENT_DATE || '[Event Date]';
const eventTime = process.env.NEXT_PUBLIC_EVENT_TIME || '[Event Time]';
const venueName = process.env.NEXT_PUBLIC_VENUE_NAME || '[Venue Name]';
const venueAddress = process.env.NEXT_PUBLIC_VENUE_ADDRESS || '[Venue Address]';

export async function GET(req: Request) {
  try {
    await connectToDatabase();

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 RSVP submission received:', body);

    // Validate required fields
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    // Create new RSVP
    const rsvp = new RSVP({
      fullName: body.fullName,
      email: body.email,
      willAttend: body.willAttend,
      guestCount: body.willAttend ? Math.max(1, body.guestCount || 1) : 0
    });

    // Save to database
    await rsvp.save();
    console.log('✅ RSVP saved to database:', rsvp);

    // Send confirmation email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      try {
        // Send confirmation to guest
        await sendConfirmationEmail({
          fullName: body.fullName,
          email: body.email,
          eventDate: process.env.NEXT_PUBLIC_EVENT_DATE || '',
          eventTime: process.env.NEXT_PUBLIC_EVENT_TIME || '',
          venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
          venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '',
          guestCount: rsvp.guestCount,
          managementToken: rsvp.managementToken
        });
        console.log('✅ Confirmation email sent to guest');

        // Send notification to admin
        if (process.env.NOTIFICATION_EMAIL) {
          await sendAdminNotification({
            fullName: body.fullName,
            email: body.email,
            eventDate: process.env.NEXT_PUBLIC_EVENT_DATE || '',
            eventTime: process.env.NEXT_PUBLIC_EVENT_TIME || '',
            venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
            venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '',
            guestCount: rsvp.guestCount,
            willAttend: body.willAttend
          });
          console.log('✅ Notification email sent to admin');
        }
      } catch (emailError) {
        console.error('❌ Error sending emails:', emailError);
        // Don't fail the RSVP if email fails
      }
    } else {
      console.log('ℹ️ SendGrid not configured, skipping emails');
    }

    return NextResponse.json({
      message: 'RSVP submitted successfully',
      rsvp: {
        ...rsvp.toJSON(),
        managementToken: undefined
      }
    });
  } catch (error) {
    console.error('❌ RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
} 