# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace package files (maintaining structure)
COPY packages/core/package*.json ./packages/core/
COPY packages/server/package*.json ./packages/server/

# Install ALL dependencies (including devDeps for building)
RUN npm ci

# Copy TypeScript configs
COPY tsconfig*.json ./
COPY packages/core/tsconfig*.json ./packages/core/
COPY packages/server/tsconfig*.json ./packages/server/
COPY packages/server/nest-cli.json ./packages/server/

# Copy source code for both packages
COPY packages/core/src ./packages/core/src
COPY packages/server/src ./packages/server/src
COPY packages/server/test ./packages/server/test

# Build core first (server depends on it)
RUN npm run build --workspace=@morphql/core

# Build server
RUN npm run build --workspace=server

# Prune dev dependencies
RUN npm prune --omit=dev

# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

# Copy root metadata
COPY package*.json ./

# Copy the entire built workspace from builder
# This includes the pruned node_modules which already has the correct links structure
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

ENV NODE_ENV=production
EXPOSE 3000

# Set WORKDIR to server for correct execution context
WORKDIR /app/packages/server

# Execute using local package script
CMD ["npm", "run", "start:prod"]
#CMD ["tail", "-f", "/dev/null"]