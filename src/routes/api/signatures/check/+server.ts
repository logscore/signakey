import { json, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { signatures } from "$lib/server/db/schema";

export async function POST({ request }: RequestEvent) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return json({ error: "Invalid text" }, { status: 400 });
  }

  try {
    const existing = await db
      .select()
      .from(signatures)
      .where(eq(signatures.text, text.toLowerCase()))
      .get();

    return json({ available: !existing });
  } catch (e) {
    console.error(e);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
