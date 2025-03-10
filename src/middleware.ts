// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// import { AUTH_TOKEN_KEY } from './constants/common';

// const privateRoutes = ['/order', '/custom-link'];

export async function middleware(_request: NextRequest) {
  // const cookieStore = await cookies();
  // const cookie = cookieStore.get(AUTH_TOKEN_KEY);
  // const url = request.nextUrl.clone();
  // if (!cookie && url.pathname.includes('/login')) return NextResponse.next();

  // if (cookie && (url.pathname.includes('/login') || url.pathname === '/')) {
  //   url.pathname = '/order';
  //   url.search = '';

  //   return NextResponse.redirect(url);
  // }

  // if (!cookie && (privateRoutes.includes(url.pathname) || url.pathname === '/')) {
  //   url.pathname = '/login';
  //   url.search = '';

  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
