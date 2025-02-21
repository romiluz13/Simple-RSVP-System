import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { RSVP } from '@/lib/models/rsvp';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { guestCount } = await request.json();

    // Validate guest count
    if (typeof guestCount !== 'number' || guestCount < 0) {
      return NextResponse.json(
        { error: 'Invalid guest count' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const rsvp = await RSVP.findById(id);
    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    rsvp.guestCount = guestCount;
    await rsvp.save();

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    
    const rsvp = await RSVP.findByIdAndDelete(id);
    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'RSVP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to delete RSVP' },
      { status: 500 }
    );
  }
} 