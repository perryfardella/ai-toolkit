# AI Toolkit

A Next.js application built with Vercel's AI SDK to explore and learn about AI capabilities. This project serves as a practical learning tool for understanding how to integrate AI features into web applications.

## Features

- Built with Next.js 15 and React 19
- Utilizes Vercel's AI SDK for AI-powered features
- Modern UI with Tailwind CSS
- TypeScript for type safety
- Turbopack for fast development experience

### Pages

- **Chat**: A conversational interface that allows you to interact with AI through natural language, perfect for general queries and discussions. Includes real-time internet search capabilities for up-to-date information.
- **Vibe Checker**: Analyze the mood and tone of any text input, helping you understand the emotional context of written content.
- **Embeddings Generator**: Convert text into vector embeddings, which are essential for various AI applications like semantic search and similarity matching.
- **RAG Builder**: Create and interact with your own Retrieval-Augmented Generation system, allowing you to build custom knowledge bases and query them using natural language.
- **Image Generator**: Generate high-quality images from text descriptions using DALL-E 3, with the ability to download and save your creations.
- **Deepseek Chat**: A specialized chat interface powered by the Deepseek model, offering alternative AI conversation capabilities.
- **Recipe Generator**: Create detailed recipes from ingredients, including preparation time, cooking time, servings, ingredients list, step-by-step instructions, and nutritional information.
- **Text to Speech**: Convert text into natural-sounding speech with multiple voice options, including Alloy, Echo, Fable, Onyx, Nova, and Shimmer.
- **Speech to Text** : Convert audio into text.

## Prerequisites

- Node.js (LTS version recommended)
- pnpm package manager
- OpenAI API key

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the root directory and add your OpenAI & Deepseek API key:

   ```env
   OPENAI_API_KEY=your_api_key_here
   DEEPSEEK_API_KEY=your_api_key_here
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## License

This project is open source and available under the MIT License.
