import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Function to update .env.local file
async function updateEnvFile(updates: Record<string, string>) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing content
    let envContent = await fs.readFile(envPath, 'utf-8');
    const lines = envContent.split('\n');
    const updatedLines = [...lines];

    // Update each environment variable
    Object.entries(updates).forEach(([key, value]) => {
      const index = lines.findIndex(line => line.startsWith(`${key}=`));
      const newLine = `${key}="${value}"`;
      
      if (index !== -1) {
        // Update existing variable
        updatedLines[index] = newLine;
      } else {
        // Add new variable
        updatedLines.push(newLine);
      }
    });

    // Write back to file
    await fs.writeFile(envPath, updatedLines.join('\n'));
    return true;
  } catch (error) {
    console.error('Error updating .env.local:', error);
    return false;
  }
}

export async function GET() {
  try {
    // Return current settings
    const settings = {
      title: process.env.NEXT_PUBLIC_EVENT_TITLE || '',
      date: process.env.NEXT_PUBLIC_EVENT_DATE || '',
      time: process.env.NEXT_PUBLIC_EVENT_TIME || '',
      venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
      venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '',
    };

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
    const body = await request.json();
    console.log('📝 Updating event settings:', body);

    // Validate required fields
    const requiredFields = ['title', 'date', 'time', 'venueName', 'venueAddress'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(body.time)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:mm (24-hour format)' },
        { status: 400 }
      );
    }

    // Update environment variables
    const updates = {
      NEXT_PUBLIC_EVENT_TITLE: body.title,
      NEXT_PUBLIC_EVENT_DATE: body.date,
      NEXT_PUBLIC_EVENT_TIME: body.time,
      NEXT_PUBLIC_VENUE_NAME: body.venueName,
      NEXT_PUBLIC_VENUE_ADDRESS: body.venueAddress,
    };

    const success = await updateEnvFile(updates);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update event settings' },
        { status: 500 }
      );
    }

    // Update process.env for immediate effect
    Object.entries(updates).forEach(([key, value]) => {
      process.env[key] = value;
    });

    console.log('✅ Event settings updated successfully');
    return NextResponse.json({
      message: 'Event settings updated successfully. Please refresh the page to see the changes.',
      settings: updates
    });
  } catch (error) {
    console.error('❌ Error updating event settings:', error);
    return NextResponse.json(
      { error: 'Failed to update event settings' },
      { status: 500 }
    );
  }
} 