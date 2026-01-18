import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const signatures = pgTable("signatures", {
  id: serial("id").primaryKey(),
  text: text("text").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  ipHash: text("ip_hash").notNull(),
});
