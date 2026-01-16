import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

// Initialize SQLite database
// Accessing env directly or fallback to local file
const dbPath = env.DATABASE_URL || 'sqlite.db';
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite);
