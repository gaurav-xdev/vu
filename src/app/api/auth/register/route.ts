import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { registerSchema } from "@/lib/validation";
import {
  hashPassword,
  createSession,
  setSessionCookie,
  createAuditLog,
} from "@/lib/auth";
import { rateLimit, rateLimitConfigs, getIpFromRequest } from "@/lib/rate-limit";
import { apiSuccess, apiError, ConflictError, RateLimitError } from "@/lib/errors";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const requestId = nanoid(12);
  const ip = getIpFromRequest(request);

  try {
    // Rate limiting per IP
    const rl = await rateLimit(`register:${ip}`, rateLimitConfigs.auth);
    if (!rl.success) throw new RateLimitError(rl.resetAt);

    // Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(new Error("Invalid JSON body"), requestId);
    }

    const input = registerSchema.parse(body);

    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existing) {
      throw new ConflictError(
        "An account with this email already exists. Please sign in."
      );
    }

    const passwordHash = await hashPassword(input.password);

    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        displayName: input.displayName ?? null,
        plan: "free",
      })
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        plan: users.plan,
      });

    // Create session
    const jwt = await createSession(user.id, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: ip,
    });

    await setSessionCookie(jwt);

    await createAuditLog({
      userId: user.id,
      action: "user.register",
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return apiSuccess(
      {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          plan: user.plan,
        },
      },
      201
    );
  } catch (error) {
    return apiError(error, requestId);
  }
}
