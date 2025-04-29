"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface StoredData {
  text: string;
  embedding: number[];
}

export default function RagBuilder() {
  const [text, setText] = useState("");
  const [embedding, setEmbedding] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedData, setStoredData] = useState<Map<string, StoredData>>(
    new Map()
  );
  const { messages, input, handleInputChange, handleSubmit } = useChat({
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
      const embeddingArray = JSON.parse(embedding);
      if (!Array.isArray(embeddingArray)) {
        throw new Error("Embedding must be a valid array");
      }

      const response = await fetch("/api/rag-builder/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, embedding: embeddingArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to store data");
      }

      // Clear the form and refresh stored data
      setText("");
      setEmbedding("");
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
            <CardTitle>Store Text and Embeddings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStoreData} className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to store..."
                className="min-h-[100px]"
              />
              <Textarea
                value={embedding}
                onChange={(e) => setEmbedding(e.target.value)}
                placeholder="Enter embedding array (JSON format)..."
                className="min-h-[100px] font-mono"
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
                  <div className="mb-4 whitespace-pre-wrap">{data.text}</div>
                  <div className="font-semibold mb-2">Embedding:</div>
                  <div className="font-mono text-sm overflow-x-auto">
                    {JSON.stringify(data.embedding, null, 2)}
                  </div>
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
