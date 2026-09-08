import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  stages,
  journeys,
  policies,
  processes,
  tsms,
  stagePolicies,
  stageProcesses,
  stageTsms,
} from "@/lib/db/schema";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Payload = {
  title?: string;
  subtitle?: string;
  icon?: string;
  activities?: string;
  excellence?: string;
  policyCodes?: string[];
  processCodes?: string[];
  tsmCodes?: string[];
};

function codes(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return [...new Set(value.filter((v): v is string => typeof v === "string"))];
}

/** Update a stage's content and/or its policy, process and TSM mappings. */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const stageId = Number((await context.params).id);
  if (!Number.isInteger(stageId)) {
    return NextResponse.json({ error: "Invalid stage id." }, { status: 400 });
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: stages.id, journeyId: stages.journeyId })
    .from(stages)
    .where(eq(stages.id, stageId));

  if (!existing) {
    return NextResponse.json({ error: "Stage not found." }, { status: 404 });
  }

  const policyCodes = codes(body.policyCodes);
  const processCodes = codes(body.processCodes);
  const tsmCodes = codes(body.tsmCodes);

  // Resolve codes to ids up front so an unknown code fails before any write.
  const [policyRows, processRows, tsmRows] = await Promise.all([
    policyCodes?.length
      ? db
          .select({ id: policies.id, code: policies.code })
          .from(policies)
          .where(inArray(policies.code, policyCodes))
      : Promise.resolve([]),
    processCodes?.length
      ? db
          .select({ id: processes.id, code: processes.code })
          .from(processes)
          .where(inArray(processes.code, processCodes))
      : Promise.resolve([]),
    tsmCodes?.length
      ? db
          .select({ id: tsms.id, code: tsms.code })
          .from(tsms)
          .where(inArray(tsms.code, tsmCodes))
      : Promise.resolve([]),
  ]);

  const missing = [
    ...(policyCodes ?? []).filter((c) => !policyRows.some((r) => r.code === c)),
    ...(processCodes ?? []).filter((c) => !processRows.some((r) => r.code === c)),
    ...(tsmCodes ?? []).filter((c) => !tsmRows.some((r) => r.code === c)),
  ];
  if (missing.length) {
    return NextResponse.json(
      { error: `Unknown code(s): ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  // Keep shared ownership links provisional pending a provider-specific
  // reporting-scope review. This default is not a regulatory exemption.
  const [journey] = await db
    .select({ tenure: journeys.tenure })
    .from(journeys)
    .where(eq(journeys.id, existing.journeyId));
  const reportable = journey?.tenure !== "LCHO";

  await db.transaction(async (tx) => {
    const content: Record<string, string | Date> = {};
    if (typeof body.title === "string") content.title = body.title.trim();
    if (typeof body.subtitle === "string") content.subtitle = body.subtitle.trim();
    if (typeof body.icon === "string") content.icon = body.icon.trim();
    if (typeof body.activities === "string") content.activities = body.activities;
    if (typeof body.excellence === "string") content.excellence = body.excellence;

    if (Object.keys(content).length) {
      content.updatedAt = new Date();
      await tx.update(stages).set(content).where(eq(stages.id, stageId));
    }

    if (policyCodes) {
      await tx.delete(stagePolicies).where(eq(stagePolicies.stageId, stageId));
      if (policyRows.length) {
        await tx
          .insert(stagePolicies)
          .values(policyRows.map((r) => ({ stageId, policyId: r.id })));
      }
    }

    if (processCodes) {
      await tx.delete(stageProcesses).where(eq(stageProcesses.stageId, stageId));
      if (processRows.length) {
        await tx
          .insert(stageProcesses)
          .values(processRows.map((r) => ({ stageId, processId: r.id })));
      }
    }

    if (tsmCodes) {
      await tx.delete(stageTsms).where(eq(stageTsms.stageId, stageId));
      if (tsmRows.length) {
        await tx
          .insert(stageTsms)
          .values(tsmRows.map((r) => ({ stageId, tsmId: r.id, reportable })));
      }
    }
  });

  return NextResponse.json({ ok: true });
}
