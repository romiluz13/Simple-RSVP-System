import { NextResponse } from 'next/server';
import { renderEmailTemplate } from '@/lib/utils/emailTemplates';

// Helper function to get sample data
function getSampleData() {
  return {
    fullName: 'John Doe',
    email: 'john@example.com',
    eventDate: process.env.NEXT_PUBLIC_EVENT_DATE || '2024-12-31',
    eventTime: process.env.NEXT_PUBLIC_EVENT_TIME || '18:00',
    venueName: process.env.NEXT_PUBLIC_VENUE_NAME || 'Sample Venue',
    venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '123 Event Street',
    guestCount: 2,
    managementLink: 'http://localhost:3000/manage-rsvp/sample-token'
  };
}

export async function POST(request: Request) {
  try {
    const { template, type } = await request.json();

    if (!template || !template.components) {
      return NextResponse.json(
        { error: 'Template data is required' },
        { status: 400 }
      );
    }

    // Get sample data for preview
    const sampleData = getSampleData();

    // Render the template
    const html = renderEmailTemplate(
      template.components,
      template.layout || 'default',
      template.theme,
      sampleData
    );

    // Add preview wrapper
    const previewHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Email Preview - ${type === 'confirmation' ? 'Confirmation' : 'Reminder'}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #f4f4f4;
              font-family: Arial, sans-serif;
            }
            .preview-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .preview-header {
              background: #f8f9fa;
              padding: 10px;
              margin: -20px -20px 20px;
              border-radius: 8px 8px 0 0;
              border-bottom: 1px solid #e9ecef;
            }
            .preview-header h1 {
              margin: 0;
              font-size: 16px;
              color: #666;
            }
            .preview-info {
              background: #e9ecef;
              padding: 10px;
              margin: -20px -20px 20px;
              font-size: 14px;
              color: #666;
            }
            .preview-info code {
              background: #fff;
              padding: 2px 4px;
              border-radius: 4px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="preview-header">
              <h1>Email Preview - ${type === 'confirmation' ? 'Confirmation' : 'Reminder'}</h1>
            </div>
            <div class="preview-info">
              <p><strong>Subject:</strong> ${template.subject}</p>
              <p><strong>Layout:</strong> ${template.layout}</p>
              <p><strong>Sample Variables:</strong></p>
              <ul>
                ${Object.entries(sampleData)
                  .map(([key, value]) => `<li><code>{${key}}</code>: ${value}</li>`)
                  .join('')}
              </ul>
            </div>
            ${html}
          </div>
        </body>
      </html>
    `;

    return new NextResponse(previewHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
} 