'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Nav() {
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Fetch event settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/event-settings');
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
        }
      } catch (error) {
        console.error('Error fetching event settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-sm">
      <div className="absolute inset-0 border-b border-amber-500/10"></div>
      <nav className="container relative mx-auto flex h-20 items-center justify-center px-4">
        <Link 
          href="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500 hover:scale-105 transition-transform"
        >
          {title}
        </Link>
      </nav>
    </header>
  );
} 