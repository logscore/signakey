# Build stage
FROM oven/bun:1.3.2-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bun run svelte-kit sync
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production
WORKDIR /app

# Install git here so it exists in the final image
RUN apk add --no-cache git

RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=sveltekit:nodejs /app/drizzle.config.ts ./

USER sveltekit

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["bun", "build/index.js"]
