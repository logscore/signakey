# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .
RUN touch sqlite.db
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

WORKDIR /app

RUN apk add --no-cache sqlite
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=sveltekit:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=sveltekit:nodejs /app/scripts/entrypoint.sh ./

RUN mkdir -p /app/data && chown sveltekit:nodejs /app/data

USER sveltekit

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV DATABASE_URL=file:/app/data/sqlite.db

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
