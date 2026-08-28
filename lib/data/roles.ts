/**
 * Role lenses.
 *
 * A role changes where you land and at what altitude. It never changes what you
 * can reach - every lens keeps the full map one click away, which is the whole
 * point of having one shared picture rather than four different tools.
 *
 *   altitude   "detail"  - the working checklist, for people doing the work
 *              "team"    - stage health and process assurance, for managers
 *              "summary" - collapsed to measures and gaps, for exec and board
 *
 *   leadAnswer which of the four answers opens first on a stage
 *
 *   focusStages the stages to surface first. Empty means the whole map.
 */

export type RoleSeed = {
  key: string;
  name: string;
  description: string;
  altitude: "detail" | "team" | "summary";
  leadAnswer: "excellence" | "processes" | "policies" | "tsms";
  focusStages: string[];
};

export const ROLE_SEED: RoleSeed[] = [
  {
    key: "everyone",
    name: "Everyone",
    description:
      "The whole map, nothing foregrounded. The shared picture all the other lenses are views of.",
    altitude: "detail",
    leadAnswer: "excellence",
    focusStages: [],
  },
  {
    key: "housing-officer",
    name: "Housing Officer",
    description:
      "The rented journey from letting to moving on, at working detail. What excellent looks like on the doorstep, and the policy that applies right now.",
    altitude: "detail",
    leadAnswer: "excellence",
    focusStages: ["C4", "C5", "C7", "C8", "C9", "C10"],
  },
  {
    key: "neighbourhoods-manager",
    name: "Neighbourhoods Manager",
    description:
      "Place and team. Estates, ASB, complaints and the property stages that shape them, with performance against target.",
    altitude: "team",
    leadAnswer: "processes",
    focusStages: ["C8", "C9", "C10", "C7", "P4", "P5"],
  },
  {
    key: "exec",
    name: "Executive & Board",
    description:
      "All three journeys collapsed to measures, ownership and gaps. Built for assurance rather than operation.",
    altitude: "summary",
    leadAnswer: "tsms",
    focusStages: [],
  },
  {
    key: "asset-manager",
    name: "Asset & Property",
    description:
      "The life of the asset from acquisition to disposal, plus the repairs and compliance stages the rented journey depends on.",
    altitude: "team",
    leadAnswer: "processes",
    focusStages: ["P1", "P2", "P3", "P4", "P5", "P6", "C7"],
  },
  {
    key: "home-ownership",
    name: "Home Ownership",
    description:
      "The shared ownership journey end to end, with the leasehold and service charge stages that follow completion.",
    altitude: "detail",
    leadAnswer: "excellence",
    focusStages: ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9"],
  },
  {
    key: "new-starter",
    name: "New Starter",
    description:
      "The whole service in order, at full detail. Written to be read start to finish rather than dipped into.",
    altitude: "detail",
    leadAnswer: "excellence",
    focusStages: [],
  },
];
