import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError, AuthError } from "@/lib/errors";

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth) throw new AuthError();

    return apiSuccess({ user: auth.user });
  } catch (error) {
    return apiError(error);
  }
}
