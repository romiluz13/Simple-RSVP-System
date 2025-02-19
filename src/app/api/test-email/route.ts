import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);
const resolve4 = promisify(dns.resolve4);

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET() {
  try {
    // Test DNS resolution
    console.log('Testing DNS resolution for api.sendgrid.com...');
    
    try {
      const lookupResult = await lookup('api.sendgrid.com');
      console.log('DNS Lookup result:', lookupResult);
      
      const resolveResult = await resolve4('api.sendgrid.com');
      console.log('DNS Resolve result:', resolveResult);
    } catch (dnsError) {
      console.error('DNS resolution failed:', dnsError);
    }

    const msg = {
      to: 'rom@iluz.net',
      from: 'rom@iluz.net', // must be the verified sender
      subject: 'SendGrid Test - Hadassa & Oscar RSVP',
      text: 'This is a test email from your RSVP application.',
      html: '<strong>This is a test email from your RSVP application.</strong>',
    };

    console.log('Attempting to send test email...');
    const result = await sgMail.send(msg);
    console.log('SendGrid API response:', result);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      dnsTest: {
        lookup: await lookup('api.sendgrid.com'),
        resolve: await resolve4('api.sendgrid.com')
      }
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error ? (error as any).code : undefined
      },
      { status: 500 }
    );
  }
} 