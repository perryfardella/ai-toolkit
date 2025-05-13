import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth";

async function handler() {
  // This route is protected by the withAuth middleware
  // Only authenticated users can access it

  return NextResponse.json({
    message: "This is protected data",
    timestamp: new Date().toISOString(),
  });
}

// Wrap the handler with the auth middleware
export const GET = withAuth(handler);
