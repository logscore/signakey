import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "$env/dynamic/private";
import { Pool } from "pg";
import { signatures } from "./schema";

const pool = new Pool({
  connectionString: "postgres://postgres:e0ndn4c4BuIOJLdgU443xOESbeICakGYGDRj3Hnyv24r9ZixeDdowVCoyHspjdjY@5.78.95.70:5432/postgres",
});

export const db = drizzle({schema: {signatures}, client: pool });
