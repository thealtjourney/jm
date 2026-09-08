import Link from "next/link";
import {
  getJourneys,
  getPerformance,
  getChallenges,
  CURRENT_PERIOD,
  PRIOR_PERIOD,
} from "@/lib/queries";
import { STATUS_META, formatValue, describeTrend } from "@/lib/status";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

/**
 * The quarterly slide nobody has to rebuild: each journey collapsed to a
 * status per stage, then every measure with year-on-year movement. Designed
 * to print — the app chrome hides itself via .no-print.
 */
export default async function BoardPackPage() {
  const [journeys, performance, openChallenges] = await Promise.all([
    getJourneys(),
    getPerformance(),
    getChallenges("open"),
  ]);

  const generated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const anyPlaceholder =
    performance.some((p) => p.source === "placeholder") ||
    journeys.some((j) =>
      j.stages.some((s) => s.tsms.some((t) => t.source === "placeholder")),
    );

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Board pack
          </h1>
          <p className="mt-3 text-lg text-muted">
            The service in one pass: every stage&apos;s status against the
            measures it moves, then the full TSM position with movement since{" "}
            {PRIOR_PERIOD}. Generated {generated}.
          </p>
          {anyPlaceholder && (
            <p className="mt-2 text-sm font-semibold text-accent">
              Includes illustrative placeholder figures — not for assurance
              until replaced with the published return.
            </p>
          )}
        </div>
        <PrintButton />
      </div>

      {/* Journeys collapsed to RAG */}
      <div className="flex flex-col gap-8">
        {journeys.map((journey) => (
          <section
            key={journey.key}
            className="break-inside-avoid rounded-2xl border border-line bg-surface p-6"
          >
            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <span
                aria-hidden
                className="h-4 w-4 rotate-45 rounded-[4px]"
                style={{ backgroundColor: journey.colour }}
              />
              <h2 className="text-xl font-bold text-ink">{journey.name}</h2>
              <span className="text-sm text-muted">
                {journey.tenure === "LCHO"
                  ? "indicative links — confirm reporting scope"
                  : ""}
              </span>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3 font-bold">Stage</th>
                  <th className="py-2 pr-3 font-bold">Accountable</th>
                  <th className="py-2 pr-3 font-bold">Target</th>
                  <th className="py-2 pr-3 font-bold">Measures</th>
                  <th className="py-2 pr-3 font-bold">Status</th>
                  <th className="py-2 font-bold">Challenges</th>
                </tr>
              </thead>
              <tbody>
                {journey.stages.map((stage, index) => {
                  const reportable = stage.tsms.filter((t) => t.reportable);
                  return (
                    <tr key={stage.id} className="border-b border-line last:border-0">
                      <td className="py-2 pr-3 font-semibold text-ink">
                        {index + 1}. {stage.title}
                      </td>
                      <td className="py-2 pr-3 text-muted">
                        {stage.accountableTeam?.name ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-muted">
                        {stage.targetDays !== null
                          ? `${stage.targetDays}d`
                          : "ongoing"}
                      </td>
                      <td className="py-2 pr-3 text-muted">
                        {reportable.length || "—"}
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className="rounded-md px-2 py-0.5 text-xs font-bold"
                          style={{
                            backgroundColor: STATUS_META[stage.health].colour,
                            color: STATUS_META[stage.health].text,
                          }}
                        >
                          {STATUS_META[stage.health].label}
                        </span>
                      </td>
                      <td className="py-2 font-semibold text-ink">
                        {stage.openChallenges || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}

        {/* Full TSM position */}
        <section className="break-inside-avoid rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-xl font-bold text-ink">
            Tenant Satisfaction Measures · {CURRENT_PERIOD}
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="py-2 pr-3 font-bold">Measure</th>
                <th className="py-2 pr-3 font-bold">Value</th>
                <th className="py-2 pr-3 font-bold">Target</th>
                <th className="py-2 pr-3 font-bold">Status</th>
                <th className="py-2 font-bold">vs {PRIOR_PERIOD}</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((m) => {
                const movement = describeTrend(m.trend, m.higherIsBetter);
                return (
                  <tr key={m.code} className="border-b border-line last:border-0">
                    <td className="py-2 pr-3">
                      <Link
                        href={`/tsm/${m.code}`}
                        className="font-semibold text-ink hover:underline"
                      >
                        <span className="mr-2 rounded-md bg-answer-tsm px-1.5 py-0.5 text-xs font-bold text-white">
                          {m.code}
                        </span>
                        {m.name}
                      </Link>
                      {m.source === "placeholder" && (
                        <span className="ml-2 text-xs text-muted">(placeholder)</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 font-semibold text-ink">
                      {formatValue(m.value, m.unit)}
                    </td>
                    <td className="py-2 pr-3 text-muted">
                      {formatValue(m.target, m.unit)}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className="rounded-md px-2 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: STATUS_META[m.status].colour,
                          color: STATUS_META[m.status].text,
                        }}
                      >
                        {STATUS_META[m.status].label}
                      </span>
                    </td>
                    <td
                      className="py-2 text-sm font-bold"
                      style={{
                        color:
                          movement.better === null
                            ? "var(--color-muted)"
                            : movement.better
                              ? "#1e8449"
                              : "#c0392b",
                      }}
                    >
                      {movement.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Open challenges footnote */}
        <p className="text-sm text-muted">
          {openChallenges.length} open challenge
          {openChallenges.length === 1 ? "" : "s"} from the frontline against the
          map — detail at{" "}
          <Link href="/challenges" className="font-semibold text-brand underline">
            /challenges
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
