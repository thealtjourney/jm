import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stageChallenges, stages } from "@/lib/db/schema";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { getChallenges } from "@/lib/queries";

export const dynamic = "force-dynamic";

const MAX_BODY = 2000;
const MAX_NAME = 120;

export async function GET(request: Request) {
  const status = new URL(request.url).searchParams.get("status") ?? undefined;
  return NextResponse.json(await getChallenges(status));
}

/**
 * Raise a challenge against a stage. Deliberately open, with no session
 * required: the people best placed to say "that is not what happens" are the
 * ones least likely to have an admin password. Input is capped and stored as
 * plain text, and is only ever rendered as text.
 */
export async function POST(request: Request) {
  let body: {
    stageId?: number;
    submittedBy?: string;
    submittedRole?: string;
    body?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const stageId = Number(body.stageId);
  const text = typeof body.body === "string" ? body.body.trim() : "";

  if (!Number.isInteger(stageId)) {
    return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json(
      { error: "Tell us what is wrong with this stage." },
      { status: 400 },
    );
  }
  if (text.length > MAX_BODY) {
    return NextResponse.json(
      { error: `Please keep it under ${MAX_BODY} characters.` },
      { status: 400 },
    );
  }

  const [stage] = await db
    .select({ id: stages.id })
    .from(stages)
    .where(eq(stages.id, stageId));
  if (!stage) {
    return NextResponse.json({ error: "Stage not found." }, { status: 404 });
  }

  await db.insert(stageChallenges).values({
    stageId,
    submittedBy: (body.submittedBy ?? "").toString().trim().slice(0, MAX_NAME),
    submittedRole: (body.submittedRole ?? "").toString().trim().slice(0, MAX_NAME),
    body: text,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

/** Respond to a challenge and close it. Admin only. */
export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  let body: { id?: number; status?: string; response?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid challenge id." }, { status: 400 });
  }

  const allowed = ["open", "accepted", "declined"];
  if (body.status && !allowed.includes(body.status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${allowed.join(", ")}` },
      { status: 400 },
    );
  }

  const updated = await db
    .update(stageChallenges)
    .set({
      ...(body.status ? { status: body.status } : {}),
      ...(typeof body.response === "string"
        ? { response: body.response.trim().slice(0, MAX_BODY) }
        : {}),
      updatedAt: new Date(),
    })
    .where(eq(stageChallenges.id, id))
    .returning({ id: stageChallenges.id });

  if (!updated.length) {
    return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
