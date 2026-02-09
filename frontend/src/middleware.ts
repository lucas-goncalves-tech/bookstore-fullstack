import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/orders", "/checkout", "/admin", "/my-reviews"];

// Routes that are only for non-authenticated users (login/register)
const AUTH_ROUTES = ["/auth"];

// Cookie names (must match backend exactly)
const isProduction = process.env.NODE_ENV === "production";
const SID_REFRESH_COOKIE = isProduction
  ? "__Secure-refresh-sid"
  : "refresh-sid";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for refresh token cookie
  const refreshToken = request.cookies.get(SID_REFRESH_COOKIE)?.value;

  // User is considered "authenticated" if they have at least the refresh token
  // The access token may be expired, but refresh can renew it
  const isAuthenticated = !!refreshToken;

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if current route is an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
