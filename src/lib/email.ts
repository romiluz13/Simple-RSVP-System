import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailData {
  fullName: string;
  email: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  guestCount: number;
}

export async function sendConfirmationEmail(data: EmailData) {
  const msg = {
    to: data.email,
    from: process.env.SENDGRID_FROM_EMAIL || 'rom@iluz.net',
    subject: 'אישור הגעה - חגיגה של הדסה ואוסקר',
    html: `
      <div style="font-family: 'Heebo', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
        <h1 style="color: #B45309; text-align: center;">תודה על אישור ההגעה!</h1>
        <p>שלום ${data.fullName},</p>
        <p>תודה שאישרת את הגעתך לחגוג עם הדסה ואוסקר!</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #B45309; margin-top: 0;">פרטי האירוע</h2>
          <p><strong>מספר אורחים:</strong> ${data.guestCount} 👥</p>
          <p><strong>תאריך:</strong> ${data.eventDate}</p>
          <p><strong>שעה:</strong> ${data.eventTime}</p>
          <p><strong>מקום:</strong> ${data.venueName}</p>
          <p><strong>כתובת:</strong> ${data.venueAddress}</p>
          <p><strong>תפריט:</strong> תפריט יווני אמיתי 🇬🇷</p>
        </div>
        <p>נשמח לראותך באירוע המיוחד הזה!</p>
        <p>בברכה,<br>המשפחה</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

export async function sendReminderEmail(data: EmailData) {
  const msg = {
    to: data.email,
    from: process.env.SENDGRID_FROM_EMAIL || 'your-verified-sender@example.com',
    subject: 'תזכורת: חגיגה של הדסה ואוסקר מחר!',
    html: `
      <div style="font-family: 'Heebo', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
        <h1 style="color: #B45309; text-align: center;">תזכורת לאירוע</h1>
        <p>שלום ${data.fullName},</p>
        <p>זוהי תזכורת ידידותית שמחר מתקיימת החגיגה של הדסה ואוסקר!</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #B45309; margin-top: 0;">פרטי האירוע</h2>
          <p><strong>מספר אורחים:</strong> ${data.guestCount} 👥</p>
          <p><strong>תאריך:</strong> ${data.eventDate}</p>
          <p><strong>שעה:</strong> ${data.eventTime}</p>
          <p><strong>מקום:</strong> ${data.venueName}</p>
          <p><strong>כתובת:</strong> ${data.venueAddress}</p>
          <p><strong>תפריט:</strong> תפריט יווני אמיתי 🇬🇷</p>
        </div>
        <p>נשמח לראותך מחר!</p>
        <p>בברכה,<br>המשפחה</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
} 