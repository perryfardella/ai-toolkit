import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Define the recipe schema using Zod
const recipeSchema = z.object({
  title: z.string().describe("A descriptive name for the recipe"),
  description: z
    .string()
    .describe(
      "A brief overview of the recipe, including its key characteristics, flavor profile, and any notable features"
    ),
  prepTime: z
    .string()
    .describe(
      "Estimated preparation time in minutes or hours (e.g., '15 minutes', '1 hour')"
    ),
  cookTime: z
    .string()
    .describe(
      "Estimated cooking time in minutes or hours (e.g., '30 minutes', '2 hours')"
    ),
  servings: z.number().describe("Number of servings the recipe yields"),
  ingredients: z
    .array(z.string())
    .describe(
      "List of ingredients with precise measurements and preparation notes where needed (e.g., '2 cups all-purpose flour, sifted', '1 large onion, finely diced')"
    ),
  instructions: z
    .array(z.string())
    .describe(
      "Step-by-step cooking instructions, each step should be clear and actionable"
    ),
  tips: z
    .array(z.string())
    .optional()
    .describe(
      "Optional cooking tips, substitution suggestions, or storage recommendations"
    ),
  nutrition: z
    .object({
      calories: z.number().describe("Total calories per serving"),
      protein: z.number().describe("Protein content in grams per serving"),
      fat: z.number().describe("Total fat content in grams per serving"),
      carbohydrates: z
        .number()
        .describe("Total carbohydrates in grams per serving"),
      fiber: z.number().describe("Dietary fiber in grams per serving"),
      sugar: z.number().describe("Total sugar content in grams per serving"),
      sodium: z.number().describe("Sodium content in milligrams per serving"),
    })
    .describe("Nutritional information per serving"),
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { foodItem, additionalInfo } = await req.json();

    if (!foodItem) {
      return new Response(JSON.stringify({ error: "Food item is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { object: recipe } = await generateObject({
      model: openai("gpt-3.5-turbo"),
      schema: recipeSchema,
      prompt: `Generate a detailed recipe for ${foodItem}. ${
        additionalInfo
          ? `Consider these additional requirements: ${additionalInfo}.`
          : ""
      } Include a title, description, prep time, cook time, number of servings, list of ingredients, step-by-step instructions (not numbered), and optional cooking tips. Use metric units. If the prompt is not clear, just return "No recipe found"`,
      system: `You are a professional chef and recipe writer. Create a detailed, easy-to-follow recipe that is both delicious and practical. Make sure to include all necessary information and be precise with measurements and instructions. Consider any dietary restrictions or preferences provided by the user.`,
    });

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate recipe" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
