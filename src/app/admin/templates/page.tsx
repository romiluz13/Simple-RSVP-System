'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Component {
  type: string;
  content: string;
  style: 'primary' | 'secondary' | 'accent';
}

interface Template {
  subject: string;
  layout: 'default' | 'minimal' | 'elegant';
  components: Component[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

interface Templates {
  confirmation: Template;
  reminder: Template;
}

const COMPONENT_TYPES = [
  { value: 'header', label: 'Header' },
  { value: 'text', label: 'Text Block' },
  { value: 'eventDetails', label: 'Event Details' },
  { value: 'button', label: 'Button' },
  { value: 'divider', label: 'Divider' }
];

const LAYOUTS = [
  { value: 'default', label: 'Default' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'elegant', label: 'Elegant' }
];

const STYLES = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' }
];

const DEFAULT_TEMPLATE: Template = {
  subject: '',
  layout: 'default',
  components: [],
  theme: {
    primaryColor: '#B45309',
    secondaryColor: '#1F2937',
    accentColor: '#D97706'
  }
};

export default function Templates() {
  const [templates, setTemplates] = useState<Templates>({
    confirmation: {
      subject: 'RSVP Confirmation',
      layout: 'default',
      components: [],
      theme: {
        primaryColor: '#B45309',
        secondaryColor: '#1F2937',
        accentColor: '#D97706'
      }
    },
    reminder: {
      subject: 'Event Reminder',
      layout: 'default',
      components: [],
      theme: {
        primaryColor: '#B45309',
        secondaryColor: '#1F2937',
        accentColor: '#D97706'
      }
    }
  });
  const [activeTemplate, setActiveTemplate] = useState<'confirmation' | 'reminder'>('confirmation');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      setError('Error loading templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templates),
      });

      if (!response.ok) throw new Error('Failed to save templates');
      setSuccessMessage('Templates saved successfully!');
    } catch (error) {
      setError('Error saving templates');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/admin/preview-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: templates[activeTemplate],
          type: activeTemplate,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate preview');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Open preview in new window
      window.open(url, '_blank');
    } catch (error) {
      setError('Error generating preview');
    }
  };

  const addComponent = () => {
    setTemplates(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        components: [
          ...prev[activeTemplate].components,
          { type: 'text', content: '', style: 'primary' }
        ]
      }
    }));
  };

  const removeComponent = (index: number) => {
    setTemplates(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        components: prev[activeTemplate].components.filter((_, i) => i !== index)
      }
    }));
  };

  const updateComponent = (index: number, field: string, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        components: prev[activeTemplate].components.map((component, i) => 
          i === index ? { ...component, [field]: value } : component
        )
      }
    }));
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-500">Email Templates</h1>
        <div className="space-x-4">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Template Type Selector */}
      <div className="bg-gray-800 rounded-lg p-4 flex space-x-4">
        <button
          onClick={() => setActiveTemplate('confirmation')}
          className={`px-4 py-2 rounded-md ${
            activeTemplate === 'confirmation'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Confirmation Email
        </button>
        <button
          onClick={() => setActiveTemplate('reminder')}
          className={`px-4 py-2 rounded-md ${
            activeTemplate === 'reminder'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Reminder Email
        </button>
      </div>

      {/* Template Editor */}
      <div className="bg-gray-800 rounded-lg border border-amber-500/20 p-6">
        {/* Subject and Layout */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={templates[activeTemplate].subject}
              onChange={(e) => setTemplates(prev => ({
                ...prev,
                [activeTemplate]: {
                  ...prev[activeTemplate],
                  subject: e.target.value
                }
              }))}
              className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Layout Style
            </label>
            <select
              value={templates[activeTemplate].layout}
              onChange={(e) => setTemplates(prev => ({
                ...prev,
                [activeTemplate]: {
                  ...prev[activeTemplate],
                  layout: e.target.value as 'default' | 'minimal' | 'elegant'
                }
              }))}
              className="w-full px-3 py-2 bg-gray-700 border border-amber-500/30 rounded-md text-white"
            >
              {LAYOUTS.map(layout => (
                <option key={layout.value} value={layout.value}>
                  {layout.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Components */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Components</h2>
            <button
              onClick={addComponent}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600"
            >
              Add Component
            </button>
          </div>

          {templates[activeTemplate].components.map((component, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <select
                  value={component.type}
                  onChange={(e) => updateComponent(index, 'type', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-amber-500/30 rounded-md text-white"
                >
                  {COMPONENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeComponent(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              {component.type !== 'divider' && component.type !== 'eventDetails' && (
                <textarea
                  value={component.content}
                  onChange={(e) => updateComponent(index, 'content', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-amber-500/30 rounded-md text-white h-24"
                  placeholder="Enter content..."
                />
              )}

              <select
                value={component.style}
                onChange={(e) => updateComponent(index, 'style', e.target.value as 'primary' | 'secondary' | 'accent')}
                className="px-3 py-2 bg-gray-600 border border-amber-500/30 rounded-md text-white"
              >
                {STYLES.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Theme Colors */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">Theme Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(templates[activeTemplate].theme).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    [activeTemplate]: {
                      ...prev[activeTemplate],
                      theme: {
                        ...prev[activeTemplate].theme,
                        [key]: e.target.value
                      }
                    }
                  }))}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Available Variables */}
      <div className="bg-gray-800 rounded-lg border border-amber-500/20 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Available Template Variables:</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <div>
            <code>{'{fullName}'}</code> - Guest's full name
          </div>
          <div>
            <code>{'{email}'}</code> - Guest's email address
          </div>
          <div>
            <code>{'{eventDate}'}</code> - Event date
          </div>
          <div>
            <code>{'{eventTime}'}</code> - Event time
          </div>
          <div>
            <code>{'{venueName}'}</code> - Venue name
          </div>
          <div>
            <code>{'{venueAddress}'}</code> - Venue address
          </div>
          <div>
            <code>{'{guestCount}'}</code> - Number of guests
          </div>
          <div>
            <code>{'{managementLink}'}</code> - RSVP management link
          </div>
        </div>
      </div>
    </div>
  );
} 