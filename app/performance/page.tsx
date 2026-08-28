import Link from "next/link";
import { getJourneys, getPerformance, CURRENT_PERIOD, PRIOR_PERIOD } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import PerformanceTable from "@/components/PerformanceTable";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const [measures, journeys, admin] = await Promise.all([
    getPerformance(),
    getJourneys(),
    isAdmin(),
  ]);

  // Which team is answerable for each measure, via the stages that move it.
  const ownersByCode = new Map<string, Set<string>>();
  for (const journey of journeys) {
    for (const stage of journey.stages) {
      for (const tsm of stage.tsms) {
        if (!tsm.reportable) continue;
        const team = stage.accountableTeam?.name;
        if (!team) continue;
        ownersByCode.set(
          tsm.code,
          (ownersByCode.get(tsm.code) ?? new Set<string>()).add(team),
        );
      }
    }
  }

  const rows = measures.map((m) => ({
    ...m,
    owners: [...(ownersByCode.get(m.code) ?? [])].sort(),
  }));

  const placeholders = rows.filter((r) => r.source === "placeholder").length;
  const offTarget = rows.filter((r) => r.status === "off-target").length;

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Performance
        </h1>
        <p className="mt-3 text-lg text-muted">
          Every Tenant Satisfaction Measure against target for {CURRENT_PERIOD}, with
          movement since {PRIOR_PERIOD} and the team answerable for it. This is the
          feedback loop on the map: it is what tells you the standard is not being met.
        </p>
      </div>

      {placeholders > 0 && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {placeholders} of {rows.length} figures are illustrative placeholders,
            not your real TSM return.
          </p>
          <p className="mt-1 text-sm text-amber-900">
            {admin
              ? "Replace them below — saving a figure marks it as real and protects it from being overwritten by a re-seed."
              : "Sign in to edit mode on the journey map to replace them."}
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <Stat label="Measures" value={String(rows.length)} />
        <Stat label="Off target" value={String(offTarget)} tone="bad" />
        <Stat
          label="On target"
          value={String(rows.filter((r) => r.status === "on-target").length)}
          tone="good"
        />
        <Stat
          label="Unowned"
          value={String(rows.filter((r) => r.owners.length === 0).length)}
        />
      </div>

      <PerformanceTable rows={rows} admin={admin} period={CURRENT_PERIOD} />

      <p className="mt-8 text-sm text-muted">
        <Link href="/" className="font-semibold text-brand underline">
          Back to the journey map
        </Link>
      </p>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  const colour =
    tone === "good" ? "text-green-700" : tone === "bad" ? "text-red-600" : "text-ink";
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className={`text-2xl font-extrabold ${colour}`}>{value}</p>
    </div>
  );
}
