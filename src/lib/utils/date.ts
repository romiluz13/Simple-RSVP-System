export type DateFormat = 'US' | 'IL' | 'ISO';
export type TimeFormat = '12h' | '24h';

export function formatDate(date: string, format: DateFormat = 'US') {
  const d = new Date(date);
  
  switch (format) {
    case 'IL':
      return d.toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    case 'US':
      return d.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    case 'ISO':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString();
  }
}

export function formatTime(time: string, format: TimeFormat = '24h'): string {
  try {
    // Handle different time input formats
    let date: Date;
    
    if (time.includes('T')) {
      // Full ISO date-time string
      date = new Date(time);
    } else if (time.includes(':')) {
      // HH:mm format
      const [hours, minutes] = time.split(':').map(Number);
      date = new Date();
      date.setHours(hours, minutes, 0, 0);
    } else {
      throw new Error('Invalid time format');
    }
    
    if (format === '24h') {
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return time; // Return original time if parsing fails
  }
} 