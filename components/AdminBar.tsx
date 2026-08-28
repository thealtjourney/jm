"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminBar({
  admin,
  onChange,
}: {
  admin: boolean;
  onChange: (admin: boolean) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not sign in.");
      }
      setPassword("");
      setOpen(false);
      onChange(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin", { method: "DELETE" });
    onChange(false);
    router.refresh();
  }

  return (
    <div className="no-print border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-3">
        <p className="text-sm text-muted">
          {admin ? (
            <span className="font-semibold text-accent">
              Edit mode — changes you save are live for everyone.
            </span>
          ) : (
            "Viewing as a reader. Sign in to edit journey content."
          )}
        </p>

        {admin ? (
          <button
            onClick={signOut}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted transition hover:text-ink"
          >
            Leave edit mode
          </button>
        ) : open ? (
          <form onSubmit={signIn} className="flex items-center gap-2">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              Cancel
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </form>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-canvas"
          >
            Edit mode
          </button>
        )}
      </div>
    </div>
  );
}
