export type DateFormat = 'US' | 'IL' | 'ISO';
export type TimeFormat = '12h' | '24h';

export const formatDate = (date: string, format: DateFormat = 'US'): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'US':
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    case 'IL':
      return d.toLocaleDateString('he-IL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    case 'ISO':
      return d.toISOString().split('T')[0];
    default:
      return date;
  }
};

export const formatTime = (time: string, format: TimeFormat = '24h'): string => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  
  if (format === '12h') {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${minutes} ${period}`;
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`;
}; 