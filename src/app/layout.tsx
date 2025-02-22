import './globals.css';
import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import { Nav } from '@/components/layout/Nav';

const heebo = Heebo({ subsets: ['hebrew', 'latin'] });

export const metadata: Metadata = {
  title: 'AI-Powered RSVP System | Next.js + MongoDB',
  description: 'Experience the future of event management with our AI-powered RSVP system. Features real-time guest tracking, automated emails, and a powerful admin dashboard. Built with Next.js 14, MongoDB, and modern AI assistance.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  openGraph: {
    title: 'AI-Powered RSVP System | Next.js + MongoDB',
    description: 'Experience the future of event management with our AI-powered RSVP system. Features real-time guest tracking, automated emails, and a powerful admin dashboard.',
    type: 'website',
    url: 'https://rsvp-demo.replit.app',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        width: 1200,
        height: 630,
        alt: 'AI-Powered RSVP System'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered RSVP System | Next.js + MongoDB',
    description: 'Experience the future of event management with our AI-powered RSVP system. Features real-time guest tracking, automated emails, and a powerful admin dashboard.',
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={heebo.className} suppressHydrationWarning>
        <Nav />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          {children}
        </main>
      </body>
    </html>
  );
} 