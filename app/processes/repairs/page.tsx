import ProcessWalkthrough from "@/components/ProcessWalkthrough";
import { REPAIRS_WORKFLOW } from "@/lib/process-workflows";
import { getJourneys, getLibraries } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RepairsPage() {
  const [journeys, libraries] = await Promise.all([getJourneys(), getLibraries()]);
  const stage = journeys.flatMap(journey => journey.stages).find(stage => stage.code === REPAIRS_WORKFLOW.stageCode) ?? null;
  return <ProcessWalkthrough workflow={REPAIRS_WORKFLOW} stage={stage} processes={libraries.processes.map(process => ({ code: process.code, name: process.name, owningTeam: process.owningTeam }))} />;
}
