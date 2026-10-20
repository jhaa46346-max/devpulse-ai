import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const SESSION_COOKIE_NAME = "devpulse_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "devpulse_super_secret_session_encryption_key_min_32_characters";
  return new TextEncoder().encode(secret.padEnd(32, "!"));
}

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
  role: string;
  exp?: number;
}

// Sign and generate JWT token
export async function signSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const secret = getSecretKey();
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

// Verify JWT token
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | null,
      role: (payload.role as string) || "developer",
    };
  } catch {
    return null;
  }
}

// Create a database-backed session & return token
export async function createSession(user: {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
}): Promise<string> {
  const role = user.role || "developer";
  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role,
  });

  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  // Store in Session table
  await db.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return token;
}

// Set session cookie in Server Action or Route Handler
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

// Clear session cookie and delete DB session record
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await db.session.deleteMany({
        where: { token },
      });
    } catch {
      // Ignore if already deleted
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Extract and verify current user from cookies (for Server Components & Route Handlers)
export async function getCurrentUser(request?: NextRequest) {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  // Verify user still exists in database
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  return user;
}
