'use client';

import { useEffect, useState } from 'react';

interface RSVP {
  _id: string;
  fullName: string;
  email: string;
  willAttend: boolean;
  submittedAt: string;
  guestCount: number;
}

interface Stats {
  total: number;
  attending: number;
  notAttending: number;
  totalGuests: number;
}

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, attending: 0, notAttending: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<{ id: string; loading: boolean }>({ id: '', loading: false });

  const fetchRSVPs = async () => {
    try {
      const response = await fetch('/api/rsvp');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בטעינת אישורי ההגעה');
      }

      setRsvps(data.rsvps);
      setStats(data.stats);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'שגיאה בטעינת אישורי ההגעה');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתם בטוחים שברצונכם למחוק אישור הגעה זה?')) {
      return;
    }

    setDeleteStatus({ id, loading: true });
    try {
      const response = await fetch(`/api/rsvp/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('שגיאה במחיקת אישור ההגעה');
      }

      await fetchRSVPs();
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      alert('שגיאה במחיקת אישור ההגעה');
    } finally {
      setDeleteStatus({ id: '', loading: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">טוען...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">שגיאה</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-l from-amber-200 to-yellow-500">
          ניהול אישורי הגעה
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-amber-500/20">
            <h3 className="text-lg font-medium text-gray-300 mb-2">סה״כ אישורי הגעה</h3>
            <p className="text-3xl font-bold text-amber-400">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-red-500/20">
            <h3 className="text-lg font-medium text-gray-300 mb-2">לא מגיעים</h3>
            <p className="text-3xl font-bold text-red-400">{stats.notAttending}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/20">
            <h3 className="text-lg font-medium text-gray-300 mb-2">סה״כ אורחים</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.totalGuests}</p>
          </div>
        </div>

        {/* RSVPs Table */}
        <div className="bg-gray-800 rounded-lg border border-amber-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    שם
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    אימייל
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    מספר אורחים
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    תאריך
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{rsvp.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 text-left" dir="ltr">{rsvp.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rsvp.willAttend
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rsvp.willAttend ? 'מגיע/ה' : 'לא מגיע/ה'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                      {rsvp.guestCount} 👥
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(rsvp.submittedAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleDelete(rsvp._id)}
                        disabled={deleteStatus.id === rsvp._id && deleteStatus.loading}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteStatus.id === rsvp._id && deleteStatus.loading ? 'מוחק...' : 'מחיקה'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 