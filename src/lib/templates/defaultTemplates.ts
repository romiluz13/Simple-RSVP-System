export const defaultTemplates = {
  confirmation: {
    subject: 'RSVP Confirmation - Event Invitation',
    layout: 'default',
    components: [
      {
        type: 'header',
        content: 'Thank You for Your RSVP!',
        style: 'primary'
      },
      {
        type: 'text',
        content: 'Hello {fullName}, thank you for confirming your attendance!',
        style: 'primary'
      },
      {
        type: 'eventDetails',
        content: '',
        style: 'secondary'
      },
      {
        type: 'text',
        content: 'We look forward to celebrating with you!',
        style: 'primary'
      },
      {
        type: 'button',
        content: 'Manage Your RSVP|{managementLink}',
        style: 'accent'
      }
    ],
    theme: {
      primaryColor: '#B45309',
      secondaryColor: '#1F2937',
      accentColor: '#D97706'
    }
  },
  reminder: {
    subject: 'Event Reminder',
    layout: 'elegant',
    components: [
      {
        type: 'header',
        content: 'Your Event is Tomorrow!',
        style: 'primary'
      },
      {
        type: 'text',
        content: 'Hello {fullName}, this is a friendly reminder about tomorrow\'s event.',
        style: 'primary'
      },
      {
        type: 'eventDetails',
        content: '',
        style: 'secondary'
      },
      {
        type: 'text',
        content: 'We look forward to seeing you tomorrow!',
        style: 'primary'
      }
    ],
    theme: {
      primaryColor: '#B45309',
      secondaryColor: '#1F2937',
      accentColor: '#D97706'
    }
  }
}; 