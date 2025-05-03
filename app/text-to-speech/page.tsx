"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VOICES = [
  { id: "alloy", name: "Alloy - Clear and Neutral" },
  { id: "echo", name: "Echo - Warm and Friendly" },
  { id: "fable", name: "Fable - Deep and Resonant" },
  { id: "onyx", name: "Onyx - Smooth and Professional" },
  { id: "nova", name: "Nova - Bright and Energetic" },
  { id: "shimmer", name: "Shimmer - Soft and Gentle" },
];

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const data = await response.json();

      // Create a blob URL from the base64 audio data
      const audioBlob = new Blob([Buffer.from(data.audio, "base64")], {
        type: "audio/mpeg",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Text to Speech</h1>
          <p className="mt-2 text-muted-foreground">
            Convert your text into natural-sounding speech
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Convert Text to Speech</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="min-h-[200px]"
                disabled={isLoading}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Voice</label>
                <Select
                  value={voice}
                  onValueChange={setVoice}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Speech"
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

        {audioUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Speech</CardTitle>
            </CardHeader>
            <CardContent>
              <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
