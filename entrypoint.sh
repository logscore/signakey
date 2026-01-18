#!/bin/sh
set -e

echo "Running database migrations..."
bun run migrate.ts

echo "Starting application..."
exec bun build/index.js
