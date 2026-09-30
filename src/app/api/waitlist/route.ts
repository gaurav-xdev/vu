import { NextRequest } from "next/server";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { waitlistSchema } from "@/lib/validation";
import { rateLimit, rateLimitConfigs, getIpFromRequest } from "@/lib/rate-limit";
import { apiSuccess, apiError, ConflictError, RateLimitError } from "@/lib/errors";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const requestId = nanoid(12);
  const ip = getIpFromRequest(request);

  try {
    const rl = await rateLimit(`waitlist:${ip}`, rateLimitConfigs.waitlist);
    if (!rl.success) throw new RateLimitError(rl.resetAt);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(new Error("Invalid JSON body"), requestId);
    }

    const input = waitlistSchema.parse(body);

    // Check for existing entry
    const [existing] = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, input.email))
      .limit(1);

    if (existing) {
      // Don't reveal they're already on list — just say thanks
      return apiSuccess({
        message: "You're on the list. We'll be in touch.",
        alreadyRegistered: true,
      });
    }

    // Get current position
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(waitlist);

    const position = Number(total) + 1;

    const [entry] = await db
      .insert(waitlist)
      .values({
        email: input.email,
        name: input.name ?? null,
        useCase: input.useCase ?? null,
        position,
        referrer: request.headers.get("referer")?.slice(0, 200) ?? null,
      })
      .returning({ id: waitlist.id, position: waitlist.position });

    return apiSuccess(
      {
        message: "You're on the waitlist. We'll be in touch.",
        position: entry.position,
      },
      201
    );
  } catch (error) {
    return apiError(error, requestId);
  }
}
