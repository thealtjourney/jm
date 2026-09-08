import Link from "next/link";
import { notFound } from "next/navigation";
import { getJourneys, getTsmDetail, CURRENT_PERIOD } from "@/lib/queries";
import { STATUS_META, formatValue, describeTrend } from "@/lib/status";

export const dynamic = "force-dynamic";

/**
 * One measure in full: how it is trending, which stages move it, and where the
 * frontline has open challenges against those stages. Coverage says what is
 * mapped; this page says how it is doing and where to act.
 */
export default async function TsmPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [tsm, journeys] = await Promise.all([
    getTsmDetail(code.toUpperCase()),
    getJourneys(),
  ]);
  if (!tsm) notFound();

  const current = tsm.series.find((s) => s.period === CURRENT_PERIOD);
  const currentStatus = statusOf(
    current?.value ?? null,
    current?.target ?? null,
    tsm.higherIsBetter,
  );
  const priorValue =
    [...tsm.series].reverse().find((s) => s.period < CURRENT_PERIOD)?.value ??
    null;
  const trend =
    current?.value != null && priorValue != null
      ? Number((current.value - priorValue).toFixed(2))
      : null;
  const movement = describeTrend(trend, tsm.higherIsBetter);

  // Stages that move this measure, with their journey context.
  const linked: {
    journey: string;
    href: string;
    colour: string;
    title: string;
    reportable: boolean;
    team: string;
    openChallenges: number;
  }[] = [];
  for (const journey of journeys)
    for (const stage of journey.stages) {
      const link = stage.tsms.find((t) => t.code === tsm.code);
      if (link)
        linked.push({
          journey: journey.name,
          href: `/map?journey=${journey.key}&stage=${stage.code}`,
          colour: journey.colour,
          title: stage.title,
          reportable: link.reportable,
          team: stage.accountableTeam?.name ?? "No owner set",
          openChallenges: stage.openChallenges,
        });
    }
  const openOnLinked = linked.reduce((n, s) => n + s.openChallenges, 0);

  const max = Math.max(
    ...tsm.series.flatMap((s) => [s.value ?? 0, s.target ?? 0]),
    1,
  );

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <p className="mb-2 text-sm">
        <Link href="/coverage" className="font-semibold text-brand underline">
          ← All measures
        </Link>
      </p>
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          <span className="mr-3 rounded-md bg-answer-tsm px-2.5 py-1 align-middle text-xl font-bold text-white">
            {tsm.code}
          </span>
          {tsm.name}
        </h1>
        <p className="mt-3 text-lg text-muted">{tsm.definition}</p>
        <p className="mt-2 text-sm text-muted">
          {tsm.measureType === "perception"
            ? "Perception measure — from the tenant survey"
            : "Management measure — landlord-reported"}
          {tsm.category && ` · ${tsm.category}`}
          {!tsm.higherIsBetter && " · lower is better"}
        </p>
      </div>

      {/* Headline */}
      <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {CURRENT_PERIOD}
          </p>
          <p className="text-3xl font-extrabold text-ink">
            {formatValue(current?.value ?? null, tsm.unit)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Target
          </p>
          <p className="text-3xl font-extrabold text-muted">
            {formatValue(current?.target ?? null, tsm.unit)}
          </p>
        </div>
        <span
          className="rounded-md px-2.5 py-1 text-sm font-bold"
          style={{
            backgroundColor: STATUS_META[currentStatus].colour,
            color: STATUS_META[currentStatus].text,
          }}
        >
          {STATUS_META[currentStatus].label}
        </span>
        {movement.better !== null && (
          <span
            className="text-sm font-bold"
            style={{ color: movement.better ? "#1e8449" : "#c0392b" }}
          >
            {movement.label} on last year
          </span>
        )}
        {current?.source === "placeholder" && (
          <span className="rounded-md border border-dashed border-line px-2 py-0.5 text-xs font-semibold text-muted">
            illustrative placeholder figure
          </span>
        )}
      </div>

      {/* Trend */}
      {tsm.series.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">
            Trend · value vs target
          </h2>
          <div className="flex items-end gap-6 rounded-2xl border border-line bg-surface p-6">
            {tsm.series.map((point) => (
              <div key={point.period} className="flex flex-col items-center gap-2">
                <div className="flex items-end gap-1.5" style={{ height: 140 }}>
                  <div
                    title={`Value: ${formatValue(point.value, tsm.unit)}`}
                    className="w-10 rounded-t-md bg-answer-tsm"
                    style={{
                      height: `${((point.value ?? 0) / max) * 100}%`,
                      opacity: point.source === "placeholder" ? 0.55 : 1,
                    }}
                  />
                  <div
                    title={`Target: ${formatValue(point.target, tsm.unit)}`}
                    className="w-10 rounded-t-md bg-line"
                    style={{ height: `${((point.target ?? 0) / max) * 100}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-ink">{point.period}</p>
                <p className="text-xs text-muted">
                  {formatValue(point.value, tsm.unit)} /{" "}
                  {formatValue(point.target, tsm.unit)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stages that move it */}
      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">
          Stages that move this measure
          {openOnLinked > 0 && (
            <span className="ml-2 rounded-md bg-accent px-1.5 py-0.5 text-xs font-bold normal-case text-white">
              {openOnLinked} open challenge{openOnLinked === 1 ? "" : "s"}
            </span>
          )}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {linked.map((stage, i) => (
            <li
              key={i}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-3 w-3 rotate-45 rounded-[3px]"
                  style={{ backgroundColor: stage.colour }}
                />
                <Link href={stage.href} className="font-semibold text-ink hover:text-brand hover:underline">{stage.title} ↗</Link>
                {stage.openChallenges > 0 && (
                  <span className="ml-auto rounded-md bg-accent px-1.5 py-0.5 text-xs font-bold text-white">
                    {stage.openChallenges}!
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                {stage.journey} · {stage.team}
                {!stage.reportable && " · indicative only"}
              </p>
            </li>
          ))}
          {linked.length === 0 && (
            <li className="text-sm text-muted">
              No stage is mapped to this measure — that is the gap to close first.
            </li>
          )}
        </ul>
      </section>

      {tsm.calculation && (
        <p className="mt-10 max-w-3xl text-sm text-muted">
          <span className="font-bold">How it is calculated:</span> {tsm.calculation}
        </p>
      )}
    </main>
  );
}

/** Same blunt rule as lib/queries — kept local to avoid exporting internals. */
function statusOf(
  value: number | null,
  target: number | null,
  higherIsBetter: boolean,
): keyof typeof STATUS_META {
  if (value === null || target === null) return "no-data";
  const gap = higherIsBetter ? value - target : target - value;
  if (gap >= 0) return "on-target";
  if (gap >= -3) return "near";
  return "off-target";
}
