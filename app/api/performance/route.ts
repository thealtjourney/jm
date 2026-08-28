import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tsmResults, tsms } from "@/lib/db/schema";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { getPerformance, CURRENT_PERIOD } from "@/lib/queries";

export const dynamic = "force-dynamic";

const SOURCES = ["placeholder", "return", "internal"];

export async function GET() {
  return NextResponse.json(await getPerformance());
}

/**
 * Record a real figure against a measure. Marking `source` as "return" or
 * "internal" also protects the row from being overwritten by a re-seed.
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

  let body: {
    code?: string;
    period?: string;
    scope?: string;
    value?: number | string | null;
    target?: number | string | null;
    source?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.code !== "string") {
    return NextResponse.json({ error: "A TSM code is required." }, { status: 400 });
  }

  const source = body.source ?? "internal";
  if (!SOURCES.includes(source)) {
    return NextResponse.json(
      { error: `Source must be one of: ${SOURCES.join(", ")}` },
      { status: 400 },
    );
  }

  const parse = (input: unknown, label: string) => {
    if (input === null || input === undefined || input === "") return null;
    const n = Number(input);
    if (!Number.isFinite(n) || n < 0 || n > 100000) {
      throw new Error(`${label} must be a number between 0 and 100000.`);
    }
    return n.toFixed(2);
  };

  let value: string | null;
  let target: string | null;
  try {
    value = parse(body.value, "Value");
    target = parse(body.target, "Target");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid number." },
      { status: 400 },
    );
  }

  const [tsm] = await db
    .select({ id: tsms.id })
    .from(tsms)
    .where(eq(tsms.code, body.code));
  if (!tsm) {
    return NextResponse.json({ error: "Measure not found." }, { status: 404 });
  }

  const period = (body.period ?? CURRENT_PERIOD).trim().slice(0, 20);
  const scope = (body.scope ?? "Organisation").trim().slice(0, 80) || "Organisation";

  const [existing] = await db
    .select({ id: tsmResults.id })
    .from(tsmResults)
    .where(
      and(
        eq(tsmResults.tsmId, tsm.id),
        eq(tsmResults.period, period),
        eq(tsmResults.scope, scope),
      ),
    );

  const row = { tsmId: tsm.id, period, scope, value, target, source, updatedAt: new Date() };

  if (existing) {
    await db.update(tsmResults).set(row).where(eq(tsmResults.id, existing.id));
  } else {
    await db.insert(tsmResults).values(row);
  }

  return NextResponse.json({ ok: true });
}
