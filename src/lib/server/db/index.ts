import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let _db: NodePgDatabase | null = null;

export function getDb(): NodePgDatabase {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const pool = new Pool({ connectionString: url });
    _db = drizzle(pool);
  }
  return _db;
}
