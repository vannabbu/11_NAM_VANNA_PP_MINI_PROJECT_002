import { auth } from "./auth";
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/category', '/category/:path*'],
};