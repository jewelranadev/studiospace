import { NextResponse } from "next/server";

// Pages that only logged-in users can open
const protectedRoutes = [
  "/dashboard",
  "/my-listings",
  "/my-bookings",
  "/edit-studio",
];

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Optimistic check only: look for the Better Auth session cookie.
  // The real session check always happens again on the server.
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("better-auth.session_token"));

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
