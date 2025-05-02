import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow up to 30 seconds for image generation
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response("Prompt is required", { status: 400 });
  }

  try {
    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
    });

    return Response.json({
      url: image,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
