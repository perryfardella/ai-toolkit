import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text) {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Generating embedding for text:", text);

  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    });

    console.log("Generated embedding:", embedding);

    return new Response(JSON.stringify({ embeddings: embedding }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate embedding" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
