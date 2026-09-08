"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchItem = {
  kind: "Stage" | "Process" | "Policy" | "TSM";
  code: string;
  title: string;
  subtitle: string;
  href: string;
  /** Extra text matched against but not displayed. */
  haystack: string;
};

const KIND_COLOURS: Record<SearchItem["kind"], string> = {
  Stage: "var(--color-brand)",
  Process: "var(--color-answer-process)",
  Policy: "var(--color-answer-policy)",
  TSM: "var(--color-answer-tsm)",
};

export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return items
      .filter(
        (item) =>
          item.code.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.haystack.toLowerCase().includes(q),
      )
      .slice(0, 50);
  }, [items, query]);

  return (
    <div className="max-w-3xl">
      <input
        autoFocus
        type="search"
        aria-label="Search stages, processes, policies and measures"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stages, processes, policies and measures…"
        className="w-full rounded-xl border border-line bg-surface px-5 py-3.5 text-lg text-ink shadow-sm outline-none focus:border-brand"
      />

      {query.trim().length >= 2 && (
        <p className="mt-3 text-sm text-muted" role="status">
          {results.length === 50
            ? "First 50 matches"
            : `${results.length} match${results.length === 1 ? "" : "es"}`}
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {results.map((item) => (
          <li key={`${item.kind}-${item.code}`}>
            <Link
              href={item.href}
              className="flex items-baseline gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: KIND_COLOURS[item.kind] }}
              >
                {item.kind}
              </span>
              <span className="font-semibold text-ink">{item.title}</span>
              <span className="text-sm text-muted">{item.subtitle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
