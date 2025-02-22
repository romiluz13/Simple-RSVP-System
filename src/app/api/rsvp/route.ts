import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { RSVP } from '@/lib/models/rsvp';
import { sendConfirmationEmail, sendReminderEmail, sendAdminNotification } from '@/lib/email';

// Event details from environment variables
const eventDate = process.env.NEXT_PUBLIC_EVENT_DATE || '[Event Date]';
const eventTime = process.env.NEXT_PUBLIC_EVENT_TIME || '[Event Time]';
const venueName = process.env.NEXT_PUBLIC_VENUE_NAME || '[Venue Name]';
const venueAddress = process.env.NEXT_PUBLIC_VENUE_ADDRESS || '[Venue Address]';

export async function GET(req: Request) {
  try {
    console.log('📥 Fetching RSVPs...');
    await connectToDatabase();

    // Get all RSVPs
    const rsvps = await RSVP.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${rsvps.length} RSVPs`);

    // Calculate statistics
    const totalCount = rsvps.length;
    const attendingCount = rsvps.filter(rsvp => rsvp.willAttend).length;
    const totalGuests = rsvps.reduce((sum, rsvp) => sum + (rsvp.willAttend ? rsvp.guestCount : 0), 0);

    console.log('📊 RSVP Statistics:', {
      total: totalCount,
      attending: attendingCount,
      notAttending: totalCount - attendingCount,
      totalGuests
    });

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
    console.error('❌ Failed to fetch RSVPs:', error);
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
      console.warn('⚠️ Missing required fields');
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
      email: body.email.toLowerCase(),
      willAttend: body.willAttend,
      guestCount: body.willAttend ? Math.max(1, body.guestCount || 1) : 0
    });

    // Save to database
    await rsvp.save();
    console.log('✅ RSVP saved to database:', {
      id: rsvp._id,
      fullName: rsvp.fullName,
      email: rsvp.email,
      willAttend: rsvp.willAttend,
      guestCount: rsvp.guestCount
    });

    // Send confirmation email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      try {
        await sendConfirmationEmail({
          fullName: rsvp.fullName,
          email: rsvp.email,
          eventDate,
          eventTime,
          venueName,
          venueAddress,
          guestCount: rsvp.guestCount,
          managementToken: rsvp.managementToken
        });
        console.log('✉️ Confirmation email sent');

        // Send admin notification
        if (process.env.NOTIFICATION_EMAIL) {
          await sendAdminNotification({
            fullName: rsvp.fullName,
            email: rsvp.email,
            willAttend: rsvp.willAttend,
            guestCount: rsvp.guestCount,
            eventDate,
            eventTime,
            venueName,
            venueAddress
          });
          console.log('✉️ Admin notification sent');
        }
      } catch (emailError) {
        console.error('⚠️ Failed to send emails:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        id: rsvp._id,
        fullName: rsvp.fullName,
        email: rsvp.email,
        willAttend: rsvp.willAttend,
        guestCount: rsvp.guestCount,
        managementToken: rsvp.managementToken
      }
    });
  } catch (error) {
    console.error('❌ Failed to save RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to save RSVP' },
      { status: 500 }
    );
  }
} 