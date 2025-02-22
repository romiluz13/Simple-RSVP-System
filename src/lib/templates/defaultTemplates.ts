import type { Component, Theme } from '../utils/emailTemplates';

interface EmailTemplate {
  subject: string;
  layout: 'default' | 'minimal' | 'elegant';
  components: Component[];
  theme: Theme;
}

export const defaultTemplates: {
  confirmation: EmailTemplate;
  reminder: EmailTemplate;
} = {
  confirmation: {
    subject: 'RSVP Confirmation - Event Invitation',
    layout: 'default' as const,
    components: [
      {
        type: 'header',
        content: 'Thank You for Your RSVP!',
        style: 'primary'
      } as Component,
      {
        type: 'text',
        content: 'Hello {fullName}, thank you for confirming your attendance!',
        style: 'primary'
      } as Component,
      {
        type: 'eventDetails',
        content: '',
        style: 'secondary'
      } as Component,
      {
        type: 'text',
        content: 'We look forward to celebrating with you!',
        style: 'primary'
      } as Component,
      {
        type: 'button',
        content: 'Manage Your RSVP|{managementLink}',
        style: 'accent'
      } as Component
    ],
    theme: {
      primaryColor: '#B45309',
      secondaryColor: '#1F2937',
      accentColor: '#D97706'
    }
  },
  reminder: {
    subject: 'Event Reminder',
    layout: 'elegant' as const,
    components: [
      {
        type: 'header',
        content: 'Your Event is Tomorrow!',
        style: 'primary'
      } as Component,
      {
        type: 'text',
        content: 'Hello {fullName}, this is a friendly reminder about tomorrow\'s event.',
        style: 'primary'
      } as Component,
      {
        type: 'eventDetails',
        content: '',
        style: 'secondary'
      } as Component,
      {
        type: 'text',
        content: 'We look forward to seeing you tomorrow!',
        style: 'primary'
      } as Component
    ],
    theme: {
      primaryColor: '#B45309',
      secondaryColor: '#1F2937',
      accentColor: '#D97706'
    }
  }
}; 