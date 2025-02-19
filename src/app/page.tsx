'use client';

import { useState } from 'react';
import Image from 'next/image';

// Event details from environment variables
const eventDate = process.env.NEXT_PUBLIC_EVENT_DATE || '[תאריך האירוע]';
const eventTime = process.env.NEXT_PUBLIC_EVENT_TIME || '[שעת האירוע]';
const venueName = process.env.NEXT_PUBLIC_VENUE_NAME || '[מקום האירוע]';
const venueAddress = process.env.NEXT_PUBLIC_VENUE_ADDRESS || '[כתובת האירוע]';

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    willAttend: true,
    guestCount: 1,
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const submissionData = {
        ...formData,
        guestCount: formData.willAttend ? Math.max(1, formData.guestCount) : 0
      };
      
      console.log('Form submission:', {
        originalGuestCount: formData.guestCount,
        willAttend: formData.willAttend,
        finalGuestCount: submissionData.guestCount
      });

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת אישור ההגעה');
      }

      setStatus({
        type: 'success',
        message: 'תודה על אישור ההגעה! נשמח לחגוג איתם. 🎉',
      });
      
      // Reset form with a slight delay to ensure the success message is seen
      setTimeout(() => {
        setFormData({ fullName: '', email: '', willAttend: true, guestCount: 1 });
      }, 100);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'שגיאה בשליחת אישור ההגעה',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Title Section - Spans full width */}
      <div className="relative z-10 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-l from-amber-200 via-yellow-300 to-amber-200 drop-shadow-lg px-4">
          חוגגים אהבה נצחית
        </h1>
        <p className="text-lg md:text-xl text-amber-100/90 mb-2">
          מזמינים אתכם לחגוג עמנו
        </p>
        <p className="text-xl md:text-2xl text-amber-100 font-medium">
          הדסה (92) ואוסקר (94)
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Left Side - Photo */}
          <div className="relative h-full min-h-[600px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-none">
            <Image
              src="/saba+savta.jpeg"
              alt="הדסה ואוסקר"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
          </div>

          {/* Right Side - Cards Stack */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Event Details Card */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-2xl font-semibold text-amber-200 mb-6 text-center">
                שמרו את התאריך ✨
              </h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-4 space-x-reverse text-lg">
                  <span className="text-2xl">📅</span>
                  <p className="text-amber-100">{eventDate}</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse text-lg">
                  <span className="text-2xl">⏰</span>
                  <p className="text-amber-100">{eventTime}</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse text-lg">
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <p className="text-amber-100">{venueName}</p>
                    <p className="text-amber-100/70 text-base">{venueAddress}</p>
                    <p className="text-amber-100/90 text-base mt-1">תפריט יווני אמיתי 🇬🇷</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP Form Card */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-2xl font-semibold text-center text-amber-200 mb-6">
                אישור הגעה 💌
              </h2>
              {status.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                      : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  }`}
                >
                  {status.message}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-amber-100 mb-2">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800/70 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400 text-right"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="הכניסו את שמכם המלא"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amber-100 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800/70 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400 text-left"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="הכניסו את כתובת האימייל שלכם"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-amber-100">
                    האם תגיעו לחגוג איתנו? 🎊
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
                      כן, נשמח להגיע! 🎉
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
                      מצטערים, לא נוכל 💌
                    </button>
                  </div>
                </div>
                {formData.willAttend && (
                  <div className="text-center">
                    <label htmlFor="guestCount" className="block text-sm font-medium text-amber-100 mb-2">
                      כמה תגיעו? 👥
                    </label>
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <input
                        type="number"
                        id="guestCount"
                        min="1"
                        required
                        className="w-24 px-4 py-2.5 bg-gray-800/70 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white text-center"
                        value={formData.guestCount}
                        onChange={(e) => {
                          // Parse the input value as an integer
                          const parsedValue = parseInt(e.target.value, 10);
                          // Use the parsed value if it's valid and at least 1, otherwise use 1
                          const finalValue = !isNaN(parsedValue) && parsedValue >= 1 ? parsedValue : 1;
                          
                          console.log('Guest count input:', {
                            rawValue: e.target.value,
                            parsedValue,
                            finalValue
                          });
                          
                          setFormData(prev => ({
                            ...prev,
                            guestCount: finalValue
                          }));
                        }}
                      />
                      <span className="text-amber-100/70">אורחים</span>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 bg-gradient-to-l from-amber-500 to-yellow-600 text-white rounded-lg font-medium 
                    ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:from-amber-600 hover:to-yellow-700 transform hover:scale-[1.02] transition-all'
                    } 
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    shadow-lg shadow-amber-500/20 mt-6`}
                >
                  {isSubmitting ? 'שולח... ✨' : 'שליחת אישור הגעה ✨'}
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
