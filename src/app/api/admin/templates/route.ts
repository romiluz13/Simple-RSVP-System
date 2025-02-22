import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Template, ITemplate } from '@/lib/models/Template';
import { defaultTemplates } from '@/lib/templates/defaultTemplates';

// GET /api/admin/templates
export async function GET() {
  try {
    await connectToDatabase();
    
    let templates = await Template.findOne({ name: 'default' }).lean() as ITemplate | null;
    
    if (!templates) {
      templates = await Template.create({
        name: 'default',
        confirmation: defaultTemplates.confirmation,
        reminder: defaultTemplates.reminder
      });
    }

    if (!templates) {
      throw new Error('Failed to create or fetch templates');
    }

    return NextResponse.json({
      confirmation: templates.confirmation,
      reminder: templates.reminder
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/admin/templates
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { confirmation, reminder } = body;

    if (!confirmation || !reminder) {
      return NextResponse.json(
        { error: 'Missing required template data' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Update or create templates
    const templates = await Template.findOneAndUpdate(
      { name: 'default' },
      {
        confirmation,
        reminder,
        updatedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    if (!templates) {
      throw new Error('Failed to update templates');
    }

    return NextResponse.json({
      confirmation: templates.confirmation,
      reminder: templates.reminder
    });
  } catch (error) {
    console.error('Error updating templates:', error);
    return NextResponse.json(
      { error: 'Failed to update templates' },
      { status: 500 }
    );
  }
} 