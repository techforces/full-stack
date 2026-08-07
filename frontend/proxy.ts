import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Must match backend's AUTH_COOKIE_NAME (backend/src/auth.ts)
const AUTH_COOKIE_NAME = "token";
const AUTH_ROUTES = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const isAuthenticated = Boolean(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );
  const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname);

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)",
  ],
};
