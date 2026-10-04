import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'pathfinder-jwt-super-secret-key-2026-secure-token'
);

const PROTECTED_ROUTES = [
  '/dashboard',
  '/pathfinder',
  '/network',
  '/suggestions',
  '/search',
  '/profile',
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check auth token from cookie or Authorization header
  const token =
    request.cookies.get('pathfinder_token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = (payload as any).role;

    // RBAC: Check Admin privileges
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      );
    }

    // Pass user context forward in request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.userId));
    requestHeaders.set('x-user-role', String(userRole));
    requestHeaders.set('x-user-email', String(payload.email));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pathfinder/:path*',
    '/network/:path*',
    '/suggestions/:path*',
    '/search/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};
