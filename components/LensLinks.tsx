"use client";

import { useRouter } from "next/navigation";
import type { RoleLens } from "@/lib/queries";
import { setRoleCookie } from "@/lib/role-cookie";

/**
 * Landing-page entry points: pick who you are and open the map through that
 * lens. Same cookie as the switcher on the map itself, so the choice sticks.
 */
export default function LensLinks({ roles }: { roles: RoleLens[] }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <button
          key={role.key}
          onClick={() => {
            setRoleCookie(role.key);
            router.push("/map");
          }}
          title={role.description}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-brand transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {role.name}
        </button>
      ))}
    </div>
  );
}
