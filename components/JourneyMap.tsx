"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { JourneyDetail, RoleLens, StageDetail as Stage } from "@/lib/queries";
import { STATUS_META } from "@/lib/status";
import StageDetail from "./StageDetail";
import AdminBar from "./AdminBar";
import RoleSwitcher from "./RoleSwitcher";

type Library = {
  policies: { code: string; name: string; category: string }[];
  processes: { code: string; name: string; team: string }[];
  tsms: { code: string; name: string; category: string }[];
};

export default function JourneyMap({
  journeys,
  library,
  initialAdmin,
  roles,
  activeRole,
}: {
  journeys: JourneyDetail[];
  library: Library;
  initialAdmin: boolean;
  roles: RoleLens[];
  activeRole: RoleLens;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState(initialAdmin);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<{
    stage: Stage;
    journey: JourneyDetail;
  } | null>(null);

  const focus = useMemo(
    () => new Set(activeRole.focusStageCodes),
    [activeRole.focusStageCodes],
  );
  const lensActive = focus.size > 0 && !showAll;
  const summary = activeRole.altitude === "summary";

  // A lens hides nothing permanently - it drops journeys with no focused stage
  // out of the default view, and "Show the whole map" brings them straight back.
  const visible = useMemo(() => {
    if (!lensActive) return journeys;
    return journeys
      .map((j) => ({ ...j, stages: j.stages.filter((s) => focus.has(s.code)) }))
      .filter((j) => j.stages.length > 0);
  }, [journeys, focus, lensActive]);

  const hiddenStages = lensActive
    ? journeys.reduce((n, j) => n + j.stages.length, 0) -
      visible.reduce((n, j) => n + j.stages.length, 0)
    : 0;

  return (
    <>
      <RoleSwitcher
        roles={roles}
        active={activeRole}
        showingEverything={showAll}
        onShowEverything={setShowAll}
      />
      <AdminBar admin={admin} onChange={setAdmin} />

      <main className="mx-auto max-w-[1600px] px-6 py-10">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Customer &amp; Property Journey Map
          </h1>
          <p className="mt-3 text-lg text-muted">
            Three journeys, stage by stage. Open any stage to see what excellent
            service looks like there, which processes it touches, which policies
            govern it, which Tenant Satisfaction Measures it moves — and who is
            answerable for it.
          </p>
          {hiddenStages > 0 && (
            <p className="mt-3 text-sm text-muted">
              Showing the {visible.reduce((n, j) => n + j.stages.length, 0)} stages
              most relevant to a {activeRole.name.toLowerCase()}.{" "}
              <button
                onClick={() => setShowAll(true)}
                className="font-semibold text-brand underline"
              >
                Show the other {hiddenStages}
              </button>
              .
            </p>
          )}
        </div>

        <div className="flex flex-col gap-14">
          {visible.map((journey) => (
            <section key={journey.key}>
              <div className="mb-4 flex flex-wrap items-baseline gap-3">
                <span
                  aria-hidden
                  className="h-4 w-4 rotate-45 rounded-[4px]"
                  style={{ backgroundColor: journey.colour }}
                />
                <h2 className="text-xl font-bold text-ink">{journey.name}</h2>
                <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-muted">
                  {journey.stages.length} stages
                </span>
                <span
                  className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: journey.colour }}
                  title={
                    journey.tenure === "LCRA"
                      ? "Low Cost Rental Accommodation — TSMs are reportable"
                      : journey.tenure === "LCHO"
                        ? "Low Cost Home Ownership — outside the TSM return"
                        : "Asset journey — no direct TSM return"
                  }
                >
                  {journey.tenure}
                </span>
                <p className="w-full text-sm text-muted sm:w-auto sm:flex-1">
                  {journey.description}
                </p>
              </div>

              <div className="rail flex gap-4 overflow-x-auto rounded-2xl bg-surface/60 p-4">
                {journey.stages.map((stage, index) => (
                  <button
                    key={stage.id}
                    onClick={() => setSelected({ stage, journey })}
                    className="group relative flex w-64 shrink-0 flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl"
                      style={{ backgroundColor: journey.colour }}
                    />
                    <div className="mb-3 flex items-center justify-between">
                      <span aria-hidden className="text-3xl">
                        {stage.icon}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {stage.openChallenges > 0 && (
                          <span
                            title={`${stage.openChallenges} open challenge(s) from the frontline`}
                            className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-bold text-white"
                          >
                            {stage.openChallenges}!
                          </span>
                        )}
                        <span className="text-xs font-bold text-muted">
                          {index + 1}/{journey.stages.length}
                        </span>
                      </div>
                    </div>
                    <p className="text-base font-bold text-ink">{stage.title}</p>
                    <p className="text-sm text-muted">{stage.subtitle}</p>

                    {/* Phase 1: ownership is visible without opening the stage. */}
                    <p className="mt-3 text-xs font-semibold text-brand">
                      {stage.accountableTeam?.name ?? "No owner set"}
                    </p>

                    {summary ? (
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className="rounded-md px-2 py-0.5 text-xs font-bold"
                          style={{
                            backgroundColor: STATUS_META[stage.health].colour,
                            color: STATUS_META[stage.health].text,
                          }}
                        >
                          {STATUS_META[stage.health].label}
                        </span>
                        <span className="text-xs text-muted">
                          {stage.tsms.length} measure
                          {stage.tsms.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Pill
                          colour="var(--color-answer-process)"
                          count={stage.processes.length}
                          label="processes"
                        />
                        <Pill
                          colour="var(--color-answer-policy)"
                          count={stage.policies.length}
                          label="policies"
                        />
                        <Pill
                          colour="var(--color-answer-tsm)"
                          count={stage.tsms.length}
                          label="TSMs"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {selected && (
        <StageDetail
          key={selected.stage.id}
          stage={selected.stage}
          journeyName={selected.journey.name}
          journeyColour={selected.journey.colour}
          admin={admin}
          library={library}
          leadAnswer={activeRole.leadAnswer}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function Pill({
  colour,
  count,
  label,
}: {
  colour: string;
  count: number;
  label: string;
}) {
  return (
    <span
      className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: colour, opacity: count ? 1 : 0.35 }}
    >
      {count} {label}
    </span>
  );
}
