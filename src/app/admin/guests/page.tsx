'use client';

import { useEffect, useState } from 'react';

interface Guest {
  _id: string;
  fullName: string;
  email: string;
  willAttend: boolean;
  guestCount: number;
  createdAt: string;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingGuest, setEditingGuest] = useState<{ id: string; count: number } | null>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/admin/guests');
      if (!response.ok) {
        throw new Error('Failed to fetch guest list');
      }
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching guests');
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

      // Update local state
      setGuests(guests.filter(guest => guest._id !== id));
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

      // Update local state
      setGuests(guests.map(guest => 
        guest._id === editingGuest.id 
          ? { ...guest, guestCount: editingGuest.count }
          : guest
      ));
      setEditingGuest(null);
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-500">Guest List</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg border border-amber-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {guests.map((guest) => (
                <tr key={guest._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {guest.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {guest.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        guest.willAttend
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {guest.willAttend ? 'Attending' : 'Not Attending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {editingGuest?.id === guest._id ? (
                      <div className="flex items-center space-x-2">
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
                          className="text-green-400 hover:text-green-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingGuest(null)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{guest.guestCount}</span>
                        <button
                          onClick={() => handleEditGuestCount(guest._id, guest.guestCount)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(guest.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => handleDelete(guest._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
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