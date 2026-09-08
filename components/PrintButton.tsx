"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
    >
      Print / save as PDF
    </button>
  );
}
