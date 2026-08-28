# Housing Journey Manager

A full-stack journey map for a social housing provider. Three journeys — **property**,
**rented customer** and **shared ownership** — broken into stages, where every
stage answers four questions:

1. **What does excellent service look like here?**
2. **Which processes does it touch?**
3. **Which policies does it relate to?**
4. **Which Tenant Satisfaction Measures apply?**

It is an overview and assurance layer, not a case management system: it holds no
case data and is not a system of record. It describes how the service is meant
to work, who is answerable for each part of it, and whether the measures that
part moves are being hit.

> **The seeded content is illustrative.** The journeys, policies, processes and
> performance figures are a generic first-pass drawn from standard UK social
> housing practice. They are a starting point to edit in the app, not any real
> provider's published standards, and the performance figures are invented.

## Stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router)                            |
| ORM        | Drizzle                                           |
| Styling    | Tailwind CSS v4                                   |
| Hosting    | Vercel                                            |
| Database   | Neon (Postgres) in production, Docker locally      |

## Data model

```
teams ──< stages ──< stage_processes >── processes >── teams
              │  ──< stage_policies  >── policies
              │  ──< stage_tsms      >── tsms ──< tsm_results
              ├──< stage_challenges
              └──< role_focus >── roles
```

Question 1 is a column on `stages` (`excellence`). Questions 2–4 are
many-to-many joins, so the mapping reads in both directions: from a stage to its
policies, and from a policy back to every stage where it bites (see `/library`).

### Ownership

Every stage names one **accountable team** and the post that carries it. The
other teams involved are *derived* from the processes mapped to that stage —
each process names its owning team — so "who is involved here" stays true
without being a second thing to maintain.

### Role lenses

A role changes where you land and at what altitude. It never changes what you
can reach: every lens keeps the whole map one click away, which is the point of
having one shared picture rather than several different tools.

| Lens | Foregrounds | Altitude | Opens on |
| --- | --- | --- | --- |
| Everyone | the whole map | detail | Excellent service |
| Housing Officer | rented journey, letting to moving on | detail | Excellent service |
| Neighbourhoods Manager | estates, ASB, complaints, voids, assets | team | Processes |
| Executive & Board | everything, collapsed to RAG | summary | TSMs |
| Asset & Property | the property journey plus repairs | team | Processes |
| Home Ownership | the shared ownership journey | detail | Excellent service |
| New Starter | the whole map, in order | detail | Excellent service |

The choice is stored in a cookie. It is a reader preference, not a permission,
so an unknown or missing value simply falls back to the full map.

### A note on TSMs and tenure

Tenant Satisfaction Measures are reported for **Low Cost Rental Accommodation**.
Shared ownership households sit outside the TSM perception survey, so measuring
a shared ownership stage against a TSM and reporting it would be wrong.

Shared ownership stages still influence those measures, though, so the links are
kept rather than dropped: each row in `stage_tsms` carries a `reportable` flag.
Shared ownership links are stored as **indicative only**, badged as such in the
UI, and excluded from the coverage report.

All 22 measures are seeded, and every one has at least one reportable stage
mapped against it.

## Performance figures

`tsm_results` holds a value and target per measure per period. Figures appear
in context on each stage — against target, with movement since the prior year —
rather than on a separate dashboard, and the Executive lens rolls them up to a
status per stage.

**Every seeded figure is illustrative.** Rows are seeded with
`source: "placeholder"` and badged as such everywhere they appear. Recording a
real figure via `PATCH /api/performance` marks it `return` or `internal`, which
also protects it from being overwritten by a re-seed.

There is no performance dashboard. That is deliberate: this is an overview of
how the service works, and the numbers earn their place by sitting next to the
standard they measure, not in a table of their own.

## Challenges

Any reader can open a stage and say "this isn't what happens" — no sign-in.
That is deliberate: the people best placed to spot a wrong map are the least
likely to hold an admin password. Submissions are capped in length, stored as
plain text and only ever rendered as text. Open challenges show as a counter on
the stage card and route to the accountable team on `/challenges`, where an
admin can respond and close them.

## Content status

All seeded content is a **first-pass authored set** — 25 stages, 42 policies and
77 processes drawn from standard UK social housing practice. It is a starting
point to correct in the app, not a statement of how any particular organisation
works. Policy documents are seeded without links; add real URLs through the
admin UI or `PATCH /api/policies`.

## Access model

Open to read, password to edit:

- Anyone who can reach the site can view every journey, the library and the
  coverage report.
- "Edit mode" takes a single shared password (`ADMIN_PASSWORD`) and issues a
  signed, HTTP-only session cookie valid for 12 hours.
- Every write endpoint re-checks that cookie server-side.

This is deliberately light. If it later needs per-person accountability, swap
the cookie check in `lib/auth.ts` for Entra ID — the API routes call a single
`requireAdmin()` and would not otherwise change.

## Local development

Requires Node 20+ and a Postgres to point at. With Docker:

```bash
docker run -d --name hjm-pg -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=journeymanager -p 55432:5432 postgres:16-alpine
```

Then:

```bash
cp .env.example .env.local   # set DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The app runs at http://localhost:3000.

### Re-seeding

`npm run db:seed` is safe to re-run. It refreshes reference data, ownership and
the policy/process/TSM mappings, but preserves everything the organisation has
put in by hand:

- editorial changes to a stage's activity and excellence copy
- policy document URLs
- TSM figures marked `return` or `internal` (only `placeholder` rows are replaced)
- challenges, which the seed never touches

To also reset the editorial copy back to the seeded text:

```bash
npm run db:seed -- --force
```

## Database driver

The driver is chosen at runtime from the connection string, so the same code
runs on a serverless platform and on a long-lived server:

| Host | Driver | Where |
| --- | --- | --- |
| `*.neon.tech` | `@neondatabase/serverless` over WebSockets | Vercel — functions cannot hold a TCP pool open between invocations |
| anything else | `node-postgres` | Local development against Docker |

Set `DB_DRIVER=neon` or `DB_DRIVER=node` to override the detection.

The WebSocket driver is used rather than Neon's HTTP one because
`PATCH /api/stages/[id]` runs a real transaction, which `neon-http` does not
support. On Vercel the node-postgres pool is also capped at one connection per
invocation, so concurrent functions cannot exhaust the database.

## Deploying to Vercel

### 1. Create a database

Any Postgres works, but Neon is the path of least resistance — add it from the
Vercel dashboard under **Storage → Neon**, or sign up at neon.tech and paste the
connection string in yourself.

Use the **pooled** connection string (the host contains `-pooler`) for
`DATABASE_URL`. Optionally set `DIRECT_URL` to the unpooled one; migrations use
it if present.

> Put the database in the same region as the functions. `vercel.json` pins them
> to London (`lhr1`); a database in `us-east-1` means every query crosses the
> Atlantic.

### 2. Set environment variables

In **Project → Settings → Environment Variables**:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | pooled Postgres connection string |
| `ADMIN_PASSWORD` | the password that unlocks edit mode |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `DIRECT_URL` | optional, unpooled URL for migrations |

### 3. Migrate and seed

Run these from your machine against the remote database — they are deliberately
not part of the build:

```bash
DATABASE_URL="<your connection string>" npm run db:migrate
```

```bash
DATABASE_URL="<your connection string>" npm run db:seed
```

### 4. Deploy

Push to GitHub and import the repo in Vercel — every push to the default branch
then deploys. Or deploy straight from your machine:

```bash
npx vercel --prod
```

`vercel.json` pins the functions to London (`lhr1`) and caps them at 15 seconds.

### Known rough edges

This is a prototype, and two things are worth knowing before it carries traffic:

- **Every page is `force-dynamic`**, so each view is a function invocation plus a
  database round trip. The content changes rarely, so caching with on-demand
  revalidation on save would cut both. Not worth doing until traffic is real.
- **Neon's cheaper tiers idle the database out**, so the first request after a
  quiet spell pays roughly half a second to wake it.

## API

| Method   | Route               | Auth  | Purpose                                      |
| -------- | ------------------- | ----- | -------------------------------------------- |
| `GET`    | `/api/admin`        | —     | Whether the caller holds an admin session     |
| `POST`   | `/api/admin`        | —     | Exchange the shared password for a session    |
| `DELETE` | `/api/admin`        | —     | Leave edit mode                               |
| `PATCH`  | `/api/stages/[id]`  | admin | Update stage copy and its four answer sets    |
| `GET`    | `/api/policies`     | —     | List the policy library                       |
| `PATCH`  | `/api/policies`     | admin | Attach a document URL to a policy             |
| `GET`    | `/api/performance`  | —     | Every measure with current and prior figures  |
| `PATCH`  | `/api/performance`  | admin | Record a real value and target for a measure  |
| `GET`    | `/api/challenges`   | —     | Challenges raised against the map             |
| `POST`   | `/api/challenges`   | —     | Raise a challenge against a stage              |
| `PATCH`  | `/api/challenges`   | admin | Respond to a challenge and close it            |

Stage updates run in a transaction, and unknown policy/process/TSM codes are
rejected before any write. Policy URLs are restricted to `http`/`https`.

## Pages

- `/` — the journey map; click any stage for its four answers
- `/library` — every policy and process, and the stages that reference it
- `/coverage` — all 22 TSMs against the stages that move them, flagging any
  measure with no reportable stage
- `/challenges` — what the frontline says the map gets wrong
