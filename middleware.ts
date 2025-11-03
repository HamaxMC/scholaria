import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/auth";

// Add roles that have access to each route pattern
const routeRoleMap: Record<string, UserRole[]> = {
  "/dashboard/student": ["student"],
  "/dashboard/teacher": ["teacher"],
  "/dashboard/coordinator": ["coordinator"],
  "/dashboard/secretary": ["secretary"],
  "/dashboard/parent": ["parent"],
};

export const proxy = async (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;

  // If there's no session and we're not on the auth pages, redirect to login
  if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Protect dashboard routes based on user role
  if (request.nextUrl.pathname.startsWith("/dashboard/")) {
    try {
      // In a real app, you would verify the session token with Firebase Admin SDK
      // and get the user's role from your database
      const userRole = "student"; // This should come from your auth verification

      const allowedRoles = Object.entries(routeRoleMap).find(([pattern]) =>
        request.nextUrl.pathname.startsWith(pattern)
      )?.[1];

      if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
};

// Backwards-compatible middleware export: some Next.js parts (and Turbopack)
// still look for a `middleware` function. Expose it and delegate to `proxy`.
export function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
