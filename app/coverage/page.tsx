import Link from "next/link";
import { getJourneys, getLibraries } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const [journeys, libraries] = await Promise.all([
    getJourneys(),
    getLibraries(),
  ]);

  // For each TSM, which stages influence it — split by whether the stage sits
  // in a tenure the measure is actually reported for.
  const coverage = new Map<
    string,
    { title: string; journey: string; colour: string; reportable: boolean }[]
  >();

  for (const journey of journeys) {
    for (const stage of journey.stages) {
      for (const tsm of stage.tsms) {
        coverage.set(tsm.code, [
          ...(coverage.get(tsm.code) ?? []),
          {
            title: stage.title,
            journey: journey.name,
            colour: journey.colour,
            reportable: tsm.reportable,
          },
        ]);
      }
    }
  }

  const uncovered = libraries.tsms.filter(
    (t) => !(coverage.get(t.code) ?? []).some((s) => s.reportable),
  );

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          TSM Coverage
        </h1>
        <p className="mt-3 text-lg text-muted">
          All 22 Tenant Satisfaction Measures and the journey stages that move
          them. A measure with no reportable stage against it has no owner in
          the map — that is the gap to close first.
        </p>
      </div>

      {uncovered.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {uncovered.length} measure{uncovered.length === 1 ? "" : "s"} with no
            reportable stage mapped:{" "}
            <span className="font-mono">
              {uncovered.map((t) => t.code).join(", ")}
            </span>
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-bold text-ink">Measure</th>
              <th className="px-4 py-3 font-bold text-ink">Type</th>
              <th className="px-4 py-3 font-bold text-ink">Theme</th>
              <th className="px-4 py-3 font-bold text-ink">Stages that move it</th>
            </tr>
          </thead>
          <tbody>
            {libraries.tsms.map((tsm) => {
              const stages = coverage.get(tsm.code) ?? [];
              return (
                <tr key={tsm.code} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 align-top">
                    <span className="rounded-md bg-answer-tsm px-2 py-0.5 text-xs font-bold text-white">
                      {tsm.code}
                    </span>
                    <p className="mt-1.5 font-semibold text-ink">{tsm.name}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-muted">
                    {tsm.measureType === "perception" ? "Perception" : "Management"}
                  </td>
                  <td className="px-4 py-3 align-top text-muted">{tsm.category}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {stages.map((stage, i) => (
                        <span
                          key={`${tsm.code}-${i}`}
                          title={`${stage.journey}${stage.reportable ? "" : " — indicative only"}`}
                          className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
                          style={{
                            backgroundColor: stage.colour,
                            opacity: stage.reportable ? 1 : 0.45,
                          }}
                        >
                          {stage.title}
                          {!stage.reportable && " *"}
                        </span>
                      ))}
                      {!stages.length && (
                        <span className="rounded-md border border-dashed border-line px-2 py-0.5 text-xs font-semibold text-muted">
                          Not mapped
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted">
        * Shared ownership stage. These households sit outside the TSM perception
        survey, so the link records influence rather than a reportable return.
      </p>

      <p className="mt-8 text-sm text-muted">
        <Link href="/" className="font-semibold text-brand underline">
          Back to the journey map
        </Link>
      </p>
    </main>
  );
}
