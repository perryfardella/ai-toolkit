"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", { method: "GET" });
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.refresh();
    } catch {
      console.error("Logout failed");
    }
  };

  const navLinks = [
    { href: "/chat", label: "Chat" },
    { href: "/vibe-checker", label: "Vibe Checker" },
    { href: "/embeddings-generator", label: "Embeddings Generator" },
    { href: "/rag-builder", label: "RAG Builder" },
    { href: "/image-generator", label: "Image Generator" },
    { href: "/deepseek-chat", label: "Deepseek Chat" },
    { href: "/recipe-generator", label: "Recipe Generator" },
    { href: "/text-to-speech", label: "Text to Speech" },
    { href: "/speech-to-text", label: "Transcribe Audio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">AI Toolkit</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-1 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
              aria-label="Toggle tools menu"
            >
              <span>Tools</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <nav className="absolute top-full right-0 mt-1 w-56 rounded-md border bg-background shadow-lg">
                <div className="p-2">
                  <div className="flex flex-col space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
