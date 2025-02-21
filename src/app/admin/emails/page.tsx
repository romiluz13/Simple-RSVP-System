'use client';

import { useState } from 'react';

interface EmailSettings {
  sendConfirmation: boolean;
  sendReminder: boolean;
  reminderDaysBefore: number;
}

export default function EmailControls() {
  const [settings, setSettings] = useState<EmailSettings>({
    sendConfirmation: true,
    sendReminder: true,
    reminderDaysBefore: 1,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save email settings');
      }

      setSuccessMessage('Settings saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }

      alert('Test email sent successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error sending test email');
    }
  };

  const handleSendBulkReminder = async () => {
    if (!confirm('Are you sure you want to send reminders to all guests?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/send-bulk-reminder', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send bulk reminders');
      }

      alert('Bulk reminders sent successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error sending bulk reminders');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-500">Email Controls</h1>

      <div className="bg-gray-800 rounded-lg border border-amber-500/20 p-6">
        <div className="space-y-6">
          {/* Settings Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white font-medium">Send Confirmation Emails</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={settings.sendConfirmation}
                  onChange={(e) =>
                    setSettings({ ...settings, sendConfirmation: e.target.checked })
                  }
                />
                <span
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                    settings.sendConfirmation ? 'bg-amber-500' : 'bg-gray-600'
                  }`}
                ></span>
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    settings.sendConfirmation ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white font-medium">Send Reminder Emails</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={settings.sendReminder}
                  onChange={(e) =>
                    setSettings({ ...settings, sendReminder: e.target.checked })
                  }
                />
                <span
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                    settings.sendReminder ? 'bg-amber-500' : 'bg-gray-600'
                  }`}
                ></span>
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    settings.sendReminder ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white font-medium">Days Before Event for Reminder</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.reminderDaysBefore}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    reminderDaysBefore: parseInt(e.target.value) || 1,
                  })
                }
                className="w-20 px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={handleSendTestEmail}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Send Test Email
            </button>
            <button
              onClick={handleSendBulkReminder}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Send Bulk Reminder
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