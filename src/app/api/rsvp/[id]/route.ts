import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { RSVP } from '@/lib/models/rsvp';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const rsvp = await RSVP.findByIdAndDelete(params.id);

    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'RSVP deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to delete RSVP' },
      { status: 500 }
    );
  }
} 