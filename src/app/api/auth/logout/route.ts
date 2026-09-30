import { NextRequest } from "next/server";
import {
  getCurrentUser,
  revokeSession,
  clearSessionCookie,
  createAuditLog,
} from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/errors";
import { getIpFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const auth = await getCurrentUser();

    if (auth) {
      await revokeSession(auth.sessionId, auth.user.id);
      await createAuditLog({
        userId: auth.user.id,
        action: "user.logout",
        ipAddress: getIpFromRequest(request),
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
    }

    await clearSessionCookie();

    return apiSuccess({ message: "Logged out successfully" });
  } catch (error) {
    return apiError(error);
  }
}
