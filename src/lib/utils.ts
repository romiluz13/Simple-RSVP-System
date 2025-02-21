import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format bytes to a human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Delay execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate a string to a specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate a random string
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

/**
 * Check if running on server or client
 */
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

export function generateICSFile(eventDetails: {
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  guestCount: number;
}) {
  // Convert date and time to UTC format
  const eventDateTime = new Date(`${eventDetails.eventDate} ${eventDetails.eventTime}`);
  const endDateTime = new Date(eventDateTime.getTime() + (3 * 60 * 60 * 1000)); // Default 3 hours duration

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Special Event Celebration
DTSTART:${formatDate(eventDateTime)}
DTEND:${formatDate(endDateTime)}
LOCATION:${eventDetails.venueName}, ${eventDetails.venueAddress}
DESCRIPTION:You have confirmed your attendance with ${eventDetails.guestCount} guest(s). We look forward to celebrating with you!
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Event reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function generateGoogleCalendarUrl(eventDetails: {
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  guestCount: number;
}) {
  const eventDateTime = new Date(`${eventDetails.eventDate} ${eventDetails.eventTime}`);
  const endDateTime = new Date(eventDateTime.getTime() + (3 * 60 * 60 * 1000));

  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Special Event Celebration',
    dates: `${formatDateForGoogle(eventDateTime)}/${formatDateForGoogle(endDateTime)}`,
    details: `You have confirmed your attendance with ${eventDetails.guestCount} guest(s). We look forward to celebrating with you!`,
    location: `${eventDetails.venueName}, ${eventDetails.venueAddress}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
