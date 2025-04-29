import { NextResponse } from "next/server";

// In-memory storage for our RAG system
export const storage = new Map<string, { text: string; embedding: number[] }>();

export async function GET() {
  try {
    // Convert Map to plain object for JSON serialization
    const data = Object.fromEntries(storage);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stored data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stored data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { text, embedding } = await req.json();

    if (!text || !embedding) {
      return NextResponse.json(
        { error: "Text and embedding are required" },
        { status: 400 }
      );
    }

    // Generate a unique ID for this entry
    const id = Math.random().toString(36).substring(7);
    storage.set(id, { text, embedding });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error storing data:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}
