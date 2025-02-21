import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Template, ITemplate } from '@/lib/models/Template';
import { defaultTemplates } from '@/lib/templates/defaultTemplates';

// GET /api/admin/templates
export async function GET() {
  try {
    console.log('📥 Starting templates fetch...');

    // Test if defaultTemplates is loaded correctly
    console.log('🔍 Default templates structure:', {
      confirmation: {
        subject: defaultTemplates?.confirmation?.subject,
        hasLayout: !!defaultTemplates?.confirmation?.layout,
        componentsCount: defaultTemplates?.confirmation?.components?.length,
        hasTheme: !!defaultTemplates?.confirmation?.theme
      },
      reminder: {
        subject: defaultTemplates?.reminder?.subject,
        hasLayout: !!defaultTemplates?.reminder?.layout,
        componentsCount: defaultTemplates?.reminder?.components?.length,
        hasTheme: !!defaultTemplates?.reminder?.theme
      }
    });

    // Connect to database
    console.log('🔌 Connecting to database...');
    const db = await connectToDatabase();
    console.log('✅ Database connection successful');

    // Get the templates or create default if none exists
    console.log('🔍 Searching for existing templates...');
    let templates = await Template.findOne({ name: 'default' }).lean() as ITemplate | null;
    console.log('🔍 Found templates:', templates ? 'yes' : 'no');
    
    if (!templates) {
      console.log('🆕 Creating default templates...');
      try {
        const defaultTemplate = {
          name: 'default',
          confirmation: {
            subject: defaultTemplates.confirmation.subject || 'RSVP Confirmation',
            layout: defaultTemplates.confirmation.layout || 'default',
            components: (defaultTemplates.confirmation.components || []).map(comp => ({
              type: comp.type,
              content: comp.content || '',
              style: comp.style
            })),
            theme: defaultTemplates.confirmation.theme || {
              primaryColor: '#B45309',
              secondaryColor: '#1F2937',
              accentColor: '#D97706'
            }
          },
          reminder: {
            subject: defaultTemplates.reminder.subject || 'Event Reminder',
            layout: defaultTemplates.reminder.layout || 'default',
            components: (defaultTemplates.reminder.components || []).map(comp => ({
              type: comp.type,
              content: comp.content || '',
              style: comp.style
            })),
            theme: defaultTemplates.reminder.theme || {
              primaryColor: '#B45309',
              secondaryColor: '#1F2937',
              accentColor: '#D97706'
            }
          }
        };

        console.log('📝 Creating template with data:', JSON.stringify(defaultTemplate, null, 2));
        templates = await Template.create(defaultTemplate);
        console.log('✅ Default templates created successfully');
      } catch (createError) {
        console.error('❌ Error creating default templates:', {
          error: createError instanceof Error ? createError.message : 'Unknown error',
          stack: createError instanceof Error ? createError.stack : undefined,
          details: createError
        });
        throw createError;
      }
    }

    if (!templates) {
      throw new Error('Failed to create or fetch templates');
    }

    const response = {
      confirmation: {
        subject: templates.confirmation.subject,
        layout: templates.confirmation.layout,
        components: templates.confirmation.components,
        theme: templates.confirmation.theme
      },
      reminder: {
        subject: templates.reminder.subject,
        layout: templates.reminder.layout,
        components: templates.reminder.components,
        theme: templates.reminder.theme
      }
    };

    console.log('✅ Templates fetched successfully:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error in GET /api/admin/templates:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      details: error
    });

    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Failed to fetch templates',
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/admin/templates
export async function POST(request: Request) {
  try {
    console.log('📤 Saving templates...');
    await connectToDatabase();
    
    const data = await request.json();
    console.log('📝 Received template data:', {
      confirmation: { subject: data.confirmation?.subject },
      reminder: { subject: data.reminder?.subject }
    });
    
    // Validate required fields
    if (!data.confirmation?.subject || !data.reminder?.subject) {
      console.warn('⚠️ Missing required template subjects');
      return NextResponse.json(
        { error: 'Template subjects are required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      name: 'default',
      confirmation: {
        subject: data.confirmation.subject,
        layout: data.confirmation.layout,
        components: data.confirmation.components.map((comp: any) => ({
          type: comp.type,
          content: comp.content || '',
          style: comp.style
        })),
        theme: data.confirmation.theme
      },
      reminder: {
        subject: data.reminder.subject,
        layout: data.reminder.layout,
        components: data.reminder.components.map((comp: any) => ({
          type: comp.type,
          content: comp.content || '',
          style: comp.style
        })),
        theme: data.reminder.theme
      }
    };

    console.log('📝 Updating template with data:', updateData);

    // Update or create template
    const template = await Template.findOneAndUpdate(
      { name: 'default' },
      updateData,
      { 
        upsert: true, 
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ) as ITemplate;

    if (!template) {
      throw new Error('Failed to update template');
    }

    const response = {
      confirmation: {
        subject: template.confirmation.subject,
        layout: template.confirmation.layout,
        components: template.confirmation.components,
        theme: template.confirmation.theme
      },
      reminder: {
        subject: template.reminder.subject,
        layout: template.reminder.layout,
        components: template.reminder.components,
        theme: template.reminder.theme
      }
    };

    console.log('✅ Templates saved successfully');
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error in POST /api/admin/templates:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to save templates' },
      { status: 500 }
    );
  }
} 