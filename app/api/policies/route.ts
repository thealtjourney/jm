import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    await db.select().from(policies).orderBy(asc(policies.name)),
  );
}

/**
 * Attach a real document link to a policy. Only http(s) URLs are accepted so a
 * stored value can never become a javascript: link in the rendered page.
 */
export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  let body: { code?: string; url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.code !== "string" || typeof body.url !== "string") {
    return NextResponse.json(
      { error: "Both code and url are required." },
      { status: 400 },
    );
  }

  const url = body.url.trim();
  if (url) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json(
        { error: "Only http and https links are allowed." },
        { status: 400 },
      );
    }
  }

  const updated = await db
    .update(policies)
    .set({ url })
    .where(eq(policies.code, body.code))
    .returning({ code: policies.code });

  if (!updated.length) {
    return NextResponse.json({ error: "Policy not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
