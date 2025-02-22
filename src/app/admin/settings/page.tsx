'use client';

import { useEffect, useState, useRef } from 'react';
import { formatDate, formatTime, DateFormat, TimeFormat } from '@/lib/utils/date';
import Image from 'next/image';

interface ImageSettings {
  imageUrl: string;
  altText: string;
  isUploaded: boolean;
  updatedAt: string;
}

interface EventSettings {
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

export default function Settings() {
  // Image settings state
  const [imageSettings, setImageSettings] = useState<ImageSettings | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Event settings state
  const [eventSettings, setEventSettings] = useState<EventSettings>({
    title: process.env.NEXT_PUBLIC_EVENT_TITLE || '',
    date: process.env.NEXT_PUBLIC_EVENT_DATE || '',
    time: process.env.NEXT_PUBLIC_EVENT_TIME || '',
    venueName: process.env.NEXT_PUBLIC_VENUE_NAME || '',
    venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [dateFormat, setDateFormat] = useState<DateFormat>('US');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');

  useEffect(() => {
    fetchSettings();
    fetchEventSettings();
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
      const response = await fetch('/api/admin/image-settings');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setImageSettings(data);
      setNewImageUrl(data.imageUrl);
      setNewAltText(data.altText);
      setPreviewUrl(data.imageUrl);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to load settings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventSettings = async () => {
    try {
      const response = await fetch('/api/admin/event-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch event settings');
      }
      const data = await response.json();
      setEventSettings(data);
    } catch (error) {
      console.error('Error fetching event settings:', error);
      setStatus({
        type: 'error',
        message: 'Failed to load event settings'
      });
    }
  };

  const handleImageError = () => {
    setStatus({
      type: 'error',
      message: 'Failed to load image. Please check the URL and try again.'
    });
    // Reset to default image
    setPreviewUrl(DEFAULT_IMAGE);
    setNewImageUrl(DEFAULT_IMAGE);
    
    // Update in database
    const formData = new FormData();
    formData.append('imageUrl', DEFAULT_IMAGE);
    formData.append('altText', 'Event Celebration');
    
    fetch('/api/admin/image-settings', {
      method: 'POST',
      body: formData,
    }).catch(console.error);
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      // Check if it's an Unsplash image
      if (url.includes('unsplash.com')) {
        return true;
      }

      // For other URLs, create an image element to test loading
      return new Promise<boolean>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    } catch {
      return false;
    }
  };

  const handleImagePreview = async () => {
    if (!newImageUrl) {
      setStatus({
        type: 'error',
        message: 'Please enter an image URL'
      });
      return;
    }

    // Validate image URL
    const isValid = await validateImageUrl(newImageUrl);
    if (!isValid) {
      setStatus({
        type: 'error',
        message: 'Invalid image URL. Please enter a valid image URL.'
      });
      return;
    }

    setPreviewUrl(newImageUrl);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Reset status
    setStatus({ type: null, message: '' });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setStatus({
        type: 'error',
        message: 'Please upload an image file'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: 'error',
        message: 'Image size should be less than 5MB'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', newAltText || 'Event Celebration');

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/image-settings', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setImageSettings(data);
      setNewImageUrl(data.imageUrl);
      setPreviewUrl(data.imageUrl);
      setStatus({
        type: 'success',
        message: 'Image uploaded successfully!'
      });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to upload image'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUrlUpdate = async () => {
    if (!newImageUrl) {
      setStatus({
        type: 'error',
        message: 'Please enter an image URL'
      });
      return;
    }

    // Validate image URL
    const isValid = await validateImageUrl(newImageUrl);
    if (!isValid) {
      setStatus({
        type: 'error',
        message: 'Invalid image URL. Please enter a valid image URL.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('imageUrl', newImageUrl);
    formData.append('altText', newAltText || 'Event Celebration');

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/image-settings', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update image settings');
      }

      setImageSettings(data);
      setPreviewUrl(data.imageUrl);
      setStatus({
        type: 'success',
        message: 'Image settings updated successfully!'
      });
    } catch (error) {
      console.error('Update error:', error);
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update image settings'
      });
      // Reset to default image on error
      handleImageError();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus({ type: null, message: '' });

    try {
      // Validate required fields
      const requiredFields = {
        title: 'Event Title',
        date: 'Event Date',
        time: 'Event Time',
        venueName: 'Venue Name',
        venueAddress: 'Venue Address'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !eventSettings[key as keyof EventSettings])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const response = await fetch('/api/admin/event-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setStatus({
        type: 'success',
        message: 'Settings saved successfully! The page will refresh in 2 seconds.'
      });

      // Refresh the page after 2 seconds to show the changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error saving settings'
      });
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
    setEventSettings({ ...eventSettings, time: timeValue });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-300">
          Manage your event settings and customization options.
        </p>
      </div>

      {/* Status Message */}
      {status.type && (
        <div className={`p-4 rounded-lg ${
          status.type === 'success' 
            ? 'bg-green-500/20 text-green-200 border border-green-500/30'
            : 'bg-red-500/20 text-red-200 border border-red-500/30'
        }`}>
          {status.message}
        </div>
      )}

      {/* Event Settings */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={eventSettings.title}
              onChange={(e) => setEventSettings(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
              placeholder="Enter your event title"
            />
            <p className="mt-1 text-sm text-gray-400">This title appears in both the navigation bar and main page</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={eventSettings.date}
                onChange={(e) => setEventSettings(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Time
              </label>
              <input
                type="time"
                value={eventSettings.time}
                onChange={handleTimeChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Venue Name
            </label>
            <input
              type="text"
              value={eventSettings.venueName}
              onChange={(e) => setEventSettings(prev => ({ ...prev, venueName: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Venue Address
            </label>
            <input
              type="text"
              value={eventSettings.venueAddress}
              onChange={(e) => setEventSettings(prev => ({ ...prev, venueAddress: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
            />
          </div>
        </div>
      </div>

      {/* Image Settings */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-white mb-6">Hero Image</h2>
        
        {/* Current Image Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Current Image</h3>
          <div className="relative h-[300px] rounded-lg overflow-hidden bg-gray-700">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={imageSettings?.altText || 'Preview'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No image selected
              </div>
            )}
          </div>
          {imageSettings?.updatedAt && (
            <p className="mt-2 text-sm text-gray-400">
              Last updated: {new Date(imageSettings.updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Upload New Image</h3>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
              >
                Click to Upload Image
              </button>
            </div>
          </div>

          <div className="- my-2 border-t border-gray-700"></div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Or Use Image URL</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                  placeholder="Enter image URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                  placeholder="Enter alt text for accessibility"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleImagePreview}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={handleImageUrlUpdate}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-amber-500 text-white rounded-lg font-medium ${
                    isSaving
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-amber-600 transition-colors'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Guidelines */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-white mb-4">Image Guidelines</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Use high-resolution images (minimum 1920x1080)</li>
          <li>Ensure the image is relevant to your event theme</li>
          <li>Optimize for web to maintain fast loading times</li>
          <li>Consider using images from Unsplash or similar services</li>
          <li>Test how the image looks on different screen sizes</li>
        </ul>
      </div>

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
    </div>
  );
} 