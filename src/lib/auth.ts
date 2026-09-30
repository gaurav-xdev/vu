import { db } from "@/db";
import { users, sessions, auditLogs } from "@/db/schema";
import { eq, and, gt, lt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { createHash } from "crypto";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production-min-32-chars";
const ENCODED_SECRET = new TextEncoder().encode(SECRET);
const SESSION_COOKIE = "vx_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const BCRYPT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// ─── Password ──────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Token ────────────────────────────────────────────────────────────────────

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ─── Session Creation ─────────────────────────────────────────────────────────

export async function createSession(
  userId: string,
  { userAgent, ipAddress }: { userAgent?: string; ipAddress?: string }
): Promise<string> {
  const token = nanoid(64);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    userAgent: userAgent?.slice(0, 500),
    ipAddress: ipAddress?.slice(0, 50),
    expiresAt,
    status: "active",
  });

  // Sign a JWT containing only the raw token (not the hash)
  const jwt = await new SignJWT({ token })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(ENCODED_SECRET);

  return jwt;
}

// ─── Set Session Cookie ───────────────────────────────────────────────────────

export async function setSessionCookie(jwt: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
}

// ─── Clear Session Cookie ─────────────────────────────────────────────────────

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get(SESSION_COOKIE)?.value;
    if (!jwt) return null;

    const { payload } = await jwtVerify(jwt, ENCODED_SECRET);
    const rawToken = payload.token as string;
    if (!rawToken) return null;

    const tokenHash = hashToken(rawToken);

    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenHash, tokenHash),
          eq(sessions.status, "active"),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) return null;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        emailVerified: users.emailVerified,
        plan: users.plan,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.id, session.userId)))
      .limit(1);

    if (!user) return null;
    return { user, sessionId: session.id };
  } catch {
    return null;
  }
}

// ─── Revoke Session ───────────────────────────────────────────────────────────

export async function revokeSession(sessionId: string, userId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ status: "revoked", revokedAt: new Date() })
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
}

// ─── Revoke All User Sessions ─────────────────────────────────────────────────

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ status: "revoked", revokedAt: new Date() })
    .where(eq(sessions.userId, userId));
}

// ─── Login Attempt Tracking ───────────────────────────────────────────────────

export async function checkAndIncrementLoginAttempts(
  email: string
): Promise<{ allowed: boolean; lockedUntil?: Date }> {
  const [user] = await db
    .select({ failedLoginAttempts: users.failedLoginAttempts, lockedUntil: users.lockedUntil })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) return { allowed: true };

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { allowed: false, lockedUntil: user.lockedUntil };
  }

  return { allowed: true };
}

export async function recordFailedLogin(email: string): Promise<void> {
  const [user] = await db
    .select({ id: users.id, failedLoginAttempts: users.failedLoginAttempts })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) return;

  const newAttempts = (user.failedLoginAttempts ?? 0) + 1;
  const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

  await db
    .update(users)
    .set({
      failedLoginAttempts: newAttempts,
      lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));
}

export async function clearFailedLoginAttempts(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ failedLoginAttempts: 0, lockedUntil: null, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export async function createAuditLog(params: {
  userId?: string;
  action: typeof auditLogs.$inferInsert["action"];
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: params.userId,
      action: params.action,
      ipAddress: params.ipAddress?.slice(0, 50),
      userAgent: params.userAgent?.slice(0, 500),
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    });
  } catch {
    // Audit log failure must not break the primary operation
    console.error("[audit] Failed to create audit log:", params.action);
  }
}
