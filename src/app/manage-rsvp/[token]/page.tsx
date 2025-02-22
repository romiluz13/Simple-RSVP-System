'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDate, formatTime } from '@/lib/utils/date';

interface RSVP {
  fullName: string;
  email: string;
  willAttend: boolean;
  guestCount: number;
  createdAt: string;
}

export default function ManageRSVP() {
  const params = useParams();
  const router = useRouter();
  const [rsvp, setRSVP] = useState<RSVP | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [willAttend, setWillAttend] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    fetchRSVP();
  }, [params.token]);

  const fetchRSVP = async () => {
    try {
      // Check if this is a preview
      if (params.token === 'sample-token') {
        setIsPreview(true);
      }

      const response = await fetch(`/api/manage-rsvp/${params.token}`);
      if (!response.ok) {
        throw new Error('Failed to fetch RSVP details');
      }
      const data = await response.json();
      setRSVP(data);
      setGuestCount(data.guestCount);
      setWillAttend(data.willAttend);
    } catch (error) {
      setError('Invalid or expired link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/manage-rsvp/${params.token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          willAttend,
          guestCount: willAttend ? Math.max(1, guestCount) : 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update RSVP');
      }

      setSuccessMessage('Your RSVP has been updated successfully!');
      fetchRSVP(); // Refresh the data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update RSVP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestCountChange = (newCount: number) => {
    // Ensure count is at least 1
    const finalCount = Math.max(1, newCount);
    setGuestCount(finalCount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!rsvp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-amber-500 text-center">
            <h2 className="text-xl font-semibold mb-4">RSVP Not Found</h2>
            <p>This RSVP link appears to be invalid or has expired.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Manage Your RSVP
            </h2>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-center">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-center">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Current RSVP Details</h2>
                <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Name:</span> {rsvp.fullName}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Email:</span> {rsvp.email}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Status:</span>{' '}
                    {rsvp.willAttend ? '✅ Attending' : '❌ Not Attending'}
                  </p>
                  {rsvp.willAttend && (
                    <p className="text-gray-300">
                      <span className="font-medium text-white">Guests:</span> {rsvp.guestCount}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-amber-100">
                  Will you be joining us? 🎊
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWillAttend(true)}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${
                      willAttend
                        ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/20'
                        : 'border-amber-500/30 text-amber-200 hover:bg-amber-500/10'
                    } transition-all duration-200`}
                  >
                    Yes, I'll be there! 🎉
                  </button>
                  <button
                    type="button"
                    onClick={() => setWillAttend(false)}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${
                      !willAttend
                        ? 'bg-gray-700 border-gray-600 text-white shadow-lg'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                    } transition-all duration-200`}
                  >
                    Sorry, can't make it 💌
                  </button>
                </div>
              </div>

              {willAttend && (
                <div className="text-center">
                  <label className="block text-sm font-medium text-amber-100 mb-2">
                    Number of Guests 👥
                  </label>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange(guestCount - 1)}
                      className="w-10 h-10 rounded-lg bg-gray-700 border border-amber-500/30 text-white hover:bg-gray-600 transition-colors flex items-center justify-center text-lg font-medium"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={guestCount}
                      onChange={(e) => handleGuestCountChange(parseInt(e.target.value) || 1)}
                      className="w-20 h-10 px-2 bg-gray-700 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange(guestCount + 1)}
                      className="w-10 h-10 rounded-lg bg-gray-700 border border-amber-500/30 text-white hover:bg-gray-600 transition-colors flex items-center justify-center text-lg font-medium"
                    >
                      +
                    </button>
                    <span className="text-amber-100/70 ml-2">guests</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full mt-6 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-medium 
                  ${
                    isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-amber-600 hover:to-yellow-700 transform hover:scale-[1.02] transition-all'
                  }`}
              >
                {isSubmitting ? 'Updating...' : 'Update RSVP'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 