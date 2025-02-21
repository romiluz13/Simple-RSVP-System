import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    console.log('🔍 Auth check initiated');
    
    // Get the cookie store
    const cookieStore = cookies();
    console.log('🍪 All cookies:', cookieStore.getAll());
    
    // Get the admin session cookie
    const adminSession = cookieStore.get('admin_session');
    console.log('🔑 Admin session cookie:', adminSession);

    if (!adminSession?.value || adminSession.value !== 'authenticated') {
      console.log('❌ Invalid or missing session cookie');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Auth check successful');
    return new NextResponse(
      JSON.stringify({ authenticated: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('🚨 Auth check error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'An error occurred during authentication check' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Logout endpoint
export async function POST(request: Request) {
  console.log('🚪 Logout initiated');
  
  const response = new NextResponse(
    JSON.stringify({ success: true }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  // Delete the session cookie
  response.cookies.set('admin_session', '', {
    expires: new Date(0),
    path: '/',
  });
  
  console.log('✅ Logout successful');
  return response;
} 