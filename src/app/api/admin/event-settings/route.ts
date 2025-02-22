import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { EventSettings } from '@/lib/models/EventSettings';

export async function GET() {
  try {
    await connectToDatabase();
    
    let settings = await EventSettings.findOne().sort({ updatedAt: -1 });
    
    // If no settings exist, create default from env variables
    if (!settings) {
      settings = await EventSettings.create({
        title: process.env.NEXT_PUBLIC_EVENT_TITLE || 'Event',
        date: process.env.NEXT_PUBLIC_EVENT_DATE || '',
        time: process.env.NEXT_PUBLIC_EVENT_TIME || '',
        venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
        venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || ''
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching event settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    // Validate required fields
    if (!data.title || !data.date || !data.time || !data.venueName || !data.venueAddress) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Update or create settings
    const settings = await EventSettings.findOneAndUpdate(
      {},
      {
        title: data.title,
        date: data.date,
        time: data.time,
        venueName: data.venueName,
        venueAddress: data.venueAddress,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating event settings:', error);
    return NextResponse.json(
      { error: 'Failed to update event settings' },
      { status: 500 }
    );
  }
} 