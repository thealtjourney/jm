CREATE TABLE "journeys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tenure" text DEFAULT 'LCRA' NOT NULL,
	"colour" text DEFAULT '#0f4c5c' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "journeys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	CONSTRAINT "policies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "processes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"owning_team_id" integer,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "processes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "role_focus" (
	"role_id" integer NOT NULL,
	"stage_id" integer NOT NULL,
	CONSTRAINT "role_focus_role_id_stage_id_pk" PRIMARY KEY("role_id","stage_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"altitude" text DEFAULT 'detail' NOT NULL,
	"lead_answer" text DEFAULT 'excellence' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "roles_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "stage_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"stage_id" integer NOT NULL,
	"submitted_by" text DEFAULT '' NOT NULL,
	"submitted_role" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"response" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stage_policies" (
	"stage_id" integer NOT NULL,
	"policy_id" integer NOT NULL,
	CONSTRAINT "stage_policies_stage_id_policy_id_pk" PRIMARY KEY("stage_id","policy_id")
);
--> statement-breakpoint
CREATE TABLE "stage_processes" (
	"stage_id" integer NOT NULL,
	"process_id" integer NOT NULL,
	CONSTRAINT "stage_processes_stage_id_process_id_pk" PRIMARY KEY("stage_id","process_id")
);
--> statement-breakpoint
CREATE TABLE "stage_tsms" (
	"stage_id" integer NOT NULL,
	"tsm_id" integer NOT NULL,
	"reportable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "stage_tsms_stage_id_tsm_id_pk" PRIMARY KEY("stage_id","tsm_id")
);
--> statement-breakpoint
CREATE TABLE "stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"journey_id" integer NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT '📍' NOT NULL,
	"type" text DEFAULT 'customer' NOT NULL,
	"activities" text DEFAULT '' NOT NULL,
	"excellence" text DEFAULT '' NOT NULL,
	"accountable_team_id" integer,
	"accountable_role" text DEFAULT '' NOT NULL,
	"last_reviewed_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"directorate" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "teams_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "tsm_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"tsm_id" integer NOT NULL,
	"period" text NOT NULL,
	"scope" text DEFAULT 'Organisation' NOT NULL,
	"value" numeric(6, 2),
	"target" numeric(6, 2),
	"source" text DEFAULT 'placeholder' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tsms" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"measure_type" text DEFAULT 'perception' NOT NULL,
	"definition" text DEFAULT '' NOT NULL,
	"calculation" text DEFAULT '' NOT NULL,
	"higher_is_better" boolean DEFAULT true NOT NULL,
	"unit" text DEFAULT '%' NOT NULL,
	CONSTRAINT "tsms_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "processes" ADD CONSTRAINT "processes_owning_team_id_teams_id_fk" FOREIGN KEY ("owning_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_focus" ADD CONSTRAINT "role_focus_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_focus" ADD CONSTRAINT "role_focus_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_challenges" ADD CONSTRAINT "stage_challenges_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_policies" ADD CONSTRAINT "stage_policies_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_policies" ADD CONSTRAINT "stage_policies_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_processes" ADD CONSTRAINT "stage_processes_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_processes" ADD CONSTRAINT "stage_processes_process_id_processes_id_fk" FOREIGN KEY ("process_id") REFERENCES "public"."processes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_tsms" ADD CONSTRAINT "stage_tsms_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_tsms" ADD CONSTRAINT "stage_tsms_tsm_id_tsms_id_fk" FOREIGN KEY ("tsm_id") REFERENCES "public"."tsms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_accountable_team_id_teams_id_fk" FOREIGN KEY ("accountable_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tsm_results" ADD CONSTRAINT "tsm_results_tsm_id_tsms_id_fk" FOREIGN KEY ("tsm_id") REFERENCES "public"."tsms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stages_code_idx" ON "stages" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "tsm_results_unique_idx" ON "tsm_results" USING btree ("tsm_id","period","scope");