import { asc, desc, eq } from "drizzle-orm";
import { db } from "./db";
import {
  journeys,
  stages,
  policies,
  processes,
  tsms,
  teams,
  roles,
  tsmResults,
  stageChallenges,
} from "./db/schema";
import { CURRENT_PERIOD, PRIOR_PERIOD } from "./data/tsm-results";
import { journeyTheme } from "./journey-presentation";

export type TeamRef = { code: string; name: string; directorate: string };

export type MeasureStatus = "on-target" | "near" | "off-target" | "no-data";

export type StageTsm = {
  code: string;
  name: string;
  category: string;
  measureType: string;
  definition: string;
  calculation: string;
  unit: string;
  higherIsBetter: boolean;
  reportable: boolean;
  /** Current-period performance, if any has been recorded. */
  value: number | null;
  target: number | null;
  prior: number | null;
  source: string | null;
  status: MeasureStatus;
};

export type StageDetail = {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  type: string;
  activities: string;
  excellence: string;
  accountableTeam: TeamRef | null;
  accountableRole: string;
  /** Indicative days this stage should take; null means it is ongoing. */
  targetDays: number | null;
  /** Every other team that runs a process at this stage. */
  contributingTeams: TeamRef[];
  openChallenges: number;
  /** Worst status across the stage's reportable measures. */
  health: MeasureStatus;
  tsms: StageTsm[];
  policies: {
    code: string;
    name: string;
    category: string;
    description: string;
    url: string;
  }[];
  processes: {
    code: string;
    name: string;
    team: TeamRef | null;
    description: string;
  }[];
};

export type JourneyDetail = {
  id: number;
  key: string;
  name: string;
  description: string;
  tenure: string;
  colour: string;
  stages: StageDetail[];
};

export type RoleLens = {
  key: string;
  name: string;
  description: string;
  altitude: "detail" | "team" | "summary";
  leadAnswer: "excellence" | "processes" | "policies" | "tsms";
  focusStageCodes: string[];
};

/**
 * Compares a measure to its target, respecting direction. "near" is within
 * three units of target, which is a deliberately blunt rule - it exists to
 * draw the eye, not to be a performance framework.
 */
function statusFor(
  value: number | null,
  target: number | null,
  higherIsBetter: boolean,
): MeasureStatus {
  if (value === null || target === null) return "no-data";
  const gap = higherIsBetter ? value - target : target - value;
  if (gap >= 0) return "on-target";
  if (gap >= -3) return "near";
  return "off-target";
}

const HEALTH_ORDER: MeasureStatus[] = [
  "off-target",
  "near",
  "on-target",
  "no-data",
];

function worstOf(statuses: MeasureStatus[]): MeasureStatus {
  for (const candidate of HEALTH_ORDER) {
    if (statuses.includes(candidate)) return candidate;
  }
  return "no-data";
}

function toNumber(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function teamRef(
  team: { code: string; name: string; directorate: string } | null,
): TeamRef | null {
  return team ? { code: team.code, name: team.name, directorate: team.directorate } : null;
}

/** The whole map: journeys, stages, the four answers, ownership and performance. */
export async function getJourneys(): Promise<JourneyDetail[]> {
  const [rows, results, challengeCounts] = await Promise.all([
    db.query.journeys.findMany({
      orderBy: [asc(journeys.sortOrder)],
      with: {
        stages: {
          orderBy: [asc(stages.sortOrder)],
          with: {
            accountableTeam: true,
            stageTsms: { with: { tsm: true } },
            stagePolicies: { with: { policy: true } },
            stageProcesses: { with: { process: { with: { owningTeam: true } } } },
          },
        },
      },
    }),
    db.select().from(tsmResults),
    db
      .select({ stageId: stageChallenges.stageId })
      .from(stageChallenges)
      .where(eq(stageChallenges.status, "open")),
  ]);

  // Index performance by TSM id for the current and prior period.
  const current = new Map<number, (typeof results)[number]>();
  const prior = new Map<number, (typeof results)[number]>();
  for (const r of results) {
    if (r.scope !== "Organisation") continue;
    if (r.period === CURRENT_PERIOD) current.set(r.tsmId, r);
    if (r.period === PRIOR_PERIOD) prior.set(r.tsmId, r);
  }

  const openByStage = new Map<number, number>();
  for (const c of challengeCounts) {
    openByStage.set(c.stageId, (openByStage.get(c.stageId) ?? 0) + 1);
  }

  return rows.map((journey) => ({
    id: journey.id,
    key: journey.key,
    name: journey.name,
    description: journey.description,
    tenure: journey.tenure,
    colour: journeyTheme(journey.key).colour,
    stages: journey.stages.map((stage) => {
      const stageTsmList: StageTsm[] = stage.stageTsms
        .map((link) => {
          const now = current.get(link.tsm.id);
          const then = prior.get(link.tsm.id);
          const value = toNumber(now?.value ?? null);
          const target = toNumber(now?.target ?? null);
          return {
            code: link.tsm.code,
            name: link.tsm.name,
            category: link.tsm.category,
            measureType: link.tsm.measureType,
            definition: link.tsm.definition,
            calculation: link.tsm.calculation,
            unit: link.tsm.unit,
            higherIsBetter: link.tsm.higherIsBetter,
            reportable: link.reportable,
            value,
            target,
            prior: toNumber(then?.value ?? null),
            source: now?.source ?? null,
            status: statusFor(value, target, link.tsm.higherIsBetter),
          };
        })
        .sort((a, b) => a.code.localeCompare(b.code));

      const processList = stage.stageProcesses
        .map((link) => ({
          code: link.process.code,
          name: link.process.name,
          team: teamRef(link.process.owningTeam),
          description: link.process.description,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Who else is involved: derived from the processes mapped to the stage,
      // minus the team that is already accountable for it.
      const accountable = teamRef(stage.accountableTeam);
      const contributing = new Map<string, TeamRef>();
      for (const p of processList) {
        if (p.team && p.team.code !== accountable?.code) {
          contributing.set(p.team.code, p.team);
        }
      }

      return {
        id: stage.id,
        code: stage.code,
        title: stage.title,
        subtitle: stage.subtitle,
        icon: stage.icon,
        type: stage.type,
        activities: stage.activities,
        excellence: stage.excellence,
        accountableTeam: accountable,
        accountableRole: stage.accountableRole,
        targetDays: stage.targetDays,
        contributingTeams: [...contributing.values()].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
        openChallenges: openByStage.get(stage.id) ?? 0,
        health: worstOf(
          stageTsmList.filter((t) => t.reportable).map((t) => t.status),
        ),
        tsms: stageTsmList,
        policies: stage.stagePolicies
          .map((link) => ({
            code: link.policy.code,
            name: link.policy.name,
            category: link.policy.category,
            description: link.policy.description,
            url: link.policy.url,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
        processes: processList,
      };
    }),
  }));
}

/** Reference libraries, used by the library view and the admin pickers. */
export async function getLibraries() {
  const [policyRows, processRows, tsmRows, teamRows] = await Promise.all([
    db.select().from(policies).orderBy(asc(policies.name)),
    db.query.processes.findMany({
      orderBy: [asc(processes.name)],
      with: { owningTeam: true },
    }),
    db.select().from(tsms).orderBy(asc(tsms.code)),
    db.select().from(teams).orderBy(asc(teams.name)),
  ]);
  return {
    policies: policyRows,
    processes: processRows,
    tsms: tsmRows,
    teams: teamRows,
  };
}

/** The role lenses, with the stage codes each one foregrounds. */
export async function getRoles(): Promise<RoleLens[]> {
  const rows = await db.query.roles.findMany({
    orderBy: [asc(roles.sortOrder)],
    with: { focus: { with: { stage: true } } },
  });
  return rows.map((role) => ({
    key: role.key,
    name: role.name,
    description: role.description,
    altitude: role.altitude as RoleLens["altitude"],
    leadAnswer: role.leadAnswer as RoleLens["leadAnswer"],
    focusStageCodes: role.focus.map((f) => f.stage.code),
  }));
}

/** Every measure with its current and prior figures. Serves the API. */
export async function getPerformance() {
  const [tsmRows, resultRows] = await Promise.all([
    db.select().from(tsms).orderBy(asc(tsms.code)),
    db.select().from(tsmResults),
  ]);

  const byTsm = new Map<number, typeof resultRows>();
  for (const r of resultRows) {
    byTsm.set(r.tsmId, [...(byTsm.get(r.tsmId) ?? []), r]);
  }

  return tsmRows.map((tsm) => {
    const rows = byTsm.get(tsm.id) ?? [];
    const now = rows.find(
      (r) => r.period === CURRENT_PERIOD && r.scope === "Organisation",
    );
    const then = rows.find(
      (r) => r.period === PRIOR_PERIOD && r.scope === "Organisation",
    );
    const value = toNumber(now?.value ?? null);
    const target = toNumber(now?.target ?? null);
    const priorValue = toNumber(then?.value ?? null);
    return {
      code: tsm.code,
      name: tsm.name,
      category: tsm.category,
      measureType: tsm.measureType,
      unit: tsm.unit,
      higherIsBetter: tsm.higherIsBetter,
      value,
      target,
      prior: priorValue,
      source: now?.source ?? null,
      status: statusFor(value, target, tsm.higherIsBetter),
      trend:
        value !== null && priorValue !== null
          ? Number((value - priorValue).toFixed(2))
          : null,
    };
  });
}

/**
 * One measure in full: its definition and every organisation-scope result,
 * oldest period first. Serves the TSM drill-down page.
 */
export async function getTsmDetail(code: string) {
  const tsm = await db.query.tsms.findFirst({
    where: eq(tsms.code, code),
    with: { results: true },
  });
  if (!tsm) return null;

  const series = tsm.results
    .filter((r) => r.scope === "Organisation")
    .map((r) => ({
      period: r.period,
      value: toNumber(r.value),
      target: toNumber(r.target),
      source: r.source,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  return {
    code: tsm.code,
    name: tsm.name,
    category: tsm.category,
    measureType: tsm.measureType,
    definition: tsm.definition,
    calculation: tsm.calculation,
    unit: tsm.unit,
    higherIsBetter: tsm.higherIsBetter,
    series,
  };
}

/** Challenges raised against the map, newest first. */
export async function getChallenges(status?: string) {
  const rows = await db.query.stageChallenges.findMany({
    orderBy: [desc(stageChallenges.createdAt)],
    with: { stage: { with: { journey: true, accountableTeam: true } } },
    ...(status ? { where: eq(stageChallenges.status, status) } : {}),
  });
  return rows.map((c) => ({
    id: c.id,
    stageCode: c.stage.code,
    stageTitle: c.stage.title,
    journeyName: c.stage.journey.name,
    journeyColour: journeyTheme(c.stage.journey.key).colour,
    owningTeam: c.stage.accountableTeam?.name ?? "Unowned",
    submittedBy: c.submittedBy,
    submittedRole: c.submittedRole,
    body: c.body,
    status: c.status,
    response: c.response,
    createdAt: c.createdAt.toISOString(),
  }));
}

export { CURRENT_PERIOD, PRIOR_PERIOD };
