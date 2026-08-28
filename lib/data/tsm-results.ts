/**
 * TSM performance.
 *
 * IMPORTANT: every figure below is ILLUSTRATIVE. It is seeded with
 * `source: "placeholder"` so the app can show the feature working, and the UI
 * badges it as placeholder wherever it appears. Replace it with your published
 * TSM return before anyone uses this for assurance or reporting.
 *
 * Replace via the admin UI on /performance, or by editing this file and
 * re-seeding with a different `source`:
 *   "return"   - the published TSM return
 *   "internal" - management reporting between returns
 */

export type TsmResultSeed = {
  tsmCode: string;
  period: string;
  scope: string;
  value: number;
  target: number;
  source: "placeholder" | "return" | "internal";
};

const PRIOR = "2023-24";
const CURRENT = "2024-25";

type Row = [code: string, prior: number, current: number, target: number];

// [TSM, prior year, current year, current target]
const ROWS: Row[] = [
  ["TP01", 68.2, 70.5, 72.0],
  ["TP02", 72.1, 74.3, 76.0],
  ["TP03", 68.9, 70.2, 73.0],
  ["TP04", 69.5, 71.0, 74.0],
  ["TP05", 74.8, 76.2, 79.0],
  ["TP06", 58.3, 60.1, 64.0],
  ["TP07", 65.0, 67.4, 70.0],
  ["TP08", 74.2, 75.6, 78.0],
  ["TP09", 33.1, 36.8, 42.0],
  ["TP10", 61.7, 63.0, 66.0],
  ["TP11", 57.4, 59.2, 62.0],
  ["TP12", 52.6, 54.9, 58.0],
  // Lower is better for CH01, NM01 and RP01.
  ["CH01", 38.4, 44.1, 40.0],
  ["CH02", 88.5, 92.3, 100.0],
  ["NM01", 21.7, 23.4, 22.0],
  ["RP01", 1.8, 1.2, 0.0],
  ["RP02", 84.6, 88.1, 92.0],
  ["BS01", 99.7, 99.9, 100.0],
  ["BS02", 98.9, 99.6, 100.0],
  ["BS03", 99.1, 99.8, 100.0],
  ["BS04", 97.8, 99.2, 100.0],
  ["BS05", 96.4, 98.7, 100.0],
];

export const TSM_RESULT_SEED: TsmResultSeed[] = ROWS.flatMap(
  ([tsmCode, prior, current, target]) => [
    {
      tsmCode,
      period: PRIOR,
      scope: "Organisation",
      value: prior,
      target,
      source: "placeholder" as const,
    },
    {
      tsmCode,
      period: CURRENT,
      scope: "Organisation",
      value: current,
      target,
      source: "placeholder" as const,
    },
  ],
);

export const CURRENT_PERIOD = CURRENT;
export const PRIOR_PERIOD = PRIOR;
