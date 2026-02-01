# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace package files (maintaining structure)
COPY packages/core/package*.json ./packages/core/
COPY packages/server/package*.json ./packages/server/
COPY packages/server-instance/package*.json ./packages/server-instance/

# Install ALL dependencies (including devDeps for building)
RUN npm ci

# Copy TypeScript configs
COPY tsconfig*.json ./
COPY packages/core/tsconfig*.json ./packages/core/
COPY packages/server/tsconfig*.json ./packages/server/
COPY packages/server-instance/tsconfig*.json ./packages/server-instance/
COPY packages/server-instance/nest-cli.json ./packages/server-instance/
COPY packages/server-instance/tsconfig.build.json ./packages/server-instance/

# Copy source code for all packages
COPY packages/core/src ./packages/core/src
COPY packages/server/src ./packages/server/src
COPY packages/server-instance/src ./packages/server-instance/
COPY packages/server-instance/test ./packages/server-instance/
COPY packages/server-instance/queries ./packages/server-instance/

# Build core first (server depends on it)
RUN npm run build --workspace=@morphql/core

# Build server core
RUN npm run build --workspace=@morphql/server

# Build server instance (NestJS)
RUN npm run build --workspace=@morphql/server-instance

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

# Ensure queries directory exists
RUN mkdir -p /app/packages/server-instance/queries

# Environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Set WORKDIR to server-instance for correct execution context
WORKDIR /app/packages/server-instance

# Execute using local package script
CMD ["npm", "run", "start:prod"]