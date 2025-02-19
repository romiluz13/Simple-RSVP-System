'use client';

import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard Template
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          This is a placeholder for your analytics dashboard. Build powerful visualizations using the template&apos;s features.
        </p>
      </div>

      {/* Quick Start Box */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <CommandLineIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Start: Add Your Analytics
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
                <code>{`// Request:
"Add an analytics dashboard with:
- Real-time data visualization
- User activity tracking
- Performance metrics
- Custom date ranges"

// The template provides:
✓ MongoDB integration
✓ Auth0 user tracking
✓ API endpoints
✓ TypeScript types`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Example Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Placeholder 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Activity</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <ArrowTrendingUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Add your chart visualization here</p>
          </div>
        </div>

        {/* Chart Placeholder 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Usage</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Add your API metrics here</p>
          </div>
        </div>
      </div>

      {/* Integration Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <WrenchScrewdriverIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integration Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Visualization</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Integrate with Chart.js, D3.js, or any other visualization library.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Real-time Updates</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use WebSocket or Server-Sent Events for live data updates.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Export</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add CSV/PDF export functionality for reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 