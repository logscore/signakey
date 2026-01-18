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

  const ip = getClientAddress();
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  const ONE_HOUR = 3 * 60 * 1000;

  try {
    const existing = await db
      .select()
      .from(signatures)
      .where(eq(signatures.text, text.toLowerCase()))
      .then((rows) => rows[0]);

    if (existing) {
      return json({ error: "Signature already claimed" }, { status: 409 });
    }

    const recentClaims = await db.select().from(signatures);

    const userRecentClaims = recentClaims.filter(
      (s) =>
        s.ipHash === ipHash &&
        Date.now() - new Date(s.createdAt).getTime() < ONE_HOUR
    );

    if (userRecentClaims.length >= 5) {
      return json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    await db.insert(signatures).values({
      text: text.toLowerCase(),
      createdAt: new Date(),
      ipHash,
    });

    return json({ success: true, message: "Signature claimed!" });
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      "code" in e &&
      (e.code === "23505" || e.code === "SQLITE_CONSTRAINT_UNIQUE")
    ) {
      return json({ error: "Signature already claimed" }, { status: 409 });
    }
    console.error(e);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
