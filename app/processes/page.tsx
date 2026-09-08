import Link from "next/link";
import { getJourneys, getLibraries } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * The process directory: one tile per process, grouped by owning team, each
 * linking to a start-to-finish timeline of that process. This is the exec's
 * front door — pick a process, see how it is meant to run.
 */
export default async function ProcessesPage() {
  const [journeys, libraries] = await Promise.all([getJourneys(), getLibraries()]);

  // How many stages each process touches, for the tile badge.
  const stageCount = new Map<string, number>();
  for (const j of journeys)
    for (const s of j.stages)
      for (const p of s.processes)
        stageCount.set(p.code, (stageCount.get(p.code) ?? 0) + 1);

  const groups = new Map<string, typeof libraries.processes>();
  for (const p of libraries.processes) {
    const team = p.owningTeam?.name ?? "Unassigned";
    groups.set(team, [...(groups.get(team) ?? []), p]);
  }

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Processes
        </h1>
        <p className="mt-3 text-lg text-muted">
          Every operational process, grouped by the team that owns it. Open one
          to see it start to finish: the journey stages it runs through, who is
          accountable at each, and how long each step should take.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {[...groups.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([team, items]) => (
            <section key={team}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
                {team}
                <span className="ml-2 font-semibold normal-case tracking-normal">
                  {items.length} process{items.length === 1 ? "" : "es"}
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((process) => {
                  const count = stageCount.get(process.code) ?? 0;
                  return (
                    <Link
                      key={process.code}
                      href={`/processes/${process.code}`}
                      className="flex flex-col rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="font-semibold text-ink">{process.name}</p>
                      <p className="mt-1 flex-1 text-sm text-muted">
                        {process.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-answer-process">
                        {count
                          ? `${count} stage${count === 1 ? "" : "s"} →`
                          : "Not mapped to any stage"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}
