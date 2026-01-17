import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { env } from "$env/dynamic/private";

// Initialize SQLite database
// In production, set DATABASE_URL=/app/data/sqlite.db
const dbPath = env.DATABASE_URL;
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite);
