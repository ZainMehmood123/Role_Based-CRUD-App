import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/login', '/signup', '/'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const { pathname } = req.nextUrl;

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded: any = jwt.verify(token, 'supersecretkey123'); // same as backend JWT_SECRET

    // Handle role-based redirection
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Blocked users can't access protected routes
    if (decoded.isBlocked) {
      const blockedUrl = new URL('/login', req.url);
      blockedUrl.searchParams.set('error', 'blocked');
      return NextResponse.redirect(blockedUrl);
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Enable middleware on all routes
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/posts/:path*'],
};
