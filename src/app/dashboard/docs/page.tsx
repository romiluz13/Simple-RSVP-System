'use client';

import { 
  BookOpenIcon, 
  CommandLineIcon, 
  CubeIcon,
  KeyIcon,
  ShieldCheckIcon,
  ServerIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Documentation Template
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Build comprehensive documentation for your API and features. This template provides everything you need.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <CommandLineIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Start: Add Your Documentation
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
                <code>{`// Request:
"Create documentation for:
- API endpoints
- Authentication
- Database models
- Frontend components"

// The template provides:
✓ Markdown support
✓ Code highlighting
✓ Interactive examples
✓ Search functionality`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* API Reference */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <ServerIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Reference</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Document your API endpoints with examples and response types.
          </p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <code className="text-sm text-gray-800 dark:text-gray-200">
              GET /api/users<br />
              POST /api/data<br />
              PUT /api/settings
            </code>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Authentication</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Explain Auth0 integration and security features.
          </p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <code className="text-sm text-gray-800 dark:text-gray-200">
              // Auth0 Configuration<br />
              // Role Management<br />
              // Token Handling
            </code>
          </div>
        </div>

        {/* Database Models */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <CubeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database Models</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Document MongoDB schemas and relationships.
          </p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <code className="text-sm text-gray-800 dark:text-gray-200">
              User Schema<br />
              Team Schema<br />
              API Key Schema
            </code>
          </div>
        </div>
      </div>

      {/* Interactive Example */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
            <KeyIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interactive Examples</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Example Request</span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Copy</button>
            </div>
            <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
              <code>{`fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${'{token}'}'
  },
  body: JSON.stringify({
    name: 'Example',
    type: 'demo'
  })
})`}</code>
            </pre>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Example Response</span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Copy</button>
            </div>
            <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
              <code>{`{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example",
    "type": "demo",
    "createdAt": "2024-02-16T..."
  }
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 