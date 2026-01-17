#!/bin/sh
set -e

DB_PATH="/app/data/sqlite.db"
MIGRATIONS_DIR="./drizzle"

echo "Running database migrations..."

sqlite3 "$DB_PATH" <<'EOF'
CREATE TABLE IF NOT EXISTS _migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);
EOF

for file in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  id=$(basename "$file")

  applied=$(sqlite3 "$DB_PATH" \
    "SELECT 1 FROM _migrations WHERE id='$id' LIMIT 1;")

  if [ -n "$applied" ]; then
    continue
  fi

  echo "Applying migration: $id"

  sqlite3 "$DB_PATH" <<EOF
BEGIN;
.read $file
INSERT INTO _migrations (id, applied_at)
VALUES ('$id', datetime('now'));
COMMIT;
EOF
done

echo "Starting app..."
exec bun ./build/index.js
