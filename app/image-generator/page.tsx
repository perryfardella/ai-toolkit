"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState<{
    base64Data: string;
    mimeType: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageData(null);

    try {
      const response = await fetch("/api/image-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageData(data.url);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageData) return;

    // Create a download link
    const link = document.createElement("a");
    link.href = `data:${imageData.mimeType};base64,${imageData.base64Data}`;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Image Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Generate images using DALL-E 3
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </form>

            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {imageData && (
              <div className="space-y-4">
                <div className="relative aspect-square w-full max-w-2xl mx-auto">
                  <img
                    src={`data:${imageData.mimeType};base64,${imageData.base64Data}`}
                    alt="Generated image"
                    className="rounded-lg object-contain w-full h-full"
                  />
                </div>
                <div className="text-center">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Download Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
