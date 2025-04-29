"use client";

import { useState } from "react";

export default function VibeChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/vibe-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error analyzing text");
      }

      setResult(data.sentiment);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error analyzing text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4">Vibe Checker</h1>
      <h2 className="mb-4">
        Analyze your text and get a response if the vibe is positive, negative,
        or neutral.
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl dark:bg-zinc-900"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze..."
          rows={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Text"}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 border border-zinc-300 dark:border-zinc-800 rounded">
          <h2 className="font-semibold mb-2">Result:</h2>
          <p className="capitalize">{result}</p>
        </div>
      )}
    </div>
  );
}
