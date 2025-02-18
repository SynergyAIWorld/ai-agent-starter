# Simple AI Agent

A modern AI agent development framework built with TypeScript, featuring comprehensive API integrations and development tools.

## Project Structure

This is a monorepo managed with pnpm workspaces, containing the following packages:

- `apps/starter`: Main application template with full TypeScript support and modern tooling
- More packages coming soon...

## Quick Start

1. **Setup Environment**

   ```bash
   # Install dependencies
   pnpm install

   # Copy environment variables
   cp .env.example .env
   ```

2. **Database Setup**

   ```bash
   # Create migrations directory
   mkdir -p prisma/migrations/0_init

   # Generate baseline migration
   prisma migrate diff \
   --from-empty \
   --to-schema-datamodel prisma/schema.prisma \
   --script > prisma/migrations/0_init/migration.sql

   # Apply migration
   npx prisma migrate resolve --applied 0_init
   ```

3. **Development**
   ```bash
   # Start development server
   cd apps/starter
   pnpm dev
   ```
4. **Docker**
   ```bash
   # Start development server
   docker compose -f compose.yml -p agent-starter up -d
   ```

## Features

- 🤖 **AI Integration** - Ready-to-use AI agent development framework
- 🚀 **Modern Stack** - TypeScript, Node.js, and comprehensive API integrations
- 📦 **Monorepo Structure** - Organized with pnpm workspaces for scalability
- 🔄 **Hot Reload** - Fast development with automatic reloading
- 🐳 **Docker Support** - Container-ready with Docker and docker-compose
- 📊 **Database** - PostgreSQL with Prisma ORM
- 🧪 **Testing** - Jest setup for reliable testing
- 🛠️ **Development Tools** - ESLint, Prettier, and TypeScript configured

## Prerequisites

- Node.js >= 20.16.0
- pnpm 9.7.1 or higher
- PostgreSQL (if using database features)

## Documentation

For detailed documentation about specific packages:

- [Starter App Documentation](apps/starter/README.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```
mkdir -p prisma/migrations/0_init
```

```
prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql
```

```
npx prisma migrate resolve --applied 0_init
```
