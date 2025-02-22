'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { generateGoogleCalendarUrl, generateICSFile } from '@/lib/utils';
import { formatDate, formatTime, DateFormat, TimeFormat } from '@/lib/utils/date';

interface FormData {
  fullName: string;
  email: string;
  willAttend: boolean;
  guestCount: number;
}

interface StatusState {
  type: 'success' | 'error' | null;
  message: string;
  calendarData?: {
    googleUrl: string;
    icsContent: string;
  };
}

interface ImageSettings {
  imageUrl: string;
  altText: string;
}

interface EventSettings {
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    willAttend: true,
    guestCount: 1,
  });
  const [status, setStatus] = useState<StatusState>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateFormat, setDateFormat] = useState<DateFormat>('US');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    imageUrl: DEFAULT_IMAGE,
    altText: 'Event Celebration'
  });
  const [eventSettings, setEventSettings] = useState<EventSettings>({
    title: process.env.NEXT_PUBLIC_EVENT_TITLE || 'Event',
    date: process.env.NEXT_PUBLIC_EVENT_DATE || '',
    time: process.env.NEXT_PUBLIC_EVENT_TIME || '',
    venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
    venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || ''
  });

  useEffect(() => {
    // Load format preferences
    const savedDateFormat = localStorage.getItem('dateFormat') as DateFormat;
    const savedTimeFormat = localStorage.getItem('timeFormat') as TimeFormat;
    if (savedDateFormat) setDateFormat(savedDateFormat);
    if (savedTimeFormat) setTimeFormat(savedTimeFormat);

    // Fetch settings
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch image settings
      const imageResponse = await fetch('/api/admin/image-settings');
      if (!imageResponse.ok) throw new Error('Failed to fetch image settings');
      const imageData = await imageResponse.json();
      setImageSettings({
        imageUrl: imageData.imageUrl,
        altText: imageData.altText
      });

      // Fetch event settings
      const eventResponse = await fetch('/api/admin/event-settings');
      if (!eventResponse.ok) throw new Error('Failed to fetch event settings');
      const eventData = await eventResponse.json();
      setEventSettings(eventData);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const submissionData = {
        ...formData,
        guestCount: formData.willAttend ? Math.max(1, formData.guestCount) : 0
      };

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error submitting RSVP');
      }

      // Generate calendar links
      const calendarData = {
        googleUrl: generateGoogleCalendarUrl({
          eventDate: eventSettings.date,
          eventTime: eventSettings.time,
          venueName: eventSettings.venueName,
          venueAddress: eventSettings.venueAddress,
          guestCount: submissionData.guestCount
        }),
        icsContent: generateICSFile({
          eventDate: eventSettings.date,
          eventTime: eventSettings.time,
          venueName: eventSettings.venueName,
          venueAddress: eventSettings.venueAddress,
          guestCount: submissionData.guestCount
        })
      };

      const formattedDate = formatDate(eventSettings.date, dateFormat);
      const formattedTime = formatTime(eventSettings.time, timeFormat);

      setStatus({
        type: 'success',
        message: `Thank you for your RSVP! We look forward to celebrating with you on ${formattedDate} at ${formattedTime}! 🎉`,
        calendarData
      });
      
      setTimeout(() => {
        setFormData({ fullName: '', email: '', willAttend: true, guestCount: 1 });
      }, 100);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error submitting RSVP',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);
    const finalValue = !isNaN(parsedValue) && parsedValue >= 1 ? parsedValue : 1;
    setFormData(prev => ({
      ...prev,
      guestCount: finalValue
    }));
  };

  const handleImageError = () => {
    console.error('Failed to load image, falling back to default');
    setImageSettings(prev => ({
      ...prev,
      imageUrl: DEFAULT_IMAGE
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900" dir="ltr">
      {/* Title Section - Spans full width */}
      <div className="relative z-10 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 drop-shadow-lg px-4">
          {eventSettings.title}
        </h1>
        <p className="text-lg md:text-xl text-amber-100/90 mb-2">
          Join us for a special celebration
        </p>
        <p className="text-xl md:text-2xl text-amber-100 font-medium">
          Save the Date ✨
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Left Side - Photo */}
          <div className="relative h-full min-h-[600px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-none">
            <Image
              src={imageSettings.imageUrl}
              alt={imageSettings.altText}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
          </div>

          {/* Right Side - Cards Stack */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Event Details Card */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-2xl font-semibold text-amber-200 mb-6 text-left">
                Event Details ✨
              </h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-4 text-lg">
                  <span className="text-2xl">📅</span>
                  <p className="text-amber-100">{formatDate(eventSettings.date, dateFormat)}</p>
                </div>
                <div className="flex items-center space-x-4 text-lg">
                  <span className="text-2xl">⏰</span>
                  <p className="text-amber-100">{formatTime(eventSettings.time, timeFormat)}</p>
                </div>
                <div className="flex items-center space-x-4 text-lg">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-amber-100">{eventSettings.venueName}</p>
                    <p className="text-amber-100/70 text-base">{eventSettings.venueAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP Form Card */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-2xl font-semibold text-amber-200 mb-6 text-left">
                RSVP 💌
              </h2>
              {status.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                      : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  }`}
                >
                  <p className="mb-4">{status.message}</p>
                  {status.type === 'success' && status.calendarData && (
                    <div className="mt-4 text-center">
                      <p className="mb-3 font-medium">Add to Your Calendar:</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                          href={status.calendarData.googleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Add to Google Calendar
                        </a>
                        <a
                          href={`data:text/calendar;charset=utf-8,${encodeURIComponent(status.calendarData.icsContent)}`}
                          download="event.ics"
                          className="inline-block bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Download for Other Apps
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-amber-100 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800/70 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amber-100 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800/70 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-amber-100">
                    Will you be joining us? 🎊
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, willAttend: true }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${
                        formData.willAttend
                          ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/20'
                          : 'border-amber-500/30 text-amber-200 hover:bg-amber-500/10'
                      } transition-all duration-200`}
                    >
                      Yes, I'll be there! 🎉
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, willAttend: false }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${
                        !formData.willAttend
                          ? 'bg-gray-700 border-gray-600 text-white shadow-lg'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                      } transition-all duration-200`}
                    >
                      Sorry, can't make it 💌
                    </button>
                  </div>
                </div>
                {formData.willAttend && (
                  <div className="text-center">
                    <label htmlFor="guestCount" className="block text-sm font-medium text-amber-100 mb-2">
                      Number of Guests 👥
                    </label>
                    <div className="flex items-center justify-center space-x-4">
                      <input
                        type="number"
                        id="guestCount"
                        name="guestCount"
                        min="1"
                        required
                        className="w-24 px-4 py-2.5 bg-gray-800/70 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white text-center"
                        value={formData.guestCount}
                        onChange={handleGuestCountChange}
                      />
                      <span className="text-amber-100/70">guests</span>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-medium 
                    ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:from-amber-600 hover:to-yellow-700 transform hover:scale-[1.02] transition-all'
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90 pointer-events-none"></div>
    </div>
  );
} 
