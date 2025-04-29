"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the AI Toolkit</h1>
      <Link href="/chat">Chat</Link>
    </div>
  );
}
