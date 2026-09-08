import Link from "next/link";
import { getJourneys, getLibraries } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Ref = { code: string; title: string; journey: string; colour: string; href: string };

export default async function LibraryPage() {
  const [journeys, libraries] = await Promise.all([
    getJourneys(),
    getLibraries(),
  ]);

  // Build the reverse mapping: which stages reference each policy/process.
  const policyRefs = new Map<string, Ref[]>();
  const processRefs = new Map<string, Ref[]>();

  for (const journey of journeys) {
    for (const stage of journey.stages) {
      const ref: Ref = {
        code: stage.code,
        title: stage.title,
        journey: journey.name,
        colour: journey.colour,
        href: `/map?journey=${journey.key}&stage=${stage.code}`,
      };
      for (const p of stage.policies) {
        policyRefs.set(p.code, [...(policyRefs.get(p.code) ?? []), ref]);
      }
      for (const p of stage.processes) {
        processRefs.set(p.code, [...(processRefs.get(p.code) ?? []), ref]);
      }
    }
  }

  const policyGroups = groupBy(libraries.policies, (p) => p.category);
  const processGroups = groupBy(
    libraries.processes,
    (p) => p.owningTeam?.name ?? "Unassigned",
  );

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Policy &amp; Process Library
        </h1>
        <p className="mt-3 text-lg text-muted">
          The same mapping read the other way round: every policy and process,
          and the journey stages where it applies. Open a stage to see the
          standards and teams connected to it.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-ink">
            <span
              aria-hidden
              className="h-4 w-4 rotate-45 rounded-[4px] bg-answer-policy"
            />
            Policies
            <span className="text-sm font-semibold text-muted">
              {libraries.policies.length}
            </span>
          </h2>
          <div className="flex flex-col gap-6">
            {policyGroups.map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {category}
                </h3>
                <ul className="flex flex-col gap-2">
                  {items.map((policy) => (
                    <LibraryItem
                      key={policy.code}
                      name={policy.name}
                      url={policy.url}
                      description={policy.description}
                      refs={policyRefs.get(policy.code) ?? []}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-ink">
            <span
              aria-hidden
              className="h-4 w-4 rotate-45 rounded-[4px] bg-answer-process"
            />
            Processes
            <span className="text-sm font-semibold text-muted">
              {libraries.processes.length}
            </span>
          </h2>
          <div className="flex flex-col gap-6">
            {processGroups.map(([team, items]) => (
              <div key={team}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {team}
                </h3>
                <ul className="flex flex-col gap-2">
                  {items.map((process) => (
                    <LibraryItem
                      key={process.code}
                      name={process.name}
                      href={`/processes/${process.code}`}
                      description={process.description}
                      refs={processRefs.get(process.code) ?? []}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="mt-10 text-sm text-muted">
        <Link href="/map" className="font-semibold text-brand underline">
          Back to the journey map
        </Link>
      </p>
    </main>
  );
}

function LibraryItem({
  name,
  url,
  href,
  description,
  refs,
}: {
  name: string;
  url?: string;
  /** Internal link, e.g. a process's start-to-finish timeline. */
  href?: string;
  description: string;
  refs: Ref[];
}) {
  return (
    <li className="rounded-xl border border-line bg-surface p-4">
      <p className="font-semibold text-ink">
        {href ? (
          <Link href={href} className="underline underline-offset-2">
            {name}
          </Link>
        ) : url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {name}
          </a>
        ) : (
          name
        )}
      </p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {refs.map((ref) => (
          <Link
            key={`${ref.journey}-${ref.code}`}
            href={ref.href}
            title={ref.journey}
            className="rounded-md px-2 py-0.5 text-xs font-semibold text-white hover:underline"
            style={{ backgroundColor: ref.colour }}
          >
            {ref.title}
          </Link>
        ))}
        {!refs.length && (
          <span className="rounded-md border border-dashed border-line px-2 py-0.5 text-xs font-semibold text-muted">
            Not mapped to any stage
          </span>
        )}
      </div>
    </li>
  );
}

function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item) || "Other";
    map.set(k, [...(map.get(k) ?? []), item]);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
