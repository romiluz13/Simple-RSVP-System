import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/database';
import { ImageSettings } from '@/lib/models/ImageSettings';
import { existsSync } from 'fs';

export async function GET() {
  try {
    await connectToDatabase();
    
    let settings = await ImageSettings.findOne({ name: 'rsvp-hero' });
    
    // Create default settings if none exist
    if (!settings) {
      settings = await ImageSettings.create({
        name: 'rsvp-hero',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        altText: 'Event Celebration',
        isUploaded: false
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching image settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = formData.get('altText') as string;
    const imageUrl = formData.get('imageUrl') as string;

    await connectToDatabase();

    if (file) {
      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filePath = join(uploadDir, filename);

      try {
        // Write file to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);
        
        const uploadPath = `/uploads/${filename}`;
        
        const settings = await ImageSettings.findOneAndUpdate(
          { name: 'rsvp-hero' },
          { 
            imageUrl: uploadPath,
            altText: altText || 'Event Celebration',
            isUploaded: true,
            uploadPath,
            updatedAt: new Date()
          },
          { 
            upsert: true, 
            new: true,
            runValidators: true 
          }
        );

        return NextResponse.json(settings);
      } catch (writeError) {
        console.error('Error writing file:', writeError);
        return NextResponse.json(
          { error: 'Failed to save uploaded file' },
          { status: 500 }
        );
      }
    } else if (imageUrl) {
      // Handle URL update
      const settings = await ImageSettings.findOneAndUpdate(
        { name: 'rsvp-hero' },
        { 
          imageUrl,
          altText: altText || 'Event Celebration',
          isUploaded: false,
          uploadPath: null,
          updatedAt: new Date()
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true 
        }
      );

      return NextResponse.json(settings);
    } else {
      return NextResponse.json(
        { error: 'Either file or image URL is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating image settings:', error);
    return NextResponse.json(
      { error: 'Failed to update image settings' },
      { status: 500 }
    );
  }
} 