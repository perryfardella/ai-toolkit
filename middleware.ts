import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.get("auth")?.value === "true";
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Public paths that don't require authentication
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // API paths that need separate protection
  const isApiPath = request.nextUrl.pathname.startsWith("/api");

  // If it's an API path, we'll handle auth in the API route
  if (isApiPath) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access login page
  if (isAuthenticated && isLoginPage) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the paths that middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
