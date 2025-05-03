"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
}

export default function RecipeGenerator() {
  const [foodItem, setFoodItem] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim()) return;

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch("/api/recipe-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodItem }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError("Failed to generate recipe. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Recipe Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Generate detailed recipes for any food item
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate a Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                placeholder="Enter a food item (e.g., chocolate chip cookies, beef stew)..."
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-destructive">{error}</div>
            </CardContent>
          </Card>
        )}

        {recipe && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{recipe.title}</CardTitle>
              <p className="text-muted-foreground">{recipe.description}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>Prep Time: {recipe.prepTime}</div>
                <div>Cook Time: {recipe.cookTime}</div>
                <div>Servings: {recipe.servings}</div>
              </div>
              <div className="mt-4">
                <div className="text-lg font-semibold">Macros per Serving</div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Calories
                    </div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.calories}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Protein</div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.protein}g
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Fat</div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.fat}g
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Carbs</div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.carbohydrates}g
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Fiber</div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.fiber}g
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Sugar</div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.sugar}g
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Sodium</div>
                    <div className="text-lg font-semibold">
                      {recipe.nutrition.sodium}mg
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="text-foreground">
                      {instruction}
                    </div>
                  ))}
                </div>
              </div>

              {recipe.tips && recipe.tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tips</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {recipe.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
