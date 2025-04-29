"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function EmbeddingsGenerator() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [embeddings, setEmbeddings] = useState<number[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmbeddings(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/embeddings-generator", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ text }),
      // });
      // const data = await response.json();
      // setEmbeddings(data.embeddings);

      // Placeholder for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmbeddings([0.1, 0.2, 0.3]); // Example embeddings
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Embeddings Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Generate embeddings for your text
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Embeddings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setText(e.target.value)
                }
                placeholder="Enter text to generate embeddings..."
                className="min-h-[200px]"
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Embeddings"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {embeddings && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Embeddings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm overflow-x-auto">
                {JSON.stringify(embeddings, null, 2)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
