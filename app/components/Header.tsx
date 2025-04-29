import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            <span>AI Toolkit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
