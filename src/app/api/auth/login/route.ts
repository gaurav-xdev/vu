import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/validation";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  createAuditLog,
  checkAndIncrementLoginAttempts,
  recordFailedLogin,
  clearFailedLoginAttempts,
} from "@/lib/auth";
import { rateLimit, rateLimitConfigs, getIpFromRequest } from "@/lib/rate-limit";
import {
  apiSuccess,
  apiError,
  AppError,
  RateLimitError,
} from "@/lib/errors";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const requestId = nanoid(12);
  const ip = getIpFromRequest(request);

  try {
    // Rate limit per IP
    const rl = await rateLimit(`login:${ip}`, rateLimitConfigs.auth);
    if (!rl.success) throw new RateLimitError(rl.resetAt);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(new Error("Invalid JSON body"), requestId);
    }

    const input = loginSchema.parse(body);

    // Check account lock
    const lockCheck = await checkAndIncrementLoginAttempts(input.email);
    if (!lockCheck.allowed) {
      const minutesLeft = lockCheck.lockedUntil
        ? Math.ceil((lockCheck.lockedUntil.getTime() - Date.now()) / 60000)
        : 15;
      throw new AppError(
        `Account temporarily locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.`,
        429,
        "ACCOUNT_LOCKED"
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    // Constant-time comparison even if user doesn't exist
    const passwordValid = user
      ? await verifyPassword(input.password, user.passwordHash)
      : await verifyPassword(input.password, "$2b$12$invalidhash000000000000000000000000");

    if (!user || !passwordValid) {
      if (user) await recordFailedLogin(input.email);
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    // Clear failed attempts on success
    await clearFailedLoginAttempts(user.id);

    const jwt = await createSession(user.id, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: ip,
    });

    await setSessionCookie(jwt);

    await createAuditLog({
      userId: user.id,
      action: "user.login",
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        plan: user.plan,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    return apiError(error, requestId);
  }
}
