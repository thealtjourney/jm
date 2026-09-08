/**
 * Seeds reference data, the three journeys, ownership, role lenses and
 * illustrative performance figures.
 *
 * Safe to re-run: reference rows are upserted on their unique code, and each
 * stage's mappings are rebuilt from scratch. Editorial changes made in the app
 * to `activities` and `excellence` are preserved unless --force is passed, as
 * are policy URLs, real (non-placeholder) TSM results and any challenges.
 *
 *   npm run db:seed
 *   npm run db:seed -- --force
 */

import { config } from "dotenv";
import { and, eq, inArray } from "drizzle-orm";

// Must run before ./index is imported, since that module reads DATABASE_URL
// at load time. The import below is therefore deferred into main().
config({ path: ".env.local" });
config();

import {
  journeys,
  stages,
  processes,
  policies,
  tsms,
  teams,
  roles,
  roleFocus,
  tsmResults,
  stageProcesses,
  stagePolicies,
  stageTsms,
} from "./schema";
import { TSM_SEED } from "../data/tsms";
import { POLICY_SEED } from "../data/policies";
import { PROCESS_SEED } from "../data/processes";
import { TEAM_SEED } from "../data/teams";
import { ROLE_SEED } from "../data/roles";
import { TSM_RESULT_SEED } from "../data/tsm-results";
import { JOURNEY_SEED, STAGE_SEED, STAGE_TARGET_DAYS } from "../data/stages";

const force = process.argv.includes("--force");

async function main() {
  const { db } = await import("./index");

  console.log(`Seeding Housing Journey Manager${force ? " (force)" : ""}...`);

  // --- Teams --------------------------------------------------------------
  for (const t of TEAM_SEED) {
    await db
      .insert(teams)
      .values(t)
      .onConflictDoUpdate({ target: teams.code, set: { ...t } });
  }
  const teamIds = new Map(
    (await db.select().from(teams)).map((r) => [r.code, r.id]),
  );
  console.log(`  ${TEAM_SEED.length} teams`);

  // --- Reference data -----------------------------------------------------
  for (const t of TSM_SEED) {
    await db
      .insert(tsms)
      .values(t)
      .onConflictDoUpdate({ target: tsms.code, set: { ...t } });
  }
  console.log(`  ${TSM_SEED.length} TSMs`);

  for (const p of POLICY_SEED) {
    await db
      .insert(policies)
      .values(p)
      // `url` is deliberately excluded so admin-entered links survive a re-seed.
      .onConflictDoUpdate({
        target: policies.code,
        set: {
          name: p.name,
          category: p.category,
          description: p.description,
        },
      });
  }
  console.log(`  ${POLICY_SEED.length} policies`);

  for (const p of PROCESS_SEED) {
    const owningTeamId = teamIds.get(p.teamCode);
    if (!owningTeamId) throw new Error(`Unknown team code: ${p.teamCode}`);
    const row = {
      code: p.code,
      name: p.name,
      description: p.description,
      owningTeamId,
    };
    await db
      .insert(processes)
      .values(row)
      .onConflictDoUpdate({ target: processes.code, set: row });
  }
  console.log(`  ${PROCESS_SEED.length} processes`);

  // --- Journeys -----------------------------------------------------------
  const journeyIds = new Map<string, number>();
  for (const [index, j] of JOURNEY_SEED.entries()) {
    const row = { ...j, sortOrder: index };
    const [inserted] = await db
      .insert(journeys)
      .values(row)
      .onConflictDoUpdate({ target: journeys.key, set: row })
      .returning({ id: journeys.id });
    journeyIds.set(j.key, inserted.id);
  }
  console.log(`  ${JOURNEY_SEED.length} journeys`);

  // --- Lookup maps for the join tables ------------------------------------
  const tsmIds = new Map((await db.select().from(tsms)).map((r) => [r.code, r.id]));
  const policyIds = new Map(
    (await db.select().from(policies)).map((r) => [r.code, r.id]),
  );
  const processIds = new Map(
    (await db.select().from(processes)).map((r) => [r.code, r.id]),
  );

  const tenureByKey = new Map(JOURNEY_SEED.map((j) => [j.key, j.tenure]));

  // --- Stages -------------------------------------------------------------
  const stageIds = new Map<string, number>();
  for (const [index, s] of STAGE_SEED.entries()) {
    const journeyId = journeyIds.get(s.journeyKey);
    if (!journeyId) throw new Error(`Unknown journey key: ${s.journeyKey}`);

    const accountableTeamId = teamIds.get(s.accountableTeam);
    if (!accountableTeamId) {
      throw new Error(`Unknown team code: ${s.accountableTeam}`);
    }

    // Structural fields always sync; editorial fields only on --force.
    const structural = {
      journeyId,
      code: s.code,
      title: s.title,
      subtitle: s.subtitle,
      icon: s.icon,
      type: s.type,
      accountableTeamId,
      accountableRole: s.accountableRole,
      targetDays: STAGE_TARGET_DAYS[s.code] ?? null,
      sortOrder: index,
    };
    const editorial = { activities: s.activities, excellence: s.excellence };

    const [stage] = await db
      .insert(stages)
      .values({ ...structural, ...editorial })
      .onConflictDoUpdate({
        target: stages.code,
        set: force ? { ...structural, ...editorial } : structural,
      })
      .returning({ id: stages.id });

    stageIds.set(s.code, stage.id);

    // Rebuild mappings for this stage.
    await db.delete(stageTsms).where(eq(stageTsms.stageId, stage.id));
    await db.delete(stagePolicies).where(eq(stagePolicies.stageId, stage.id));
    await db.delete(stageProcesses).where(eq(stageProcesses.stageId, stage.id));

    // Keep shared ownership links provisional until the provider reviews
    // reporting scope. This mapping default is not a regulatory exemption.
    const reportable = tenureByKey.get(s.journeyKey) !== "LCHO";

    if (s.tsmCodes.length) {
      await db.insert(stageTsms).values(
        s.tsmCodes.map((code) => {
          const tsmId = tsmIds.get(code);
          if (!tsmId) throw new Error(`Unknown TSM code: ${code}`);
          return { stageId: stage.id, tsmId, reportable };
        }),
      );
    }

    if (s.policyCodes.length) {
      await db.insert(stagePolicies).values(
        s.policyCodes.map((code) => {
          const policyId = policyIds.get(code);
          if (!policyId) throw new Error(`Unknown policy code: ${code}`);
          return { stageId: stage.id, policyId };
        }),
      );
    }

    if (s.processCodes.length) {
      await db.insert(stageProcesses).values(
        s.processCodes.map((code) => {
          const processId = processIds.get(code);
          if (!processId) throw new Error(`Unknown process code: ${code}`);
          return { stageId: stage.id, processId };
        }),
      );
    }
  }
  console.log(`  ${stageIds.size} stages with ownership and mappings`);

  // --- Role lenses --------------------------------------------------------
  for (const [index, r] of ROLE_SEED.entries()) {
    const row = {
      key: r.key,
      name: r.name,
      description: r.description,
      altitude: r.altitude,
      leadAnswer: r.leadAnswer,
      sortOrder: index,
    };
    const [role] = await db
      .insert(roles)
      .values(row)
      .onConflictDoUpdate({ target: roles.key, set: row })
      .returning({ id: roles.id });

    await db.delete(roleFocus).where(eq(roleFocus.roleId, role.id));
    if (r.focusStages.length) {
      await db.insert(roleFocus).values(
        r.focusStages.map((code) => {
          const stageId = stageIds.get(code);
          if (!stageId) throw new Error(`Unknown stage code in role focus: ${code}`);
          return { roleId: role.id, stageId };
        }),
      );
    }
  }
  console.log(`  ${ROLE_SEED.length} role lenses`);

  // --- TSM results --------------------------------------------------------
  // Only placeholder rows are overwritten. Once a figure is marked "return" or
  // "internal" it is real data, and re-seeding must not clobber it.
  let written = 0;
  let preserved = 0;
  for (const r of TSM_RESULT_SEED) {
    const tsmId = tsmIds.get(r.tsmCode);
    if (!tsmId) throw new Error(`Unknown TSM code in results: ${r.tsmCode}`);

    const [existing] = await db
      .select({ id: tsmResults.id, source: tsmResults.source })
      .from(tsmResults)
      .where(
        and(
          eq(tsmResults.tsmId, tsmId),
          eq(tsmResults.period, r.period),
          eq(tsmResults.scope, r.scope),
        ),
      );

    if (existing && existing.source !== "placeholder") {
      preserved += 1;
      continue;
    }

    const row = {
      tsmId,
      period: r.period,
      scope: r.scope,
      value: String(r.value),
      target: String(r.target),
      source: r.source,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(tsmResults).set(row).where(eq(tsmResults.id, existing.id));
    } else {
      await db.insert(tsmResults).values(row);
    }
    written += 1;
  }
  console.log(
    `  ${written} illustrative TSM results` +
      (preserved ? ` (${preserved} real figures left untouched)` : ""),
  );

  // --- Tidy up ------------------------------------------------------------
  const seedCodes = STAGE_SEED.map((s) => s.code);
  const existingStages = await db.select({ code: stages.code }).from(stages);
  const orphaned = existingStages
    .map((r) => r.code)
    .filter((code) => !seedCodes.includes(code));
  if (orphaned.length) {
    await db.delete(stages).where(inArray(stages.code, orphaned));
    console.log(`  removed ${orphaned.length} orphaned stage(s)`);
  }

  console.log("Seed complete.");
  console.log(
    "\nNote: TSM figures are ILLUSTRATIVE placeholders. Replace them with your\n" +
      "published return via PATCH /api/performance before relying on them.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
