"use client";

import { useChat } from "@ai-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function InternetSearchChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    // uses the chat route by default (api/chat)
    useChat();
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Chat, with internet search
          </h1>
          <p className="mt-2 text-muted-foreground">
            Have a conversation with our AI assistant, with the ability to
            search the internet
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
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
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                    }
                  })}
                </div>
              ))}
              {isLoading && (
                <div className="p-4 rounded-lg bg-muted max-w-[80%] mr-auto">
                  <div className="font-semibold mb-1">AI</div>
                  <LoadingDots />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" className="cursor-pointer">
            Send
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            title="Toggle internet search"
          >
            🔍 Enable internet search
          </Button>
        </form>
      </div>
    </div>
  );
}
