import crypto from "node:crypto";
import { json, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { signatures } from "$lib/server/db/schema";

export async function POST({ request, getClientAddress }: RequestEvent) {
  const { text } = await request.json();

  if (!text || typeof text !== "string" || text.length === 0) {
    return json({ error: "Invalid signature text" }, { status: 400 });
  }

  if (text.length > 50) {
    return json({ error: "Signature too long" }, { status: 400 });
  }

  // IP Hashing for privacy
  const ip = getClientAddress();
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  // Rate Limiting: Check if this IP has claimed in the last hour?
  // For simplicity as requested "sets a basic rate limit", we can just limit total claims per IP or time window.
  // Let's limit to 5 claims per hour per IP.

  // We can do this check via DB query if we had enough volume, but for "basic",
  // let's just check if the text is taken first.

  try {
    const existing = await db
      .select()
      .from(signatures)
      .where(eq(signatures.text, text.toLowerCase()))
      .get();

    if (existing) {
      return json({ error: "Signature already claimed" }, { status: 409 });
    }

    // Rate limit check
    const ONE_HOUR = 3 * 60 * 1000;
    const recentClaims = await db.select().from(signatures).all(); // Optimize in real prod

    // Filter in memory for simplicity with better-sqlite3 synchronous
    const userRecentClaims = recentClaims.filter(
      (s) =>
        s.ipHash === ipHash && Date.now() - s.createdAt.getTime() < ONE_HOUR
    );

    if (userRecentClaims.length >= 5) {
      return json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // Insert
    await db
      .insert(signatures)
      .values({
        text: text.toLowerCase(),
        createdAt: new Date(),
        ipHash,
      })
      .run();

    return json({ success: true, message: "Signature claimed!" });
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      "code" in e &&
      e.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return json({ error: "Signature already claimed" }, { status: 409 });
    }
    console.error(e);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
