'use client';

import { 
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
  KeyIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings Template
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure your application settings. This template provides a comprehensive settings interface.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <CodeBracketIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Start: Add Your Settings
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
                <code>{`// Request:
"Create settings interface for:
- User preferences
- Notifications
- API configuration
- Security settings"

// The template provides:
✓ Settings persistence
✓ Real-time updates
✓ Form validation
✓ Dark mode support`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Profile Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your profile details</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Settings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage email preferences</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Configure</button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
              <BellIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure push notifications</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure email alerts</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white" />
              </button>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <KeyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">API Keys</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage API keys</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Generate</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Rate Limits</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure API rate limits</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Adjust</button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable 2FA security</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Session Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage active sessions</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <GlobeAltIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integrations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">MongoDB</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Configure database connection
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Connected
            </span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Auth0</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Manage authentication settings
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Connected
            </span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analytics</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Set up analytics tracking
            </p>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 