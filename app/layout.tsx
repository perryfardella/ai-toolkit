import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Toolkit",
  description:
    "A comprehensive toolkit for exploring and learning about AI capabilities, featuring chat, vibe checking, embeddings generation, and RAG systems.",
  keywords: [
    "AI",
    "Next.js",
    "Vercel AI SDK",
    "Chat",
    "Embeddings",
    "RAG",
    "Machine Learning",
  ],
  authors: [{ name: "AI Toolkit Team" }],
  creator: "AI Toolkit Team",
  openGraph: {
    title: "AI Toolkit",
    description:
      "A comprehensive toolkit for exploring and learning about AI capabilities",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Toolkit",
    description:
      "A comprehensive toolkit for exploring and learning about AI capabilities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="mt-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
