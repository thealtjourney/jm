import type { MeasureStatus } from "./queries";

export const STATUS_META: Record<
  MeasureStatus,
  { label: string; colour: string; text: string }
> = {
  "on-target": { label: "On target", colour: "#1e8449", text: "#ffffff" },
  near: { label: "Near target", colour: "#d68910", text: "#ffffff" },
  "off-target": { label: "Off target", colour: "#c0392b", text: "#ffffff" },
  "no-data": { label: "No data", colour: "#b3bfc4", text: "#22333b" },
};

/** Formats a measure value with its unit, e.g. "70.5%" or "23.4 per 1,000 homes". */
export function formatValue(value: number | null, unit: string): string {
  if (value === null) return "—";
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return unit === "%" ? `${rounded}%` : `${rounded} ${unit}`;
}

/**
 * Describes movement since the prior year in the direction that matters, so a
 * fall in ASB cases reads as an improvement rather than a drop.
 */
export function describeTrend(
  trend: number | null,
  higherIsBetter: boolean,
): { label: string; better: boolean | null } {
  if (trend === null || trend === 0) return { label: "no change", better: null };
  const better = higherIsBetter ? trend > 0 : trend < 0;
  const arrow = trend > 0 ? "▲" : "▼";
  return { label: `${arrow} ${Math.abs(trend).toFixed(1)}`, better };
}
