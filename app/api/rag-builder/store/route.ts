import { NextResponse } from "next/server";
import { getAllEntries, addEntry } from "@/app/lib/rag-storage";

export async function GET() {
  try {
    // Get all entries from the storage utility
    const data = getAllEntries();
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

    // Add entry using the storage utility
    const id = addEntry(text, embedding);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error storing data:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}
