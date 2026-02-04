# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm via corepack (recommended method)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install build dependencies for native modules (better-sqlite3, pg)
RUN apk add --no-cache python3 make g++ postgresql-dev

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Nuxt application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies
RUN corepack enable && \
    apk add --no-cache postgresql-libs curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nodejs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nodejs:nodejs /app/package.json /app/package.json

# Create data directory for database
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app/data

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
