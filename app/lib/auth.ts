import { NextRequest, NextResponse } from "next/server";

export function isAuthenticated(req: NextRequest) {
  // Check for authentication cookie
  const authCookie = req.cookies.get("auth")?.value;
  if (authCookie === "true") {
    return true;
  }

  // Check for API key in headers
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const correctPassword = process.env.LOGIN_PASSWORD;

    // Make sure the password is set
    if (!correctPassword) {
      console.error("LOGIN_PASSWORD environment variable is not set");
      return false;
    }

    return token === correctPassword;
  }

  return false;
}

export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async function (req: NextRequest) {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req);
  };
}
