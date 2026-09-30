import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: Date) {
    super("Too many requests. Please try again later.", 429, "RATE_LIMITED");
    if (retryAfter) {
      this.retryAfter = retryAfter;
    }
  }
  retryAfter?: Date;
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

// ─── API Response Helpers ─────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  error: unknown,
  requestId?: string
): NextResponse {
  // Never expose internal error details in production
  const isProd = process.env.NODE_ENV === "production";

  if (error instanceof ZodError) {
    const issues = error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        issues,
        requestId,
      },
      { status: 400 }
    );
  }

  if (error instanceof RateLimitError) {
    const headers: Record<string, string> = {};
    if (error.retryAfter) {
      headers["Retry-After"] = String(
        Math.ceil((error.retryAfter.getTime() - Date.now()) / 1000)
      );
    }
    return NextResponse.json(
      { success: false, error: error.message, code: error.code, requestId },
      { status: 429, headers }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code, requestId },
      { status: error.statusCode }
    );
  }

  // Unexpected errors — log internally, don't expose
  const message = error instanceof Error ? error.message : "Unknown error";
  if (!isProd) {
    console.error("[api-error]", message, error);
  } else {
    console.error("[api-error]", requestId, (error as Error)?.name);
  }

  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred. Please try again.",
      requestId,
    },
    { status: 500 }
  );
}
