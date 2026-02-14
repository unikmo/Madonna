import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Ensure middleware has access to environment variables
// Middleware runs on Edge runtime, so we need to ensure JWT_SECRET is available

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  const pathname = request.nextUrl.pathname;

  // Debug logging
  if (pathname.startsWith('/admin')) {
    console.log(`[Middleware] ${pathname} - Token present: ${!!token}`);
    if (token) {
      const payload = await verifyToken(token);
      console.log(`[Middleware] Token valid: ${!!payload}, Roles: ${payload?.roles}`);
    }
  }

  // Handle /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page without token
    if (pathname === '/admin/login') {
      // If already logged in, redirect to dashboard
      if (token) {
        const payload = await verifyToken(token);
        if (payload && payload.roles && payload.roles.includes('admin')) {
          console.log('[Middleware] Already logged in, redirecting to dashboard');
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }

    // For all other admin routes, require authentication
    if (!token) {
      console.log('[Middleware] No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      console.log('[Middleware] Token verification failed, redirecting to login');
      // Invalid token, clear cookie and redirect
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }

    // Check if user has admin role
    if (!payload.roles || !payload.roles.includes('admin')) {
      console.log('[Middleware] User does not have admin role, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }

    console.log('[Middleware] Access granted to', pathname);
    // Allow access to admin routes
    return NextResponse.next();
  }

  // Handle /api/admin routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Allow login and test-auth APIs without token
    if (request.nextUrl.pathname === '/api/admin/login' || request.nextUrl.pathname === '/api/admin/test-auth') {
      return NextResponse.next();
    }

    // For all other admin API routes, require authentication
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      // Invalid token, clear cookie and return 401
      const response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
      response.cookies.delete('admin-token');
      return response;
    }

    // Check if user has admin role
    if (!payload.roles || !payload.roles.includes('admin')) {
      const response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
      response.cookies.delete('admin-token');
      return response;
    }

    // Allow access to admin API routes
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
