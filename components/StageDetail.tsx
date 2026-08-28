"use client";

import { useEffect, useRef, useState } from "react";
import type { StageDetail as Stage } from "@/lib/queries";
import { STATUS_META, formatValue, describeTrend } from "@/lib/status";

type Library = {
  policies: { code: string; name: string; category: string }[];
  processes: { code: string; name: string; team: string }[];
  tsms: { code: string; name: string; category: string }[];
};

type Props = {
  stage: Stage;
  journeyName: string;
  journeyColour: string;
  admin: boolean;
  library: Library;
  leadAnswer: "excellence" | "processes" | "policies" | "tsms";
  onClose: () => void;
  onSaved: () => void;
};

const SECTIONS = [
  { key: "excellence", label: "Excellent service", colour: "var(--color-answer-excellence)" },
  { key: "processes", label: "Processes", colour: "var(--color-answer-process)" },
  { key: "policies", label: "Policies", colour: "var(--color-answer-policy)" },
  { key: "tsms", label: "TSMs", colour: "var(--color-answer-tsm)" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

export default function StageDetail({
  stage,
  journeyName,
  journeyColour,
  admin,
  library,
  leadAnswer,
  onClose,
  onSaved,
}: Props) {
  // The role lens decides which answer opens first.
  const [section, setSection] = useState<SectionKey>(leadAnswer);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [excellence, setExcellence] = useState(stage.excellence);
  const [activities, setActivities] = useState(stage.activities);
  const [policyCodes, setPolicyCodes] = useState(stage.policies.map((p) => p.code));
  const [processCodes, setProcessCodes] = useState(
    stage.processes.map((p) => p.code),
  );
  const [tsmCodes, setTsmCodes] = useState(stage.tsms.map((t) => t.code));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggle(list: string[], code: string): string[] {
    return list.includes(code) ? list.filter((c) => c !== code) : [...list, code];
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          excellence,
          activities,
          policyCodes,
          processCodes,
          tsmCodes,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not save changes.");
      }
      setEditing(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  const counts: Record<SectionKey, number> = {
    excellence: 0,
    processes: stage.processes.length,
    policies: stage.policies.length,
    tsms: stage.tsms.length,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${stage.title} stage detail`}
        tabIndex={-1}
        className="w-full max-w-4xl rounded-2xl bg-surface shadow-2xl outline-none"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 rounded-t-2xl px-6 py-5 text-white"
          style={{ backgroundColor: journeyColour }}
        >
          <div className="flex items-start gap-4">
            <span aria-hidden className="text-3xl leading-none">
              {stage.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                {journeyName} &middot; {stage.code}
              </p>
              <h2 className="text-2xl font-bold">{stage.title}</h2>
              <p className="text-sm opacity-90">{stage.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {admin && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold transition hover:bg-white/25"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold transition hover:bg-white/25"
            >
              Close
            </button>
          </div>
        </div>

        {/* Phase 1: who owns this, and who else is in it */}
        <div className="grid gap-4 border-b border-line bg-canvas px-6 py-4 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Accountable
            </h3>
            {stage.accountableTeam ? (
              <>
                <p className="mt-1 font-semibold text-ink">
                  {stage.accountableTeam.name}
                </p>
                <p className="text-sm text-muted">
                  {stage.accountableRole || stage.accountableTeam.directorate}
                </p>
              </>
            ) : (
              <p className="mt-1 font-semibold text-red-600">No owner set</p>
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Also involved
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {stage.contributingTeams.map((team) => (
                <span
                  key={team.code}
                  title={team.directorate}
                  className="rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-ink"
                >
                  {team.name}
                </span>
              ))}
              {!stage.contributingTeams.length && (
                <span className="text-sm text-muted">
                  Delivered entirely by the accountable team.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* What we do */}
        <div className="border-b border-line px-6 py-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
            What happens at this stage
          </h3>
          {editing ? (
            <textarea
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-line bg-canvas p-3 font-mono text-xs leading-relaxed focus:border-brand focus:outline-none"
            />
          ) : (
            <div
              className="rich-text text-sm text-ink"
              dangerouslySetInnerHTML={{ __html: stage.activities }}
            />
          )}
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line px-6 py-3">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                section === s.key ? "text-white" : "bg-canvas text-muted hover:text-ink"
              }`}
              style={section === s.key ? { backgroundColor: s.colour } : undefined}
            >
              {s.label}
              {counts[s.key] > 0 && (
                <span className="ml-2 opacity-70">{counts[s.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Section body */}
        <div className="px-6 py-5">
          {section === "excellence" &&
            (editing ? (
              <textarea
                value={excellence}
                onChange={(e) => setExcellence(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-line bg-canvas p-3 font-mono text-xs leading-relaxed focus:border-brand focus:outline-none"
              />
            ) : (
              <div
                className="rich-text text-sm"
                dangerouslySetInnerHTML={{ __html: stage.excellence }}
              />
            ))}

          {section === "processes" &&
            (editing ? (
              <Picker
                items={library.processes.map((p) => ({
                  code: p.code,
                  label: p.name,
                  meta: p.team,
                }))}
                selected={processCodes}
                onToggle={(code) => setProcessCodes((l) => toggle(l, code))}
              />
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {stage.processes.map((p) => (
                  <li key={p.code} className="rounded-xl border border-line bg-canvas p-4">
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-answer-process">
                      {p.team?.name ?? "No team set"}
                    </p>
                    <p className="mt-2 text-sm text-muted">{p.description}</p>
                  </li>
                ))}
                {!stage.processes.length && <Empty>No processes mapped yet.</Empty>}
              </ul>
            ))}

          {section === "policies" &&
            (editing ? (
              <Picker
                items={library.policies.map((p) => ({
                  code: p.code,
                  label: p.name,
                  meta: p.category,
                }))}
                selected={policyCodes}
                onToggle={(code) => setPolicyCodes((l) => toggle(l, code))}
              />
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {stage.policies.map((p) => (
                  <li key={p.code} className="rounded-xl border border-line bg-canvas p-4">
                    <p className="font-semibold text-ink">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-answer-policy underline-offset-2"
                        >
                          {p.name}
                        </a>
                      ) : (
                        p.name
                      )}
                    </p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-answer-policy">
                      {p.category}
                    </p>
                    <p className="mt-2 text-sm text-muted">{p.description}</p>
                  </li>
                ))}
                {!stage.policies.length && <Empty>No policies mapped yet.</Empty>}
              </ul>
            ))}

          {section === "tsms" &&
            (editing ? (
              <Picker
                items={library.tsms.map((t) => ({
                  code: t.code,
                  label: `${t.code} — ${t.name}`,
                  meta: t.category,
                }))}
                selected={tsmCodes}
                onToggle={(code) => setTsmCodes((l) => toggle(l, code))}
              />
            ) : (
              <ul className="grid gap-3">
                {stage.tsms.map((t) => {
                  const trend = describeTrend(
                    t.value !== null && t.prior !== null
                      ? Number((t.value - t.prior).toFixed(2))
                      : null,
                    t.higherIsBetter,
                  );
                  return (
                    <li key={t.code} className="rounded-xl border border-line bg-canvas p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-answer-tsm px-2 py-0.5 text-xs font-bold text-white">
                          {t.code}
                        </span>
                        <span className="font-semibold text-ink">{t.name}</span>
                        <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-muted">
                          {t.measureType === "perception"
                            ? "Perception survey"
                            : "Management information"}
                        </span>
                        {!t.reportable && (
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                            Indicative only — not reportable for this tenure
                          </span>
                        )}
                      </div>

                      {/* Phase 3: the number, not just the intent. */}
                      {t.reportable && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                          <span
                            className="rounded-md px-2 py-0.5 text-xs font-bold"
                            style={{
                              backgroundColor: STATUS_META[t.status].colour,
                              color: STATUS_META[t.status].text,
                            }}
                          >
                            {STATUS_META[t.status].label}
                          </span>
                          <span className="text-sm font-semibold text-ink">
                            {formatValue(t.value, t.unit)}
                          </span>
                          <span className="text-sm text-muted">
                            target {formatValue(t.target, t.unit)}
                          </span>
                          {trend.better !== null && (
                            <span
                              className={`text-sm font-semibold ${
                                trend.better ? "text-green-700" : "text-red-600"
                              }`}
                              title="Change since the prior year"
                            >
                              {trend.label}
                            </span>
                          )}
                          {t.source === "placeholder" && (
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              Illustrative figure
                            </span>
                          )}
                        </div>
                      )}

                      <p className="mt-2 text-sm text-muted">{t.definition}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs font-semibold text-brand">
                          How it is calculated
                        </summary>
                        <p className="mt-1 text-xs text-muted">{t.calculation}</p>
                      </details>
                    </li>
                  );
                })}
                {!stage.tsms.length && (
                  <Empty>No TSMs apply directly to this stage.</Empty>
                )}
              </ul>
            ))}
        </div>

        {/* Phase 4: let the people doing the work say it is wrong */}
        {!editing && (
          <div className="border-t border-line px-6 py-4">
            {challengeOpen ? (
              <ChallengeForm
                stageId={stage.id}
                onDone={() => {
                  setChallengeOpen(false);
                  onSaved();
                }}
                onCancel={() => setChallengeOpen(false)}
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  {stage.openChallenges > 0
                    ? `${stage.openChallenges} open challenge${stage.openChallenges === 1 ? "" : "s"} against this stage.`
                    : "Does this match what actually happens?"}
                </p>
                <button
                  onClick={() => setChallengeOpen(true)}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-canvas"
                >
                  This isn&apos;t what happens
                </button>
              </div>
            )}
          </div>
        )}

        {editing && (
          <div className="flex items-center justify-between gap-4 rounded-b-2xl border-t border-line bg-canvas px-6 py-4">
            <p className="text-sm text-red-600">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted transition hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChallengeForm({
  stageId,
  onDone,
  onCancel,
}: {
  stageId: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId,
          submittedBy: name,
          submittedRole: role,
          body,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not send that.");
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-ink">
        What does this stage get wrong?
      </p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        rows={3}
        maxLength={2000}
        placeholder="e.g. the settling-in visit is a phone call in practice, not a visit — we have not had the capacity to do them since April."
        className="w-full rounded-lg border border-line bg-canvas p-3 text-sm focus:border-brand focus:outline-none"
      />
      <div className="flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={120}
          className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Your role (optional)"
          maxLength={120}
          className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-red-600">{error}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted transition hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
      {children}
    </li>
  );
}

function Picker({
  items,
  selected,
  onToggle,
}: {
  items: { code: string; label: string; meta: string }[];
  selected: string[];
  onToggle: (code: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const term = filter.trim().toLowerCase();
  const visible = term
    ? items.filter(
        (i) =>
          i.label.toLowerCase().includes(term) || i.meta.toLowerCase().includes(term),
      )
    : items;

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter…"
        className="mb-3 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
      <div className="max-h-80 overflow-y-auto rounded-lg border border-line">
        {visible.map((item) => (
          <label
            key={item.code}
            className="flex cursor-pointer items-start gap-3 border-b border-line px-3 py-2 text-sm last:border-b-0 hover:bg-canvas"
          >
            <input
              type="checkbox"
              checked={selected.includes(item.code)}
              onChange={() => onToggle(item.code)}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-ink">{item.label}</span>
              {item.meta && <span className="ml-2 text-xs text-muted">{item.meta}</span>}
            </span>
          </label>
        ))}
        {!visible.length && (
          <p className="px-3 py-6 text-center text-sm text-muted">No matches.</p>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">{selected.length} selected</p>
    </div>
  );
}
