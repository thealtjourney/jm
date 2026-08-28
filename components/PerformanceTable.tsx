"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATUS_META, formatValue, describeTrend } from "@/lib/status";
import type { MeasureStatus } from "@/lib/queries";

type Row = {
  code: string;
  name: string;
  category: string;
  measureType: string;
  unit: string;
  higherIsBetter: boolean;
  value: number | null;
  target: number | null;
  prior: number | null;
  source: string | null;
  status: MeasureStatus;
  trend: number | null;
  owners: string[];
};

export default function PerformanceTable({
  rows,
  admin,
  period,
}: {
  rows: Row[];
  admin: boolean;
  period: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(row: Row) {
    setEditing(row.code);
    setValue(row.value === null ? "" : String(row.value));
    setTarget(row.target === null ? "" : String(row.target));
    setError(null);
  }

  async function save(code: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/performance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          period,
          value: value === "" ? null : value,
          target: target === "" ? null : target,
          // Saving a figure by hand makes it real, which also protects it from
          // being overwritten the next time the seed runs.
          source: "internal",
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not save.");
      }
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-line bg-canvas">
          <tr>
            <th className="px-4 py-3 font-bold text-ink">Measure</th>
            <th className="px-4 py-3 font-bold text-ink">Status</th>
            <th className="px-4 py-3 font-bold text-ink">{period}</th>
            <th className="px-4 py-3 font-bold text-ink">Target</th>
            <th className="px-4 py-3 font-bold text-ink">Movement</th>
            <th className="px-4 py-3 font-bold text-ink">Answerable</th>
            {admin && <th className="px-4 py-3 font-bold text-ink">Edit</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const trend = describeTrend(row.trend, row.higherIsBetter);
            const isEditing = editing === row.code;
            return (
              <tr key={row.code} className="border-b border-line last:border-0">
                <td className="px-4 py-3 align-top">
                  <span className="rounded-md bg-answer-tsm px-2 py-0.5 text-xs font-bold text-white">
                    {row.code}
                  </span>
                  <p className="mt-1.5 font-semibold text-ink">{row.name}</p>
                  <p className="text-xs text-muted">
                    {row.measureType === "perception" ? "Perception" : "Management"}
                    {row.source === "placeholder" && (
                      <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">
                        illustrative
                      </span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-bold"
                    style={{
                      backgroundColor: STATUS_META[row.status].colour,
                      color: STATUS_META[row.status].text,
                    }}
                  >
                    {STATUS_META[row.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  {isEditing ? (
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-24 rounded-lg border border-line bg-canvas px-2 py-1 text-sm focus:border-brand focus:outline-none"
                    />
                  ) : (
                    formatValue(row.value, row.unit)
                  )}
                </td>
                <td className="px-4 py-3 align-top text-muted">
                  {isEditing ? (
                    <input
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="w-24 rounded-lg border border-line bg-canvas px-2 py-1 text-sm focus:border-brand focus:outline-none"
                    />
                  ) : (
                    formatValue(row.target, row.unit)
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  {trend.better === null ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <span
                      className={`font-semibold ${trend.better ? "text-green-700" : "text-red-600"}`}
                    >
                      {trend.label}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-1.5">
                    {row.owners.map((owner) => (
                      <span
                        key={owner}
                        className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs font-semibold text-ink"
                      >
                        {owner}
                      </span>
                    ))}
                    {!row.owners.length && (
                      <span className="rounded-md border border-dashed border-red-300 px-2 py-0.5 text-xs font-semibold text-red-600">
                        No owner
                      </span>
                    )}
                  </div>
                </td>
                {admin && (
                  <td className="px-4 py-3 align-top">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button
                            onClick={() => save(row.code)}
                            disabled={busy}
                            className="rounded-lg bg-brand px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-muted"
                          >
                            Cancel
                          </button>
                        </div>
                        {error && <p className="text-xs text-red-600">{error}</p>}
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(row)}
                        className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-brand hover:bg-canvas"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
