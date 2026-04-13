import { NextResponse } from 'next/server';

export function  middleware(request) {
 
  const cookie =  request.cookies.get("auth_token"); 
  const token = cookie?.value; 

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {

  matcher: ['/category', '/category/:path*'],
};