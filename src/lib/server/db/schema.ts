import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const signatures = sqliteTable("signatures", {
  id: integer("id").primaryKey(),
  text: text("text").notNull().unique(), // The typed signature text
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  ipHash: text("ip_hash").notNull(), // For rate limiting/abuse prevention
});
