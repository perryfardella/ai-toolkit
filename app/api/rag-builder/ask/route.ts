import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { embed, streamText, cosineSimilarity } from "ai";

// Import the storage from the store route
import { storage } from "../store/route";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }

    const question = lastUserMessage.parts[0].text;

    // Generate embedding for the question
    const { embedding: questionEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: question,
    });

    // Find the most relevant text
    let maxSimilarity = -1;
    let mostRelevantText = "";

    for (const [, data] of storage) {
      const similarity = cosineSimilarity(questionEmbedding, data.embedding);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostRelevantText = data.text;
      }
    }

    // If no relevant text is found, return a helpful response
    if (!mostRelevantText) {
      const result = streamText({
        model: openai("gpt-3.5-turbo"),
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. When you don't have enough information to answer a question, explain this politely and suggest storing relevant information first.",
          },
          { role: "user", content: question },
        ],
      });

      return result.toDataStreamResponse();
    }

    // Use the AI to answer the question based on the relevant text
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: `Answer the question based on the following context. If you can't answer based on the context, say "I don't have enough information to answer that question."\n\nContext: ${mostRelevantText}`,
        },
        { role: "user", content: question },
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error processing question:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
