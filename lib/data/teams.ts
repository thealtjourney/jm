/**
 * Teams that deliver the journeys. A stage names one accountable team; every
 * other team involved is derived from the processes mapped to that stage, so
 * "who is involved here" stays true without a second thing to maintain.
 */

export type TeamSeed = {
  code: string;
  name: string;
  directorate: string;
  description: string;
};

export const TEAM_SEED: TeamSeed[] = [
  // --- Growth & Development ----------------------------------------------
  {
    code: "TM-NEWBUS",
    name: "New Business",
    directorate: "Growth & Development",
    description:
      "Finds and appraises land and Section 106 opportunities, and takes schemes through planning and grant funding.",
  },
  {
    code: "TM-DEVDEL",
    name: "Development Delivery",
    directorate: "Growth & Development",
    description:
      "Acts as client through construction, manages contractors and hands completed homes over to asset management.",
  },

  // --- Property & Assets ---------------------------------------------------
  {
    code: "TM-ASSET",
    name: "Asset Management",
    directorate: "Property & Assets",
    description:
      "Owns stock condition data, the investment programme and decisions to retain, invest in or dispose of homes.",
  },
  {
    code: "TM-COMPL",
    name: "Compliance",
    directorate: "Property & Assets",
    description:
      "Runs the statutory safety programmes: gas, fire, asbestos, water, lifts and electrical.",
  },
  {
    code: "TM-BSAFE",
    name: "Building Safety",
    directorate: "Property & Assets",
    description:
      "Discharges Building Safety Act duties, including the golden thread and resident engagement on higher-risk buildings.",
  },
  {
    code: "TM-REPAIRS",
    name: "Repairs",
    directorate: "Property & Assets",
    description:
      "Owns the responsive repairs service, damp and mould casework and adaptations.",
  },
  {
    code: "TM-REPPLAN",
    name: "Repairs Planning",
    directorate: "Property & Assets",
    description:
      "Schedules appointments and allocates the right trade with the right parts.",
  },
  {
    code: "TM-DLO",
    name: "Direct Labour Organisation",
    directorate: "Property & Assets",
    description:
      "The in-house trades who attend customers' homes and carry out the work.",
  },
  {
    code: "TM-VOIDS",
    name: "Voids",
    directorate: "Property & Assets",
    description:
      "Turns empty homes around to the lettable standard and controls keys between teams.",
  },

  // --- Customer & Communities ----------------------------------------------
  {
    code: "TM-CSC",
    name: "Customer Service Centre",
    directorate: "Customer & Communities",
    description:
      "First point of contact across phone, web and app; resolves at first contact or triages cleanly.",
  },
  {
    code: "TM-LETTINGS",
    name: "Lettings",
    directorate: "Customer & Communities",
    description:
      "Advertises, shortlists, verifies and signs up new tenancies.",
  },
  {
    code: "TM-NEIGH",
    name: "Neighbourhoods",
    directorate: "Customer & Communities",
    description:
      "Patch-based housing management: estates, ASB, tenancy management and terminations.",
  },
  {
    code: "TM-TENSUP",
    name: "Tenancy Support",
    directorate: "Customer & Communities",
    description:
      "Money advice, benefit maximisation and safeguarding referrals that keep tenancies going.",
  },
  {
    code: "TM-INCOME",
    name: "Income",
    directorate: "Customer & Communities",
    description:
      "Rent collection, payment arrangements, arrears recovery and recharges.",
  },
  {
    code: "TM-CRES",
    name: "Customer Resolution",
    directorate: "Customer & Communities",
    description:
      "Investigates complaints at both stages, agrees remedies and records learning.",
  },
  {
    code: "TM-CENG",
    name: "Customer Engagement",
    directorate: "Customer & Communities",
    description:
      "Scrutiny panels, consultation and closing the loop on what changed.",
  },
  {
    code: "TM-CX",
    name: "Customer Experience",
    directorate: "Customer & Communities",
    description:
      "Owns service standards, vulnerability and reasonable adjustments across every channel.",
  },

  // --- Home Ownership -------------------------------------------------------
  {
    code: "TM-SALES",
    name: "Sales",
    directorate: "Home Ownership",
    description:
      "Markets shared ownership homes and takes buyers from reservation through to completion.",
  },
  {
    code: "TM-HOMEOWN",
    name: "Home Ownership",
    directorate: "Home Ownership",
    description:
      "Leasehold management, service charges, repairs allowance, staircasing and resales.",
  },

  // --- Finance & Corporate --------------------------------------------------
  {
    code: "TM-FINANCE",
    name: "Finance",
    directorate: "Finance & Corporate",
    description:
      "Service charge budgeting and actualisation, and the financial appraisal of schemes.",
  },
  {
    code: "TM-PROC",
    name: "Procurement",
    directorate: "Finance & Corporate",
    description:
      "Tendering, contract award and supplier performance management.",
  },
  {
    code: "TM-DIGITAL",
    name: "Digital",
    directorate: "Finance & Corporate",
    description:
      "The customer portal and app, self-service journeys and digital accessibility.",
  },
  {
    code: "TM-INSIGHT",
    name: "Data & Insight",
    directorate: "Finance & Corporate",
    description:
      "Surveys, the TSM return, data quality and the knowledge and information management standard.",
  },
];
