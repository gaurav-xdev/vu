import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateProfileSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError, AuthError } from "@/lib/errors";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth) throw new AuthError();

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
      .where(eq(users.id, auth.user.id))
      .limit(1);

    if (!user) throw new AuthError();

    return apiSuccess({ user });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = nanoid(12);
  try {
    const auth = await getCurrentUser();
    if (!auth) throw new AuthError();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(new Error("Invalid JSON body"), requestId);
    }

    const input = updateProfileSchema.parse(body);

    const [updated] = await db
      .update(users)
      .set({
        displayName: input.displayName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, auth.user.id))
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        plan: users.plan,
      });

    return apiSuccess({ user: updated });
  } catch (error) {
    return apiError(error, requestId);
  }
}
