'use client';

import { useEffect, useState } from 'react';
import { formatDate, formatTime, DateFormat, TimeFormat } from '@/lib/utils/date';

interface Guest {
  _id: string;
  fullName: string;
  email: string;
  willAttend: boolean;
  guestCount: number;
  createdAt: string;
}

interface Stats {
  total: number;
  attending: number;
  notAttending: number;
  totalGuests: number;
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    attending: 0,
    notAttending: 0,
    totalGuests: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingGuest, setEditingGuest] = useState<{ id: string; count: number } | null>(null);
  const [dateFormat, setDateFormat] = useState<DateFormat>('US');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');

  useEffect(() => {
    // Load saved formats
    const savedDateFormat = localStorage.getItem('dateFormat') as DateFormat;
    const savedTimeFormat = localStorage.getItem('timeFormat') as TimeFormat;
    if (savedDateFormat) {
      setDateFormat(savedDateFormat);
    }
    if (savedTimeFormat) {
      setTimeFormat(savedTimeFormat);
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch guests
      const guestsResponse = await fetch('/api/admin/guests');
      if (!guestsResponse.ok) {
        throw new Error('Failed to fetch guests');
      }
      const guestsData = await guestsResponse.json();
      setGuests(guestsData);

      // Calculate stats
      const total = guestsData.length;
      const attending = guestsData.filter((g: Guest) => g.willAttend).length;
      const totalGuests = guestsData.reduce((sum: number, g: Guest) => sum + (g.willAttend ? g.guestCount : 0), 0);

      setStats({
        total,
        attending,
        notAttending: total - attending,
        totalGuests
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete RSVP');
      }

      setGuests(guests.filter(guest => guest._id !== id));
      fetchData(); // Refresh stats
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error deleting RSVP');
    }
  };

  const handleEditGuestCount = (id: string, currentCount: number) => {
    setEditingGuest({ id, count: currentCount });
  };

  const handleSaveGuestCount = async () => {
    if (!editingGuest) return;

    try {
      const response = await fetch(`/api/admin/guests/${editingGuest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestCount: editingGuest.count }),
      });

      if (!response.ok) {
        throw new Error('Failed to update guest count');
      }

      setGuests(guests.map(guest => 
        guest._id === editingGuest.id 
          ? { ...guest, guestCount: editingGuest.count }
          : guest
      ));
      setEditingGuest(null);
      fetchData(); // Refresh stats
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error updating guest count');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-6">
      <h1 className="text-3xl font-bold text-amber-500 mb-8">Dashboard</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-amber-500/20">
          <h3 className="text-gray-400 text-sm font-medium">Total Responses</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-amber-500/20">
          <h3 className="text-gray-400 text-sm font-medium">Attending</h3>
          <p className="mt-2 text-3xl font-bold text-green-500">{stats.attending}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-amber-500/20">
          <h3 className="text-gray-400 text-sm font-medium">Not Attending</h3>
          <p className="mt-2 text-3xl font-bold text-red-500">{stats.notAttending}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-amber-500/20">
          <h3 className="text-gray-400 text-sm font-medium">Total Guests</h3>
          <p className="mt-2 text-3xl font-bold text-amber-500">{stats.totalGuests}</p>
        </div>
      </div>

      {/* Guest List */}
      <div className="bg-gray-800 rounded-lg border border-amber-500/20 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Guest List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[120px]">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[120px]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[150px]">
                  Guests
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[120px]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {guests.map((guest) => (
                <tr key={guest._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(guest._id)}
                      className="text-red-400 hover:text-red-300 px-2"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(guest.createdAt, dateFormat)} {formatTime(guest.createdAt, timeFormat)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {editingGuest?.id === guest._id ? (
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          min="0"
                          value={editingGuest.count}
                          onChange={(e) => setEditingGuest({ 
                            ...editingGuest, 
                            count: parseInt(e.target.value) || 0 
                          })}
                          className="w-16 px-2 py-1 bg-gray-700 border border-amber-500/30 rounded text-white"
                        />
                        <button
                          onClick={handleSaveGuestCount}
                          className="text-green-400 hover:text-green-300 px-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingGuest(null)}
                          className="text-gray-400 hover:text-gray-300 px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="w-8 text-center">{guest.guestCount}</span>
                        <button
                          onClick={() => handleEditGuestCount(guest._id, guest.guestCount)}
                          className="text-amber-400 hover:text-amber-300 px-2 ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      guest.willAttend
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {guest.willAttend ? 'Attending' : 'Not Attending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {guest.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {guest.fullName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 