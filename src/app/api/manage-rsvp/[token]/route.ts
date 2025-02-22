import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { RSVP } from '@/lib/models/rsvp';
import { sendAdminNotification } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    // For preview/sample tokens, return mock data
    if (params.token === 'sample-token') {
      return NextResponse.json({
        fullName: 'John Doe',
        email: 'john@example.com',
        willAttend: true,
        guestCount: 2,
        createdAt: new Date().toISOString()
      });
    }

    await connectToDatabase();

    // Find RSVP by management token
    const rsvp = await RSVP.findOne({ managementToken: params.token });
    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    // Return RSVP data without sensitive fields
    return NextResponse.json({
      fullName: rsvp.fullName,
      email: rsvp.email,
      willAttend: rsvp.willAttend,
      guestCount: rsvp.guestCount,
      createdAt: rsvp.createdAt
    });
  } catch (error) {
    console.error('Error fetching RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVP' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    // For preview/sample tokens, return mock success
    if (params.token === 'sample-token') {
      return NextResponse.json({
        fullName: 'John Doe',
        email: 'john@example.com',
        willAttend: true,
        guestCount: 2,
        createdAt: new Date().toISOString()
      });
    }

    const { willAttend, guestCount } = await request.json();
    
    await connectToDatabase();

    // Find and update RSVP
    const rsvp = await RSVP.findOne({ managementToken: params.token });
    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    // Update RSVP
    const previousStatus = rsvp.willAttend;
    const previousCount = rsvp.guestCount;

    rsvp.willAttend = willAttend;
    rsvp.guestCount = willAttend ? Math.max(1, guestCount) : 0;
    await rsvp.save();

    // Notify admin of changes if significant
    if (process.env.NOTIFICATION_EMAIL &&
        (previousStatus !== willAttend || previousCount !== rsvp.guestCount)) {
      try {
        await sendAdminNotification({
          fullName: rsvp.fullName,
          email: rsvp.email,
          eventDate: process.env.NEXT_PUBLIC_EVENT_DATE || '',
          eventTime: process.env.NEXT_PUBLIC_EVENT_TIME || '',
          venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
          venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '',
          guestCount: rsvp.guestCount,
          willAttend: rsvp.willAttend
        });
        console.log('✅ Change notification sent to admin');
      } catch (emailError) {
        console.error('❌ Error sending admin notification:', emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({
      fullName: rsvp.fullName,
      email: rsvp.email,
      willAttend: rsvp.willAttend,
      guestCount: rsvp.guestCount,
      createdAt: rsvp.createdAt
    });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    );
  }
} 