import Link from "next/link";
import { notFound } from "next/navigation";
import { getJourneys, getLibraries } from "@/lib/queries";
import { STATUS_META } from "@/lib/status";

export const dynamic = "force-dynamic";

/**
 * One process, start to finish: the journey stages it runs through, in order,
 * with the accountable team and indicative timescale at each step. This is the
 * page the original brief asked for — a timeline of how the process happens.
 */
export default async function ProcessPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [journeys, libraries] = await Promise.all([getJourneys(), getLibraries()]);

  const process = libraries.processes.find((p) => p.code === code);
  if (!process) notFound();

  // The stages this process runs through, kept in journey order.
  const lanes = journeys
    .map((journey) => ({
      journey,
      stages: journey.stages
        .map((stage, index) => ({ stage, position: index + 1 }))
        .filter(({ stage }) => stage.processes.some((p) => p.code === code)),
    }))
    .filter((lane) => lane.stages.length > 0);

  // Policies and TSMs that travel with this process, via its stages.
  const policies = new Map<string, { name: string; url: string }>();
  const tsms = new Map<string, { name: string; status: keyof typeof STATUS_META }>();
  for (const lane of lanes)
    for (const { stage } of lane.stages) {
      for (const p of stage.policies) policies.set(p.code, { name: p.name, url: p.url });
      for (const t of stage.tsms)
        if (t.reportable) tsms.set(t.code, { name: t.name, status: t.status });
    }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <p className="mb-2 text-sm">
        <Link href="/processes" className="font-semibold text-brand underline">
          ← All processes
        </Link>
      </p>
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {process.name}
        </h1>
        <p className="mt-3 text-lg text-muted">{process.description}</p>
        <p className="mt-3 text-sm font-semibold text-brand">
          Owned by {process.owningTeam?.name ?? "no team"}
          {process.owningTeam?.directorate
            ? ` · ${process.owningTeam.directorate}`
            : ""}
        </p>
        {lanes.some(l => l.stages.some(({ stage }) => stage.tsms.some(t => t.source === "placeholder"))) && <p className="mt-3 text-sm font-medium text-accent">Performance badges include illustrative figures, not verified stage-level results.</p>}
      </div>

      {lanes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="font-semibold text-ink">
            This process is not mapped to any journey stage yet.
          </p>
          <p className="mt-2 text-sm text-muted">
            Map it from a stage on the journey map in edit mode — an unmapped
            process is a gap worth questioning.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {lanes.map(({ journey, stages }) => {
          const bounded = stages.filter((s) => s.stage.targetDays !== null);
          const total = bounded.reduce(
            (n, s) => n + (s.stage.targetDays ?? 0),
            0,
          );
          return (
            <section key={journey.key}>
              <div className="mb-4 flex flex-wrap items-baseline gap-3">
                <span
                  aria-hidden
                  className="h-4 w-4 rotate-45 rounded-[4px]"
                  style={{ backgroundColor: journey.colour }}
                />
                <h2 className="text-xl font-bold text-ink">{journey.name}</h2>
                <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-muted">
                  touches {stages.length} of {journey.stages.length} stages
                </span>
                {bounded.length > 0 && (
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: journey.colour }}
                    title="Sum of the indicative targets for the bounded stages this process touches in this journey"
                  >
                    ~{total} days end to end
                  </span>
                )}
              </div>

              {/* The timeline itself */}
              <ol className="relative flex flex-col gap-0">
                {stages.map(({ stage, position }, i) => (
                  <li key={stage.id} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* rail */}
                    {i < stages.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[22px] top-12 bottom-0 w-0.5"
                        style={{ backgroundColor: journey.colour, opacity: 0.35 }}
                      />
                    )}
                    <span
                      className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                      style={{ backgroundColor: journey.colour }}
                      title={`Stage ${position} of ${journey.stages.length} in the journey`}
                    >
                      {position}
                    </span>
                    <div className="flex-1 rounded-2xl border border-line bg-surface p-5 shadow-sm">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span aria-hidden>{stage.icon}</span>
                        <Link href={`/map?journey=${journey.key}&stage=${stage.code}`} className="text-base font-bold text-ink hover:text-brand hover:underline">{stage.title} ↗</Link>
                        <p className="text-sm text-muted">{stage.subtitle}</p>
                        <span className="ml-auto rounded-md bg-canvas px-2 py-0.5 text-xs font-semibold text-muted">
                          {stage.targetDays !== null
                            ? `target ${stage.targetDays} days`
                            : "ongoing"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">
                        <span className="font-semibold text-brand">
                          {stage.accountableTeam?.name ?? "No owner set"}
                        </span>
                        {stage.accountableRole && (
                          <span className="text-muted"> · {stage.accountableRole}</span>
                        )}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {stage.tsms
                          .filter((t) => t.reportable)
                          .map((t) => (
                            <Link
                              key={t.code}
                              href={`/tsm/${t.code}`}
                              title={`${t.name} — ${STATUS_META[t.status].label}`}
                              className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
                              style={{ backgroundColor: STATUS_META[t.status].colour }}
                            >
                              {t.code}
                            </Link>
                          ))}
                        {stage.openChallenges > 0 && (
                          <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-bold text-white">
                            {stage.openChallenges} open challenge
                            {stage.openChallenges === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      {(policies.size > 0 || tsms.size > 0) && (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
              Policies that govern this process
            </h2>
            <ul className="flex flex-col gap-2">
              {[...policies.entries()]
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(([pcode, p]) => (
                  <li
                    key={pcode}
                    className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink"
                  >
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </li>
                ))}
              {policies.size === 0 && (
                <li className="text-sm text-muted">None mapped.</li>
              )}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
              Measures this process moves
            </h2>
            <ul className="flex flex-col gap-2">
              {[...tsms.entries()]
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([tcode, t]) => (
                  <li key={tcode}>
                    <Link
                      href={`/tsm/${tcode}`}
                      className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition hover:shadow-sm"
                    >
                      <span
                        className="rounded-md px-1.5 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: STATUS_META[t.status].colour }}
                      >
                        {tcode}
                      </span>
                      <span className="font-semibold text-ink">{t.name}</span>
                    </Link>
                  </li>
                ))}
              {tsms.size === 0 && <li className="text-sm text-muted">None mapped.</li>}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
