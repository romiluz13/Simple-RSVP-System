import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export async function rateLimit(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
  
  // Get or create rate limit entry
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      count: 0,
      resetTime: now + WINDOW_SIZE,
    };
  }
  
  // Increment counter
  store[ip].count++;
  
  // Check if limit exceeded
  if (store[ip].count > MAX_REQUESTS) {
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: store[ip].resetTime,
    };
  }
  
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - store[ip].count,
    reset: store[ip].resetTime,
  };
} 