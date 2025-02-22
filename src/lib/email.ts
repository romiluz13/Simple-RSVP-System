import sgMail from '@sendgrid/mail';
import { defaultTemplates } from './templates/defaultTemplates';
import { renderEmailTemplate } from './utils/emailTemplates';
import { formatDate, formatTime } from './utils/dateTime';
import type { Component, Theme } from './utils/emailTemplates';
import { Template, ITemplate } from './models/Template';
import { connectToDatabase } from './database';

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailData {
  fullName: string;
  email: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  guestCount?: number;
  managementToken?: string;
}

interface AdminNotificationData extends EmailData {
  willAttend: boolean;
}

interface EmailTemplate {
  subject: string;
  layout: 'default' | 'minimal' | 'elegant';
  components: Component[];
  theme: Theme;
}

async function getEmailTemplate(type: 'confirmation' | 'reminder'): Promise<EmailTemplate> {
  try {
    await connectToDatabase();
    const templates = await Template.findOne({ name: 'default' }).lean() as ITemplate | null;
    return templates ? templates[type] : defaultTemplates[type];
  } catch (error) {
    console.warn('Failed to fetch template from database, using default:', error);
    return defaultTemplates[type];
  }
}

export const sendConfirmationEmail = async (data: EmailData) => {
  const template = await getEmailTemplate('confirmation');
  const managementLink = data.managementToken ? 
    `${process.env.NEXT_PUBLIC_APP_URL}/manage-rsvp/${data.managementToken}` : 
    undefined;

  const templateData = {
    ...data,
    managementLink
  };

  const msg = {
    to: data.email,
    from: process.env.FROM_EMAIL as string,
    subject: template.subject,
    html: renderEmailTemplate(
      template.components,
      template.layout,
      template.theme,
      templateData
    )
  };

  try {
    await sgMail.send(msg);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

export const sendReminderEmail = async (data: EmailData) => {
  const template = await getEmailTemplate('reminder');
  
  const msg = {
    to: data.email,
    from: process.env.FROM_EMAIL as string,
    subject: template.subject,
    html: renderEmailTemplate(
      template.components,
      template.layout,
      template.theme,
      data
    )
  };

  try {
    await sgMail.send(msg);
    console.log('Reminder email sent successfully');
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
};

export const sendAdminNotification = async (data: AdminNotificationData) => {
  const subject = `RSVP Update: ${data.fullName} - ${data.willAttend ? 'Attending' : 'Not Attending'}`;
  
  const components: Component[] = [
    {
      type: 'header',
      content: `RSVP ${data.willAttend ? 'Confirmation' : 'Update'} Received`,
      style: 'primary'
    } as Component,
    {
      type: 'text',
      content: `${data.fullName} has ${data.willAttend ? 'confirmed attendance' : 'updated their RSVP'} for the event.`,
      style: 'primary'
    } as Component,
    {
      type: 'text',
      content: `Status: ${data.willAttend ? '✅ Attending' : '❌ Not Attending'}`,
      style: 'secondary'
    } as Component,
    {
      type: 'eventDetails',
      content: '',
      style: 'secondary'
    } as Component
  ];

  const msg = {
    to: process.env.NOTIFICATION_EMAIL as string,
    from: process.env.FROM_EMAIL as string,
    subject,
    html: renderEmailTemplate(
      components,
      'minimal',
      {
        primaryColor: '#B45309',
        secondaryColor: '#1F2937',
        accentColor: '#D97706'
      },
      data
    )
  };

  try {
    await sgMail.send(msg);
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}; 