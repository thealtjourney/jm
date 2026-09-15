import type { JourneyDetail, StageDetail } from "./queries";

type StagePresentation = { label: string; outcome: string };

/** Plain-language navigation and proposed outcomes; authored standards stay in the database. */
const STAGE_PRESENTATION: Record<string, StagePresentation> = {
  P1: { label: "Planning new homes", outcome: "My future home is planned around local housing need and the way people live." },
  P2: { label: "Building well", outcome: "My home is built to last, with quality, safety and affordable running costs in mind." },
  P3: { label: "Ready to move in", outcome: "My new home is safe and ready, and I know how everything works." },
  P4: { label: "Preparing the next home", outcome: "The home I was shown is clean, safe and ready when I receive the keys." },
  P5: { label: "Caring for our homes", outcome: "My home is kept safe, warm and in good repair throughout my tenancy." },
  P6: { label: "A home's next chapter", outcome: "I understand planned changes to my home and am supported through them." },
  C1: { label: "What matters", outcome: "I am listened to, treated fairly and kept informed." },
  C2: { label: "Getting help", outcome: "I can get help without having to repeat my story." },
  C3: { label: "Having a say", outcome: "I can see how residents' views make a difference." },
  C4: { label: "Finding a home", outcome: "I understand my housing options, what my home will cost and what happens next." },
  C5: { label: "Moving in", outcome: "My home is ready, and I know who to turn to as I settle in." },
  C6: { label: "Digital access", outcome: "I can manage everyday tasks in a way that works for me." },
  C7: { label: "Repairs", outcome: "I know what's happening with my repair, and when." },
  C8: { label: "My community", outcome: "My concerns about my neighbourhood are taken seriously." },
  C9: { label: "Making a complaint", outcome: "My complaint is heard, addressed and learned from." },
  C10: { label: "Moving on", outcome: "I can leave with clear information, practical support and no surprises." },
  O1: { label: "What matters", outcome: "I am listened to, treated fairly and kept informed." },
  O2: { label: "Getting help", outcome: "I can reach the right person and get a clear answer." },
  O3: { label: "Having a say", outcome: "My views help shape the services I receive." },
  O4: { label: "Finding a home", outcome: "I understand shared ownership, my costs and the commitments before I buy." },
  O5: { label: "Buying my home", outcome: "I know how my purchase is progressing and what I need to do next." },
  O6: { label: "Moving in", outcome: "My home is ready, and I know who to contact if something needs attention." },
  O7: { label: "Living in my home", outcome: "I understand my charges, repair responsibilities and the support available to me." },
  O8: { label: "Buying a bigger share", outcome: "I understand my options, the process and the costs of buying more of my home." },
  O9: { label: "Selling and moving on", outcome: "I understand how to sell my home and receive support throughout the process." },
};

export function stagePresentation(stage: Pick<StageDetail, "code" | "title">): StagePresentation {
  return STAGE_PRESENTATION[stage.code] ?? { label: stage.title, outcome: "I understand what happens next and who is responsible for helping me." };
}

type GroupDefinition = { key: string; title: string; description: string; sequence?: boolean; codes: string[] };
export type StageGroup = Omit<GroupDefinition, "codes"> & { stages: StageDetail[] };

const GROUPS: Record<string, GroupDefinition[]> = {
  property: [
    { key: "planning", title: "Planning", description: "Identify the opportunity and plan a home around local need.", sequence: true, codes: ["P1"] },
    { key: "building", title: "Building", description: "Turn the plans into a safe, well-built home.", sequence: true, codes: ["P2"] },
    { key: "handover", title: "Handover", description: "Make the home ready for its first residents.", sequence: true, codes: ["P3"] },
    { key: "home-life", title: "Life of the home", description: "Care for the home and prepare it for new residents. Re-letting can repeat throughout its life.", codes: ["P5", "P4"] },
    { key: "next-chapter", title: "Next chapter", description: "Plan the home's future through investment, retrofit or disposal.", sequence: true, codes: ["P6"] },
  ],
  customer: [
    { key: "finding", title: "Finding a home", description: "Understand the options and find a suitable home.", sequence: true, codes: ["C4"] },
    { key: "moving-in", title: "Moving in", description: "Receive the keys and settle into the new home.", sequence: true, codes: ["C5"] },
    { key: "living", title: "Living in my home", description: "Choose a service below. These can recur throughout a tenancy and have their own start and finish.", codes: ["C7", "C2", "C8", "C9", "C6", "C3", "C1"] },
    { key: "moving-on", title: "Moving on", description: "Bring the tenancy to a clear, supported conclusion.", sequence: true, codes: ["C10"] },
  ],
  owner: [
    { key: "finding", title: "Finding a home", description: "Explore shared ownership and understand the commitments.", sequence: true, codes: ["O4"] },
    { key: "buying", title: "Buying my home", description: "Follow the purchase through to completion.", sequence: true, codes: ["O5"] },
    { key: "moving-in", title: "Moving in", description: "Receive the keys and settle into the home.", sequence: true, codes: ["O6"] },
    { key: "living", title: "Living in my home", description: "Everyday support and the option to buy more shares. Buying a bigger share is optional.", codes: ["O7", "O8", "O1", "O2", "O3"] },
    { key: "moving-on", title: "Selling & moving on", description: "Understand the sale and get support through the next move.", sequence: true, codes: ["O9"] },
  ],
};

/** Keep every stage once, including future additions and role-filtered subsets. */
export function groupJourneyStages(journey: Pick<JourneyDetail, "key" | "stages">): StageGroup[] {
  const remaining = new Map(journey.stages.map(stage => [stage.code, stage]));
  const groups: StageGroup[] = [];
  for (const definition of GROUPS[journey.key] ?? []) {
    const stages = definition.codes.flatMap(code => {
      const stage = remaining.get(code);
      remaining.delete(code);
      return stage ? [stage] : [];
    });
    if (stages.length) groups.push({ key: definition.key, title: definition.title, description: definition.description, sequence: definition.sequence, stages });
  }
  if (remaining.size) groups.push({ key: "other", title: "Other stages", description: "Additional stages in this journey.", stages: [...remaining.values()] });
  return groups;
}

/** Derive connections only from stored mappings, including indicative mappings. */
export function journeyMeasures(journey: Pick<JourneyDetail, "stages">) {
  const measures = new Map<string, { code: string; name: string; stageCodes: string[] }>();
  for (const stage of journey.stages) {
    for (const tsm of stage.tsms) {
      const measure = measures.get(tsm.code) ?? { code: tsm.code, name: tsm.name, stageCodes: [] };
      if (!measure.stageCodes.includes(stage.code)) measure.stageCodes.push(stage.code);
      measures.set(tsm.code, measure);
    }
  }
  return [...measures.values()].sort((a, b) => a.code.localeCompare(b.code));
}
