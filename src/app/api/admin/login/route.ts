import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple in-memory store for failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5; // Maximum number of failed attempts
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function POST(request: Request) {
  try {
    console.log('🔑 Login attempt initiated');
    const { username, password } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    console.log('📝 Login attempt details:', { username, ip });

    // Check if the IP is locked out
    const attempts = failedAttempts.get(ip);
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const timeLeft = LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt);
      if (timeLeft > 0) {
        console.log('🔒 IP is locked out:', ip);
        return NextResponse.json(
          { error: `Too many failed attempts. Please try again in ${Math.ceil(timeLeft / 60000)} minutes.` },
          { status: 429 }
        );
      } else {
        failedAttempts.delete(ip);
      }
    }

    // Validate credentials
    if (!username || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check against environment variables
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    console.log('🔍 Checking credentials against env vars:', {
      hasUsername: !!validUsername,
      hasPassword: !!validPassword,
      providedUsername: username,
      matches: username === validUsername
    });

    if (!validUsername || !validPassword) {
      console.error('⚠️ Admin credentials not configured in environment variables');
      return NextResponse.json(
        { error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    if (username === validUsername && password === validPassword) {
      console.log('✅ Login successful');
      // Clear failed attempts on successful login
      failedAttempts.delete(ip);

      // Create response object
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      // Set session cookie with secure options
      const cookieValue = 'authenticated';
      console.log('🍪 Setting cookie:', cookieValue);
      
      response.cookies.set({
        name: 'admin_session',
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      // Log all cookies after setting
      console.log('🍪 Response cookies:', response.cookies);
      return response;
    }

    // Increment failed attempts
    console.log('❌ Invalid credentials');
    const currentAttempts = failedAttempts.get(ip);
    if (currentAttempts) {
      currentAttempts.count += 1;
      currentAttempts.lastAttempt = Date.now();
    } else {
      failedAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('🚨 Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 