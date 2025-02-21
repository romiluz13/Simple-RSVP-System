'use client';

import { useEffect, useState } from 'react';
import { formatDate, formatTime, DateFormat, TimeFormat } from '@/lib/utils/date';

interface EventSettings {
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<EventSettings>({
    title: '',
    date: '',
    time: '',
    venueName: '',
    venueAddress: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dateFormat, setDateFormat] = useState<DateFormat>('US');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');

  useEffect(() => {
    fetchSettings();
    // Load saved formats on mount
    const savedDateFormat = localStorage.getItem('dateFormat') as DateFormat;
    const savedTimeFormat = localStorage.getItem('timeFormat') as TimeFormat;
    if (savedDateFormat) {
      setDateFormat(savedDateFormat);
    }
    if (savedTimeFormat) {
      setTimeFormat(savedTimeFormat);
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/event-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching settings');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/event-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccessMessage('Settings saved successfully! Please refresh the page to see the changes.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Save formats when changed
  const handleFormatChange = (format: DateFormat | TimeFormat, type: 'date' | 'time') => {
    if (type === 'date') {
      setDateFormat(format as DateFormat);
      localStorage.setItem('dateFormat', format);
    } else {
      setTimeFormat(format as TimeFormat);
      localStorage.setItem('timeFormat', format);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    console.log('Time selected:', timeValue); // For debugging
    setSettings({ ...settings, time: timeValue });
  };

  return (
    <div className="space-y-8" dir="ltr">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Settings</h1>

      {/* Format Settings Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Display Format</h2>
        <div className="space-y-6">
          {/* Date Format */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Date Format</label>
            <div className="flex items-center space-x-4">
              <select
                value={dateFormat}
                onChange={(e) => handleFormatChange(e.target.value as DateFormat, 'date')}
                className="bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-amber-500"
              >
                <option value="US">US (MM/DD/YYYY)</option>
                <option value="IL">Israel (DD/MM/YYYY)</option>
                <option value="ISO">ISO (YYYY-MM-DD)</option>
              </select>
              <span className="text-gray-300">
                Example: {formatDate(new Date().toISOString(), dateFormat)}
              </span>
            </div>
          </div>

          {/* Time Format */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Time Format</label>
            <div className="flex items-center space-x-4">
              <select
                value={timeFormat}
                onChange={(e) => handleFormatChange(e.target.value as TimeFormat, 'time')}
                className="bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-amber-500"
              >
                <option value="24h">24-hour (18:00)</option>
                <option value="12h">12-hour (6:00 PM)</option>
              </select>
              <span className="text-gray-300">
                Example: {formatTime('18:00', timeFormat)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-amber-500/20 p-6">
        <div className="space-y-6">
          {/* Event Details Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="You're Invited!"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={settings.date}
                onChange={(e) => setSettings({ ...settings, date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Event Time (24-hour format)
              </label>
              <div className="space-y-2">
                <input
                  type="time"
                  value={settings.time}
                  onChange={handleTimeChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 [color-scheme:dark]"
                />
                <p className="text-sm text-gray-400">
                  Selected time: {settings.time ? formatTime(settings.time, timeFormat) : 'Not set'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Venue Name
              </label>
              <input
                type="text"
                value={settings.venueName}
                onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="The Grand Ballroom"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Venue Address
              </label>
              <input
                type="text"
                value={settings.venueAddress}
                onChange={(e) => setSettings({ ...settings, venueAddress: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="123 Event Street, City"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 bg-green-500/20 border border-green-500/30 text-green-200 p-4 rounded-lg">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 