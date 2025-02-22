import './globals.css';
import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import { Nav } from '@/components/layout/Nav';

const heebo = Heebo({ subsets: ['hebrew', 'latin'] });

export const metadata: Metadata = {
  title: 'הדסה ואוסקר - אישור הגעה',
  description: 'הצטרפו אלינו לחגוג את אהבתם הנצחית של הדסה ואוסקר. חגיגה של חיים, אהבה ומשפחה.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
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