"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Challenge = {
  id: number;
  stageCode: string;
  stageTitle: string;
  journeyName: string;
  journeyColour: string;
  owningTeam: string;
  submittedBy: string;
  submittedRole: string;
  body: string;
  status: string;
  response: string;
  createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  open: "bg-accent text-white",
  accepted: "bg-green-700 text-white",
  declined: "bg-muted text-white",
};

export default function ChallengeQueue({
  challenges,
  admin,
}: {
  challenges: Challenge[];
  admin: boolean;
}) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resolve(id: number, status: "accepted" | "declined") {
    setBusy(true);
    setError(null);
    try {
      const result = await fetch("/api/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, response }),
      });
      if (!result.ok) {
        const data = await result.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not update.");
      }
      setReplyingTo(null);
      setResponse("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ul className="flex flex-col gap-4">
      {challenges.map((c) => (
        <li key={c.id} className="rounded-2xl border border-line bg-surface p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: c.journeyColour }}
            >
              {c.stageCode} · {c.stageTitle}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[c.status] ?? "bg-muted text-white"}`}
            >
              {c.status}
            </span>
            <span className="text-xs text-muted">
              Owned by {c.owningTeam} · {new Date(c.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>

          {/* Stored and rendered as plain text - never as HTML. */}
          <p className="whitespace-pre-wrap text-sm text-ink">{c.body}</p>

          <p className="mt-2 text-xs text-muted">
            {c.submittedBy || c.submittedRole
              ? `— ${[c.submittedBy, c.submittedRole].filter(Boolean).join(", ")}`
              : "— submitted anonymously"}
          </p>

          {c.response && (
            <div className="mt-3 rounded-xl border border-line bg-canvas p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Response
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{c.response}</p>
            </div>
          )}

          {admin && c.status === "open" && (
            <div className="mt-4 border-t border-line pt-3">
              {replyingTo === c.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder="What did you do about it?"
                    className="w-full rounded-lg border border-line bg-canvas p-3 text-sm focus:border-brand focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-red-600">{error}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => resolve(c.id, "declined")}
                        disabled={busy}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => resolve(c.id, "accepted")}
                        disabled={busy}
                        className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        Accept &amp; close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReplyingTo(c.id);
                    setResponse("");
                    setError(null);
                  }}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand hover:bg-canvas"
                >
                  Respond
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
