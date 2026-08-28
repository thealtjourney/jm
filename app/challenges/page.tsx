import Link from "next/link";
import { getChallenges } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import ChallengeQueue from "@/components/ChallengeQueue";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const [challenges, admin] = await Promise.all([getChallenges(), isAdmin()]);
  const open = challenges.filter((c) => c.status === "open");

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Challenges
        </h1>
        <p className="mt-3 text-lg text-muted">
          Where the people doing the work say the map is wrong. A map nobody
          corrects goes stale quietly; this is the mechanism that keeps it honest.
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="font-semibold text-ink">No challenges yet.</p>
          <p className="mt-2 text-sm text-muted">
            Open any stage on the journey map and use{" "}
            <span className="font-semibold">“This isn’t what happens”</span> to
            raise one. No sign-in needed — that is deliberate.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm font-semibold text-muted">
            {open.length} open · {challenges.length - open.length} closed
          </p>
          <ChallengeQueue challenges={challenges} admin={admin} />
        </>
      )}

      <p className="mt-8 text-sm text-muted">
        <Link href="/" className="font-semibold text-brand underline">
          Back to the journey map
        </Link>
      </p>
    </main>
  );
}
