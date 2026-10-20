import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "devpulse_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "devpulse_super_secret_session_encryption_key_min_32_characters";
  return new TextEncoder().encode(secret.padEnd(32, "!"));
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = getSecretKey();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = token ? await verifyToken(token) : false;

  // 1. If user is trying to access protected dashboard routes without valid auth
  const isDashboardRoute = pathname.startsWith("/dashboard");
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in and visiting /login or /signup, redirect to /dashboard
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};
