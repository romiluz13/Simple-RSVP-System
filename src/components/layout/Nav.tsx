'use client';

import Link from 'next/link';

export function Nav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-sm">
      <div className="absolute inset-0 border-b border-amber-500/10"></div>
      <nav className="container relative mx-auto flex h-20 items-center justify-center px-4">
        <Link 
          href="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500 hover:scale-105 transition-transform"
        >
          {process.env.NEXT_PUBLIC_EVENT_TITLE || ""}
        </Link>
      </nav>
    </header>
  );
} 