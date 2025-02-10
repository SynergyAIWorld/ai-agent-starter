# Specify platform to ensure consistent builds
FROM node:22-slim AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @acme/starter --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .

# Combine apt commands and cleanup in a single RUN to reduce layers
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm pnpm && \
    pnpm i --no-frozen-lockfile

# Build the project
#COPY --from=builder /app/.env .
RUN pnpm turbo build --filter=@acme/starter

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 agent
USER agent

COPY --from=installer --chown=agent:nodejs /app .
CMD npx dotenv -e .env node apps/starter/dist/index.js