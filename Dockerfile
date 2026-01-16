# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app


# Copy package files
COPY package.json bun.lock ./

# Install dependencies (skip native module scripts since we use bun:sqlite at runtime)
RUN bun install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Create empty db file for build step (the real db is in the mounted volume at runtime)
RUN touch sqlite.db

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

# Copy built application
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules

# Create data directory for SQLite
RUN mkdir -p /app/data && chown sveltekit:nodejs /app/data

# Switch to non-root user
USER sveltekit

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/signatures/check || exit 1

# Start the application
CMD ["bun", "./build/index.js"]
