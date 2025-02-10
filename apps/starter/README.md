# @acme/starter

A modern TypeScript-based Node.js application template with comprehensive tooling and integrations.

## Features

- 🚀 **TypeScript** - Full TypeScript support with strict type checking
- 🔄 **Hot Reload** - Development with automatic reloading
- 🐳 **Docker Support** - Containerization ready with Docker and docker-compose
- 🛠️ **API Integration** - Built-in support for:
  - Discord.js
  - Twitter API
  - Solana Web3
  - Tavily API
- 🌐 **Web Framework** - Koa.js with essential middleware:
  - Body parsing
  - JWT authentication
  - CORS support
  - Static file serving
  - File upload handling
- 📦 **Database** - PostgreSQL integration via Prisma
- ⚡ **Development Tools**
  - ESLint for code linting
  - Prettier for code formatting
  - Jest for testing
  - tsup for TypeScript bundling

## Prerequisites

- Node.js >= 20.16.0
- pnpm 9.7.1 or higher

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cp ../../.env.example ../../.env
   ```

3. Development mode:

   ```bash
   pnpm dev
   ```

4. Production build:
   ```bash
   pnpm build
   pnpm start
   ```

## Docker Support

Run with Docker Compose:

```bash
docker-compose up
```

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking
