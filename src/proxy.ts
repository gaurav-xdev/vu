import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ─── Security Headers ───────────────────────────────────────────────────────

  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS (production only)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );

  // Content Security Policy
  // Note: Three.js/WebGL requires 'unsafe-eval' for shader compilation in some browsers.
  // We scope it to script-src only and restrict everything else.
  const cspDirectives = [
    "default-src 'self'",
    // unsafe-eval is required by Three.js GLSL shader compilation
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    "connect-src 'self' https://api.stripe.com wss:",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  // ─── CORS — API routes ───────────────────────────────────────────────────────

  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Request-ID"
    );

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  // ─── Protected Routes ────────────────────────────────────────────────────────

  const protectedRoutes = ["/dashboard", "/account", "/billing"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const sessionCookie = request.cookies.get("vx_session");
    if (!sessionCookie) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ─── Auth Routes — redirect if already authenticated ─────────────────────────

  const authRoutes = ["/auth/login", "/auth/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    const sessionCookie = request.cookies.get("vx_session");
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
