import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  console.log('🛣️ Middleware handling path:', path);

  // Skip middleware for API routes
  if (path.startsWith('/api/')) {
    console.log('🔄 Skipping middleware for API route');
    return NextResponse.next();
  }

  // Get the response
  const response = NextResponse.next();

  // Add security headers
  const headers = response.headers;

  // Basic security headers
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Content Security Policy that allows Next.js to function properly
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // Handle admin routes
  if (path.startsWith('/admin')) {
    console.log('👤 Processing admin route');
    
    // Skip authentication for login page
    if (path === '/admin/login') {
      console.log('🔓 Allowing access to login page');
      return response;
    }

    // Check for admin session cookie
    const session = request.cookies.get('admin_session');
    console.log('🍪 Session cookie in middleware:', session?.value);
    
    if (!session?.value || session.value !== 'authenticated') {
      console.log('⚠️ No valid session cookie found, redirecting to login');
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    
    console.log('✅ Valid session cookie found, allowing access');
  }

  return response;
}

// Run middleware on admin routes only
export const config = {
  matcher: ['/admin/:path*'],
}; 