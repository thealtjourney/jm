import Link from "next/link";
import { getJourneys, getLibraries } from "@/lib/queries";
import { ArrowUpRight, ChartNoAxesCombined, Link2, ShieldCheck } from "lucide-react";

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
    { title: string; journey: string; colour: string; reportable: boolean; href: string }[]
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
            href: `/map?journey=${journey.key}&stage=${stage.code}`,
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
          TSM connections
        </h1>
        <p className="mt-3 text-lg text-muted">
          See how each measure connects to the resident experience. Follow a
          link to the stages, standards and teams that can influence it.
        </p>
      </div>

      <div className="coverage-summary">
        <div><ChartNoAxesCombined size={21} /><strong>{libraries.tsms.length}</strong><span>measures in this library</span></div>
        <div><Link2 size={21} /><strong>{libraries.tsms.length - uncovered.length}</strong><span>with a reporting link</span></div>
        <div><ShieldCheck size={21} /><strong>{uncovered.length}</strong><span>without a reporting link</span></div>
      </div>
      {!libraries.tsms.some(t => t.code === "BS06") && <div className="regulatory-note"><strong>Keep the map current</strong><p>RSH added BS06 (electrical safety checks) in June 2026. It is not yet in this library, so the measures shown here are not a complete current set.</p><a href="https://www.gov.uk/government/publications/tenant-satisfaction-measures-technical-requirements" target="_blank" rel="noreferrer">Read the current requirements <ArrowUpRight size={15} /></a></div>}

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
                    <Link href={`/tsm/${tsm.code}`} className="group block">
                      <span className="rounded-md bg-answer-tsm px-2 py-0.5 text-xs font-bold text-white">
                        {tsm.code}
                      </span>
                      <p className="mt-1.5 font-semibold text-ink group-hover:underline">
                        {tsm.name}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-3 align-top text-muted">
                    {tsm.measureType === "perception" ? "Perception" : "Management"}
                  </td>
                  <td className="px-4 py-3 align-top text-muted">{tsm.category}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {stages.map((stage, i) => (
                        <Link
                          key={`${tsm.code}-${i}`}
                          href={stage.href}
                          title={`${stage.journey}${stage.reportable ? "" : " — indicative only"}`}
                          className="rounded-md border px-2 py-1 text-xs font-semibold hover:underline"
                          style={{
                            color: stage.colour,
                            borderColor: `${stage.colour}40`,
                            backgroundColor: `${stage.colour}0b`,
                          }}
                        >
                          {stage.title}
                          {!stage.reportable && " *"}
                        </Link>
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
        * Indicative link in this map. Reporting requirements vary by measure,
        stock type and provider size. Confirm shared ownership reporting scope
        against the current RSH requirements before using this map for assurance.
      </p>

      <p className="mt-8 text-sm text-muted">
        <Link href="/map" className="font-semibold text-brand underline">
          Back to the journey map
        </Link>
      </p>
    </main>
  );
}
