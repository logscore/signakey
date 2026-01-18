import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "$env/dynamic/private";
import { Pool } from "pg";
import { signatures } from "./schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({schema: {signatures}, client: pool });
