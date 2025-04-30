"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <div
        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

interface StoredData {
  text: string;
  embedding: number[];
}

export default function RagBuilder() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedData, setStoredData] = useState<Map<string, StoredData>>(
    new Map()
  );
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/rag-builder/ask",
      onError: (error) => {
        setError(error.message);
      },
    });

  const fetchStoredData = async () => {
    try {
      const response = await fetch("/api/rag-builder/store");
      if (response.ok) {
        const data = await response.json();
        setStoredData(new Map(Object.entries(data)));
      }
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const handleStoreData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate embedding using the embeddings generator API
      const embeddingResponse = await fetch("/api/embeddings-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!embeddingResponse.ok) {
        throw new Error("Failed to generate embedding");
      }

      const { embeddings } = await embeddingResponse.json();

      const response = await fetch("/api/rag-builder/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, embedding: embeddings }),
      });

      if (!response.ok) {
        throw new Error("Failed to store data");
      }

      // Clear the form and refresh stored data
      setText("");
      await fetchStoredData();
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error storing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">RAG Builder</h1>
          <p className="mt-2 text-muted-foreground">
            Build your own RAG system with local storage
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Store Text</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStoreData} className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to store..."
                className="min-h-[100px]"
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Storing..." : "Store Data"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stored Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(storedData.entries()).map(([id, data]) => (
                <div key={id} className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Text:</div>
                  <div className="whitespace-pre-wrap">{data.text}</div>
                </div>
              ))}
              {storedData.size === 0 && (
                <div className="text-center text-muted-foreground">
                  No data stored yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ask Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary/10 ml-auto"
                        : "bg-muted"
                    } max-w-[80%] ${
                      message.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {message.role === "user" ? "You" : "AI"}
                    </div>
                    <div>{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="p-4 rounded-lg bg-muted max-w-[80%] mr-auto">
                    <div className="font-semibold mb-1">AI</div>
                    <LoadingDots />
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  placeholder="Ask a question about the stored text..."
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button type="submit" className="cursor-pointer">
                  Send
                </Button>
              </form>
            </div>
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
      </div>
    </div>
  );
}
