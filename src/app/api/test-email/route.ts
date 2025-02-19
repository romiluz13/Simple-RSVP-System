import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET() {
  try {
    const msg = {
      to: 'rom@iluz.net',
      from: 'rom@iluz.net', // must be the verified sender
      subject: 'SendGrid Test - Hadassa & Oscar RSVP',
      text: 'This is a test email from your RSVP application.',
      html: '<strong>This is a test email from your RSVP application.</strong>',
    };

    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 