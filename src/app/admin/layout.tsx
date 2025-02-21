'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Templates', href: '/admin/templates' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth', {
        credentials: 'include',
      });

      if (!response.ok) {
        router.replace('/admin/login');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.replace('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // If on login page or not authenticated, just render children
  if (pathname === '/admin/login' || !isAuthenticated) {
    return children;
  }

  // Render admin layout for authenticated users
  return (
    <div className="min-h-screen bg-gray-900" dir="ltr">
      {/* Top Navigation - Fixed Position */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-amber-500/20 shadow-lg" dir="ltr">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link 
                href="/admin" 
                className="flex-shrink-0 text-amber-500 font-bold text-xl hover:text-amber-400 transition-colors"
              >
                Admin Panel
              </Link>
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        } px-4 py-2.5 rounded-md text-sm font-medium transition-colors`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Logout button */}
            <div className="hidden md:block">
              <button
                onClick={async () => {
                  await fetch('/api/admin/auth', {
                    method: 'POST',
                    credentials: 'include',
                  });
                  router.replace('/admin/login');
                }}
                className="text-gray-300 hover:text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block px-4 py-2.5 rounded-md text-base font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={async () => {
                await fetch('/api/admin/auth', {
                  method: 'POST',
                  credentials: 'include',
                });
                router.replace('/admin/login');
              }}
              className="text-gray-300 hover:text-white block w-full text-left px-4 py-2.5 rounded-md text-base font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Adjusted padding for better spacing */}
      <main className="pt-24 px-4 max-w-7xl mx-auto pb-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 