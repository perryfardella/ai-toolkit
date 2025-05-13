import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.LOGIN_PASSWORD;

    // Make sure the password is set
    if (!correctPassword) {
      console.error("LOGIN_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      // Set authentication cookie
      (await cookies()).set({
        name: "auth",
        value: "true",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        // Set expiration to 7 days
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  // Clear the auth cookie
  (await cookies()).delete("auth");
  return NextResponse.json({ success: true });
}
