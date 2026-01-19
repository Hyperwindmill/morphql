# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
# Copy workspace package files to maintain structure for npm ci
COPY packages/core/package.json ./packages/core/
COPY packages/server/package.json ./packages/server/

# Install dependencies for the workspace
RUN npm ci

# Copy source code
COPY . .

# Build core and server
RUN npm run build -w @query-morph/core
RUN npm run build -w server

# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/core/package.json ./packages/core/

# Install production dependencies
# This creates the linked structure in node_modules
RUN npm ci --omit=dev -w server

# Copy built artifacts from builder
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/core/dist ./packages/core/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

ENV NODE_ENV=production
EXPOSE 3000

# Run using the workspace script to ensure correct CWD and resolution
CMD ["npm", "run", "start:prod", "-w", "server"]
