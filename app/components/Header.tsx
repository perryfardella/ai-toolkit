import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">AI Toolkit</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/chat"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Chat
            </Link>
            <Link
              href="/vibe-checker"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Vibe Checker
            </Link>
            <Link
              href="/embeddings-generator"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Embeddings Generator
            </Link>
            <Link
              href="/rag-builder"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              RAG Builder
            </Link>
            <Link
              href="/image-generator"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Image Generator
            </Link>
            <Link
              href="/deepseek-chat"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Deepseek Chat
            </Link>
            <Link
              href="/recipe-generator"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Recipe Generator
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
