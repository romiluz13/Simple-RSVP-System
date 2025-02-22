import sgMail from '@sendgrid/mail';
import { defaultTemplates } from './templates/defaultTemplates';
import { renderEmailTemplate } from './utils/emailTemplates';
import { formatDate, formatTime } from './utils/dateTime';
import type { Component } from './utils/emailTemplates';

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

export const sendConfirmationEmail = async (data: EmailData) => {
  const template = defaultTemplates.confirmation;
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
  const template = defaultTemplates.reminder;
  
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

export const sendAdminNotification = async (data: EmailData & { willAttend: boolean }) => {
  const subject = `RSVP Update: ${data.fullName} - ${data.willAttend ? 'Attending' : 'Not Attending'}`;
  
  const components: Component[] = [
    {
      type: 'header' as const,
      content: `RSVP ${data.willAttend ? 'Confirmation' : 'Update'} Received`,
      style: 'primary'
    },
    {
      type: 'text' as const,
      content: `${data.fullName} has ${data.willAttend ? 'confirmed attendance' : 'updated their RSVP'} for the event.`,
      style: 'primary'
    },
    {
      type: 'text' as const,
      content: `Status: ${data.willAttend ? '✅ Attending' : '❌ Not Attending'}`,
      style: 'secondary'
    },
    {
      type: 'text' as const,
      content: `Guest Count: ${data.guestCount}`,
      style: 'secondary'
    },
    {
      type: 'text' as const,
      content: `Contact Email: ${data.email}`,
      style: 'secondary'
    },
    {
      type: 'eventDetails' as const,
      content: '',
      style: 'secondary'
    },
    {
      type: 'button' as const,
      content: `View Admin Dashboard|${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      style: 'accent'
    }
  ];

  const msg = {
    to: process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL,
    from: process.env.FROM_EMAIL as string,
    subject,
    html: renderEmailTemplate(
      components,
      'default',
      defaultTemplates.confirmation.theme,
      data
    )
  };

  try {
    await sgMail.send(msg);
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw the error as this is a notification
    // and shouldn't block the main flow
  }
}; 