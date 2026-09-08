import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * The map has three journeys (property, rented customer, shared ownership).
 * Each journey is an ordered list of stages, and every stage answers four
 * questions, which is what the three join tables below exist for:
 *
 *   1. What does excellent service look like?  -> stages.excellence
 *   2. Which processes does it touch?          -> stageProcesses
 *   3. Which policies does it relate to?       -> stagePolicies
 *   4. Which TSMs apply?                       -> stageTsms
 *
 * On top of that sit the things that make it usable rather than merely true:
 * who owns each stage (teams), who is looking (roles), how the measures are
 * actually performing (tsmResults), and where the frontline says the map is
 * wrong (stageChallenges).
 *
 * This is an overview and assurance layer. It deliberately holds no case data
 * and is not a system of record - it points at the systems that are.
 */

// ---------------------------------------------------------------------------
// Who does the work
// ---------------------------------------------------------------------------

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  directorate: text("directorate").notNull().default(""),
  description: text("description").notNull().default(""),
});

// ---------------------------------------------------------------------------
// The map
// ---------------------------------------------------------------------------

export const journeys = pgTable("journeys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  /** Tenure the journey covers - drives whether TSMs are reportable. */
  tenure: text("tenure").notNull().default("LCRA"),
  colour: text("colour").notNull().default("#0f4c5c"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const stages = pgTable(
  "stages",
  {
    id: serial("id").primaryKey(),
    journeyId: integer("journey_id")
      .notNull()
      .references(() => journeys.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    icon: text("icon").notNull().default("\u{1F4CD}"),
    /** Visual grouping carried over from the original map. */
    type: text("type").notNull().default("customer"),
    /** What the organisation actually does at this stage (HTML). */
    activities: text("activities").notNull().default(""),
    /** Question 1: what excellent service looks like here (HTML). */
    excellence: text("excellence").notNull().default(""),

    /** The team answerable for this stage. Other teams contribute via processes. */
    accountableTeamId: integer("accountable_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    /** The named post that carries it, e.g. "Head of Repairs & Voids". */
    accountableRole: text("accountable_role").notNull().default(""),
    /** When the content was last confirmed as accurate by its owner. */
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    /**
     * Indicative target for how long this stage should take, in days.
     * Null means the stage is ongoing (e.g. "Living in the home") rather than
     * a bounded piece of work. This is what turns a journey from a sequence
     * into a timeline.
     */
    targetDays: integer("target_days"),

    sortOrder: integer("sort_order").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("stages_code_idx").on(t.code)],
);

/** Question 2: the operational processes a stage touches. */
export const processes = pgTable("processes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  /** The team that runs this process. Drives "who else is involved" per stage. */
  owningTeamId: integer("owning_team_id").references(() => teams.id, {
    onDelete: "set null",
  }),
  description: text("description").notNull().default(""),
});

/** Question 3: the policies a stage is governed by. */
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  description: text("description").notNull().default(""),
  url: text("url").notNull().default(""),
});

/** Question 4: the Tenant Satisfaction Measures. */
export const tsms = pgTable("tsms", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  /** "perception" (survey) or "management" (landlord-reported). */
  measureType: text("measure_type").notNull().default("perception"),
  definition: text("definition").notNull().default(""),
  calculation: text("calculation").notNull().default(""),
  /** False for measures where a lower number is better (CH01, NM01, RP01). */
  higherIsBetter: boolean("higher_is_better").notNull().default(true),
  /** "%" or "per 1,000 homes". */
  unit: text("unit").notNull().default("%"),
});

// ---------------------------------------------------------------------------
// Join tables - the four answers
// ---------------------------------------------------------------------------

export const stageProcesses = pgTable(
  "stage_processes",
  {
    stageId: integer("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
    processId: integer("process_id")
      .notNull()
      .references(() => processes.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.stageId, t.processId] })],
);

export const stagePolicies = pgTable(
  "stage_policies",
  {
    stageId: integer("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
    policyId: integer("policy_id")
      .notNull()
      .references(() => policies.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.stageId, t.policyId] })],
);

export const stageTsms = pgTable(
  "stage_tsms",
  {
    stageId: integer("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
    tsmId: integer("tsm_id")
      .notNull()
      .references(() => tsms.id, { onDelete: "cascade" }),
    /**
     * TSMs are not reported for shared ownership. Where such a stage influences
     * a measure the link is kept but flagged, so nobody reports it as a return.
     */
    reportable: boolean("reportable").notNull().default(true),
  },
  (t) => [primaryKey({ columns: [t.stageId, t.tsmId] })],
);

// ---------------------------------------------------------------------------
// Performance - reference figures, not live data
// ---------------------------------------------------------------------------

export const tsmResults = pgTable(
  "tsm_results",
  {
    id: serial("id").primaryKey(),
    tsmId: integer("tsm_id")
      .notNull()
      .references(() => tsms.id, { onDelete: "cascade" }),
    /** Reporting year, e.g. "2024-25". */
    period: text("period").notNull(),
    /** "Organisation" or a named patch / region. */
    scope: text("scope").notNull().default("Organisation"),
    value: numeric("value", { precision: 6, scale: 2 }),
    target: numeric("target", { precision: 6, scale: 2 }),
    /**
     * Where the number came from: "placeholder" (illustrative, seeded),
     * "return" (published TSM return) or "internal" (management reporting).
     */
    source: text("source").notNull().default("placeholder"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("tsm_results_unique_idx").on(t.tsmId, t.period, t.scope)],
);

// ---------------------------------------------------------------------------
// Role lenses - a default view, never a restriction
// ---------------------------------------------------------------------------

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  /** "detail" | "team" | "summary" - how much to show by default. */
  altitude: text("altitude").notNull().default("detail"),
  /** Which of the four answers leads: excellence | processes | policies | tsms. */
  leadAnswer: text("lead_answer").notNull().default("excellence"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * Stages a role cares about most. Empty for a role means "the whole map".
 * This only reorders and highlights - everything stays reachable.
 */
export const roleFocus = pgTable(
  "role_focus",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    stageId: integer("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.stageId] })],
);

// ---------------------------------------------------------------------------
// Frontline feedback - "that is not what happens"
// ---------------------------------------------------------------------------

export const stageChallenges = pgTable("stage_challenges", {
  id: serial("id").primaryKey(),
  stageId: integer("stage_id")
    .notNull()
    .references(() => stages.id, { onDelete: "cascade" }),
  /** Free text, so the map can be challenged without needing an account. */
  submittedBy: text("submitted_by").notNull().default(""),
  submittedRole: text("submitted_role").notNull().default(""),
  body: text("body").notNull(),
  /** "open" | "accepted" | "declined" */
  status: text("status").notNull().default("open"),
  response: text("response").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const teamsRelations = relations(teams, ({ many }) => ({
  stages: many(stages),
  processes: many(processes),
}));

export const journeysRelations = relations(journeys, ({ many }) => ({
  stages: many(stages),
}));

export const stagesRelations = relations(stages, ({ one, many }) => ({
  journey: one(journeys, {
    fields: [stages.journeyId],
    references: [journeys.id],
  }),
  accountableTeam: one(teams, {
    fields: [stages.accountableTeamId],
    references: [teams.id],
  }),
  stageProcesses: many(stageProcesses),
  stagePolicies: many(stagePolicies),
  stageTsms: many(stageTsms),
  challenges: many(stageChallenges),
  roleFocus: many(roleFocus),
}));

export const processesRelations = relations(processes, ({ one, many }) => ({
  owningTeam: one(teams, {
    fields: [processes.owningTeamId],
    references: [teams.id],
  }),
  stageProcesses: many(stageProcesses),
}));

export const policiesRelations = relations(policies, ({ many }) => ({
  stagePolicies: many(stagePolicies),
}));

export const tsmsRelations = relations(tsms, ({ many }) => ({
  stageTsms: many(stageTsms),
  results: many(tsmResults),
}));

export const tsmResultsRelations = relations(tsmResults, ({ one }) => ({
  tsm: one(tsms, { fields: [tsmResults.tsmId], references: [tsms.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  focus: many(roleFocus),
}));

export const roleFocusRelations = relations(roleFocus, ({ one }) => ({
  role: one(roles, { fields: [roleFocus.roleId], references: [roles.id] }),
  stage: one(stages, { fields: [roleFocus.stageId], references: [stages.id] }),
}));

export const stageChallengesRelations = relations(stageChallenges, ({ one }) => ({
  stage: one(stages, {
    fields: [stageChallenges.stageId],
    references: [stages.id],
  }),
}));

export const stageProcessesRelations = relations(stageProcesses, ({ one }) => ({
  stage: one(stages, {
    fields: [stageProcesses.stageId],
    references: [stages.id],
  }),
  process: one(processes, {
    fields: [stageProcesses.processId],
    references: [processes.id],
  }),
}));

export const stagePoliciesRelations = relations(stagePolicies, ({ one }) => ({
  stage: one(stages, {
    fields: [stagePolicies.stageId],
    references: [stages.id],
  }),
  policy: one(policies, {
    fields: [stagePolicies.policyId],
    references: [policies.id],
  }),
}));

export const stageTsmsRelations = relations(stageTsms, ({ one }) => ({
  stage: one(stages, { fields: [stageTsms.stageId], references: [stages.id] }),
  tsm: one(tsms, { fields: [stageTsms.tsmId], references: [tsms.id] }),
}));
