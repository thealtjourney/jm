"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RoleLens } from "@/lib/queries";
import { setRoleCookie } from "@/lib/role-cookie";

/**
 * Switches the lens, not the permissions. Whatever role is selected, the whole
 * map stays reachable - the lens only decides what is foregrounded and how much
 * detail opens by default.
 */
export default function RoleSwitcher({
  roles,
  active,
  showingEverything,
  onShowEverything,
}: {
  roles: RoleLens[];
  active: RoleLens;
  showingEverything: boolean;
  onShowEverything: (value: boolean) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function choose(key: string) {
    setRoleCookie(key);
    setOpen(false);
    onShowEverything(false);
    router.refresh();
  }

  const focused = active.focusStageCodes.length;

  return (
    <div className="no-print border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-canvas"
          >
            <span className="text-muted">Viewing as</span>
            {active.name}
            <span aria-hidden className="text-xs">
              ▾
            </span>
          </button>

          {open && (
            <>
              <button
                aria-label="Close role menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setOpen(false)}
              />
              <ul className="absolute left-0 top-full z-20 mt-1 w-80 overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
                {roles.map((role) => (
                  <li key={role.key}>
                    <button
                      onClick={() => choose(role.key)}
                      className={`w-full border-b border-line px-4 py-3 text-left last:border-b-0 transition hover:bg-canvas ${
                        role.key === active.key ? "bg-canvas" : ""
                      }`}
                    >
                      <p className="text-sm font-semibold text-ink">{role.name}</p>
                      <p className="mt-0.5 text-xs leading-snug text-muted">
                        {role.description}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p className="flex-1 text-sm text-muted">{active.description}</p>

        {focused > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted">
            <input
              type="checkbox"
              checked={showingEverything}
              onChange={(e) => onShowEverything(e.target.checked)}
            />
            Show the whole map
          </label>
        )}
      </div>
    </div>
  );
}
