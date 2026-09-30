import { db } from "@/db";
import { rateLimitStore } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Simple DB-backed rate limiter.
 * For production at scale, replace with Redis/Upstash.
 */
export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + config.windowMs);

  try {
    const [existing] = await db
      .select()
      .from(rateLimitStore)
      .where(eq(rateLimitStore.key, key))
      .limit(1);

    if (!existing || existing.resetAt < now) {
      // New window
      await db
        .insert(rateLimitStore)
        .values({ key, count: 1, resetAt })
        .onConflictDoUpdate({
          target: rateLimitStore.key,
          set: { count: 1, resetAt },
        });

      return { success: true, remaining: config.maxRequests - 1, resetAt };
    }

    if (existing.count >= config.maxRequests) {
      return { success: false, remaining: 0, resetAt: existing.resetAt };
    }

    await db
      .update(rateLimitStore)
      .set({ count: existing.count + 1 })
      .where(eq(rateLimitStore.key, key));

    return {
      success: true,
      remaining: config.maxRequests - existing.count - 1,
      resetAt: existing.resetAt,
    };
  } catch {
    // Fail open — don't block users if rate limit store is unavailable
    return { success: true, remaining: config.maxRequests, resetAt };
  }
}

// Preset configurations
export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  api: { windowMs: 60 * 1000, maxRequests: 60 },
  waitlist: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
} as const;

export function getIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
