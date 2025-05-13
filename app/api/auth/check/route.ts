import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Check if the auth cookie exists
  const authCookie = request.cookies.get("auth")?.value;

  if (authCookie === "true") {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
