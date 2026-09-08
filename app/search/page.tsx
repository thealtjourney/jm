import { getJourneys, getLibraries } from "@/lib/queries";
import SearchClient, { type SearchItem } from "@/components/SearchClient";

export const dynamic = "force-dynamic";

/**
 * One box over the whole map. The dataset is small enough to ship to the
 * client and filter there — no search infrastructure required.
 */
export default async function SearchPage() {
  const [journeys, libraries] = await Promise.all([getJourneys(), getLibraries()]);

  const items: SearchItem[] = [];

  for (const journey of journeys)
    for (const stage of journey.stages)
      items.push({
        kind: "Stage",
        code: stage.code,
        title: stage.title,
        subtitle: `${journey.name} · ${stage.accountableTeam?.name ?? "no owner"}`,
        href: `/map?journey=${journey.key}&stage=${stage.code}`,
        haystack: `${stage.subtitle} ${stage.accountableRole}`,
      });

  for (const process of libraries.processes)
    items.push({
      kind: "Process",
      code: process.code,
      title: process.name,
      subtitle: process.owningTeam?.name ?? "Unassigned",
      href: `/processes/${process.code}`,
      haystack: process.description,
    });

  for (const policy of libraries.policies)
    items.push({
      kind: "Policy",
      code: policy.code,
      title: policy.name,
      subtitle: policy.category,
      href: "/library",
      haystack: policy.description,
    });

  for (const tsm of libraries.tsms)
    items.push({
      kind: "TSM",
      code: tsm.code,
      title: `${tsm.code} · ${tsm.name}`,
      subtitle: tsm.category,
      href: `/tsm/${tsm.code}`,
      haystack: tsm.definition,
    });

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Search
        </h1>
        <p className="mt-3 text-lg text-muted">
          Everything in the map — stages, processes, policies and measures — from
          one box.
        </p>
      </div>
      <SearchClient items={items} />
    </main>
  );
}
