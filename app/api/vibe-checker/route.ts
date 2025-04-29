import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export async function POST(req: Request) {
  const { text } = await req.json();

  const { object } = await generateObject({
    model: openai("gpt-3.5-turbo"),
    output: "enum",
    enum: ["positive", "negative", "neutral"],
    prompt: text,
    system: `Classify the sentiment of the text as one of the given enum values.`,
  });

  return new Response(JSON.stringify({ sentiment: object }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
