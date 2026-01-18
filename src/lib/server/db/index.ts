import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let _db: NodePgDatabase | null = null;

export const db = new Proxy({} as NodePgDatabase, {
  get(_, prop) {
    if (!_db) {
      const url = process.env.DATABASE_URL;
      if (!url) throw new Error("DATABASE_URL is not set");
      const pool = new Pool({ connectionString: url });
      _db = drizzle(pool);
    }
    return Reflect.get(_db, prop);
  },
});
