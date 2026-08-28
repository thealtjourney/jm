import { cookies } from "next/headers";
import JourneyMap from "@/components/JourneyMap";
import { ROLE_COOKIE } from "@/lib/role-cookie";
import { getJourneys, getLibraries, getRoles } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [journeys, libraries, roles, admin, store] = await Promise.all([
    getJourneys(),
    getLibraries(),
    getRoles(),
    isAdmin(),
    cookies(),
  ]);

  // The lens is a reader preference, not a permission, so an unknown or missing
  // cookie simply falls back to the full map.
  const preferred = store.get(ROLE_COOKIE)?.value;
  const activeRole =
    roles.find((r) => r.key === preferred) ??
    roles.find((r) => r.key === "everyone") ??
    roles[0];

  return (
    <JourneyMap
      journeys={journeys}
      initialAdmin={admin}
      roles={roles}
      activeRole={activeRole}
      library={{
        policies: libraries.policies.map((p) => ({
          code: p.code,
          name: p.name,
          category: p.category,
        })),
        processes: libraries.processes.map((p) => ({
          code: p.code,
          name: p.name,
          team: p.owningTeam?.name ?? "",
        })),
        tsms: libraries.tsms.map((t) => ({
          code: t.code,
          name: t.name,
          category: t.category,
        })),
      }}
    />
  );
}
