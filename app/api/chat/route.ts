import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, internetSearch = false } = await req.json();

  const result = streamText({
    model: internetSearch
      ? openai.responses("gpt-4o")
      : openai("gpt-3.5-turbo"),
    messages,
    tools: internetSearch
      ? {
          web_search_preview: openai.tools.webSearchPreview(),
        }
      : undefined,
  });

  return result.toDataStreamResponse();
}
