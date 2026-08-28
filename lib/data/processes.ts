/**
 * Operational processes in social housing. Each stage of a journey touches
 * several of these; the join table in the schema is what makes "which
 * processes does this stage touch?" answerable in both directions.
 *
 * `teamCode` is what makes "who else is involved at this stage?" answerable -
 * a stage's contributing teams are derived from the processes mapped to it.
 */

export type ProcessSeed = {
  code: string;
  name: string;
  teamCode: string;
  description: string;
};

export const PROCESS_SEED: ProcessSeed[] = [
  // --- Development -------------------------------------------------------
  {
    code: "PRC-LAND",
    name: "Site identification & land search",
    teamCode: "TM-NEWBUS",
    description:
      "Scanning the market for land and Section 106 opportunities that match strategic growth areas and identified housing need.",
  },
  {
    code: "PRC-VIABILITY",
    name: "Scheme viability appraisal",
    teamCode: "TM-NEWBUS",
    description:
      "Modelling NPV and IRR for a proposed scheme and testing it against the investment hurdle rates before an offer is made.",
  },
  {
    code: "PRC-S106",
    name: "Section 106 & joint venture agreement",
    teamCode: "TM-NEWBUS",
    description:
      "Negotiating heads of terms and completing legal agreements with developers, landowners or joint venture partners.",
  },
  {
    code: "PRC-PLANNING",
    name: "Planning application management",
    teamCode: "TM-NEWBUS",
    description:
      "Instructing architects and consultants, running community consultation and securing planning permission.",
  },
  {
    code: "PRC-GRANT",
    name: "Grant allocation & claim",
    teamCode: "TM-NEWBUS",
    description:
      "Bidding for and drawing down Homes England grant against agreed milestones and tenure requirements.",
  },
  {
    code: "PRC-TENDER",
    name: "Contractor procurement & tender",
    teamCode: "TM-PROC",
    description:
      "Running the tender, evaluating bids on price, quality and social value, and awarding the building contract.",
  },
  {
    code: "PRC-SITEINSP",
    name: "Clerk of works site inspection",
    teamCode: "TM-DEVDEL",
    description:
      "Inspecting technical quality at key build stages such as foundations, first fix and pre-plaster.",
  },
  {
    code: "PRC-CDM",
    name: "CDM health & safety monitoring",
    teamCode: "TM-DEVDEL",
    description:
      "Discharging client duties under the Construction Design & Management Regulations and monitoring site safety.",
  },
  {
    code: "PRC-GOLDTHREAD",
    name: "Golden thread information capture",
    teamCode: "TM-BSAFE",
    description:
      "Collecting and storing the structured building safety information required under the Building Safety Act.",
  },
  {
    code: "PRC-BOARDREP",
    name: "Development board reporting",
    teamCode: "TM-DEVDEL",
    description:
      "Reporting scheme spend, programme and risk to the Board and updating the letting forecast.",
  },

  // --- Handover and assets ----------------------------------------------
  {
    code: "PRC-PC",
    name: "Practical completion & handover",
    teamCode: "TM-DEVDEL",
    description:
      "Formal sign-off that the building is complete and ready for occupation, including snagging and key acceptance.",
  },
  {
    code: "PRC-COMPHAND",
    name: "Compliance certificate handover",
    teamCode: "TM-COMPL",
    description:
      "Transferring gas, electrical, fire, lift and water certification into the compliance system on day one.",
  },
  {
    code: "PRC-ASSETLOAD",
    name: "Asset & component data load",
    teamCode: "TM-ASSET",
    description:
      "Creating the property record and loading component types, ages and expected lifecycles into the asset database.",
  },
  {
    code: "PRC-DEFECTS",
    name: "Defect reporting & rectification",
    teamCode: "TM-DEVDEL",
    description:
      "Logging defects during the liability period and holding the contractor to agreed rectification timescales.",
  },
  {
    code: "PRC-EOD",
    name: "End of defects inspection & retention release",
    teamCode: "TM-DEVDEL",
    description:
      "Final inspection at month eleven or twelve, agreeing outstanding works and releasing retention to the contractor.",
  },
  {
    code: "PRC-SCS",
    name: "Stock condition survey",
    teamCode: "TM-ASSET",
    description:
      "Rolling physical survey programme that validates component age and condition data across the portfolio.",
  },
  {
    code: "PRC-OPTAPP",
    name: "Asset option appraisal",
    teamCode: "TM-ASSET",
    description:
      "Assessing an asset's financial and social performance and deciding whether to retain, invest in or dispose of it.",
  },
  {
    code: "PRC-RETROFIT",
    name: "Retrofit & decarbonisation delivery",
    teamCode: "TM-ASSET",
    description:
      "Delivering insulation, heat pump and fabric works to PAS 2035, including customer liaison during works.",
  },
  {
    code: "PRC-DISPOSAL",
    name: "Disposal & sale conveyancing",
    teamCode: "TM-ASSET",
    description:
      "Managing valuation, consents and legal conveyance for open market or auction sale of a retained asset.",
  },
  {
    code: "PRC-EPC",
    name: "EPC assessment & lodgement",
    teamCode: "TM-ASSET",
    description:
      "Commissioning energy assessments and lodging certificates so every let home meets the minimum rating.",
  },

  // --- Compliance --------------------------------------------------------
  {
    code: "PRC-GASSERV",
    name: "Gas servicing programme",
    teamCode: "TM-COMPL",
    description:
      "Annual service and safety check cycle, including the no-access escalation ladder up to injunction.",
  },
  {
    code: "PRC-FRA",
    name: "Fire risk assessment & remedials",
    teamCode: "TM-COMPL",
    description:
      "Commissioning fire risk assessments on communal buildings and tracking remedial actions to completion.",
  },
  {
    code: "PRC-ASBSURV",
    name: "Asbestos survey & register management",
    teamCode: "TM-COMPL",
    description:
      "Maintaining the asbestos register and re-inspection cycle, and issuing information to operatives before works.",
  },
  {
    code: "PRC-LEGIONELLA",
    name: "Legionella risk assessment & monitoring",
    teamCode: "TM-COMPL",
    description:
      "Assessing and monitoring communal water systems, including temperature checks and tank inspections.",
  },
  {
    code: "PRC-LIFT",
    name: "Lift inspection programme",
    teamCode: "TM-COMPL",
    description:
      "LOLER thorough examinations, servicing and entrapment response for communal passenger lifts.",
  },
  {
    code: "PRC-EICR",
    name: "Electrical condition reporting",
    teamCode: "TM-COMPL",
    description:
      "Periodic electrical installation condition reports and remedy of category one and two defects.",
  },
  {
    code: "PRC-PLANPROG",
    name: "Planned works programming",
    teamCode: "TM-ASSET",
    description:
      "Building the annual programme of component replacements from lifecycle data and consulting affected customers.",
  },

  // --- Repairs -----------------------------------------------------------
  {
    code: "PRC-REPTRIAGE",
    name: "Repair diagnosis & triage",
    teamCode: "TM-CSC",
    description:
      "Diagnosing the fault at first point of contact, confirming responsibility and setting the correct priority.",
  },
  {
    code: "PRC-REPSCHED",
    name: "Repair appointment scheduling",
    teamCode: "TM-REPPLAN",
    description:
      "Offering and booking appointment slots, allocating the right trade and confirming by text or email.",
  },
  {
    code: "PRC-REPDEL",
    name: "Repair delivery & operative visit",
    teamCode: "TM-DLO",
    description:
      "Attending on time with the right parts, completing the work first time and leaving the home clean.",
  },
  {
    code: "PRC-REPSURVEY",
    name: "Post-repair satisfaction survey",
    teamCode: "TM-INSIGHT",
    description:
      "Transactional survey issued after completion to capture satisfaction while the visit is fresh.",
  },
  {
    code: "PRC-DAMP",
    name: "Damp & mould case management",
    teamCode: "TM-REPAIRS",
    description:
      "Inspecting, diagnosing root cause, treating affected areas and tracking the case until the problem is resolved.",
  },
  {
    code: "PRC-ADAPT",
    name: "Aids & adaptations referral",
    teamCode: "TM-ASSET",
    description:
      "Processing occupational therapist referrals and delivering minor or major adaptations to the home.",
  },
  {
    code: "PRC-RECHARGE",
    name: "Recharge assessment & invoicing",
    teamCode: "TM-INCOME",
    description:
      "Evidencing damage beyond fair wear and tear, pricing the work and raising a recoverable invoice.",
  },

  // --- Voids and lettings -------------------------------------------------
  {
    code: "PRC-PTV",
    name: "Pre-termination visit",
    teamCode: "TM-NEIGH",
    description:
      "Inspecting the home while the customer is still present to agree recharges, alterations and clearance.",
  },
  {
    code: "PRC-NTQ",
    name: "Notice & termination processing",
    teamCode: "TM-NEIGH",
    description:
      "Processing the notice period, closing the rent account and arranging secure key return.",
  },
  {
    code: "PRC-VOIDWORKS",
    name: "Void works & lettable standard",
    teamCode: "TM-VOIDS",
    description:
      "Safety checks, clearance, cleaning and repairs that bring an empty home up to the lettable standard.",
  },
  {
    code: "PRC-KEYS",
    name: "Key control & handover",
    teamCode: "TM-VOIDS",
    description:
      "Secure custody and auditable transfer of keys between contractors, voids and lettings teams.",
  },
  {
    code: "PRC-CBL",
    name: "Advertising & shortlisting",
    teamCode: "TM-LETTINGS",
    description:
      "Advertising the home through choice based lettings or direct channels and shortlisting against the allocations policy.",
  },
  {
    code: "PRC-AFFORD",
    name: "Affordability & income verification",
    teamCode: "TM-LETTINGS",
    description:
      "Assessing whether the applicant can sustain the rent and service charge, and arranging support where they cannot.",
  },
  {
    code: "PRC-FRAUDCHK",
    name: "Identity & tenancy fraud checks",
    teamCode: "TM-LETTINGS",
    description:
      "Verifying identity, residency and right to rent, and investigating inconsistencies before an offer is made.",
  },
  {
    code: "PRC-VIEW",
    name: "Accompanied viewing",
    teamCode: "TM-LETTINGS",
    description:
      "Showing the applicant the home, answering questions on rent and charges, and confirming the property meets their needs.",
  },
  {
    code: "PRC-SIGNUP",
    name: "Tenancy sign-up",
    teamCode: "TM-LETTINGS",
    description:
      "Completing the tenancy agreement, explaining rights and responsibilities and handing over keys.",
  },
  {
    code: "PRC-SETTLE",
    name: "Settling-in visit",
    teamCode: "TM-NEIGH",
    description:
      "Proactive contact around six weeks in to check welfare, resolve teething issues and confirm the tenancy is sustainable.",
  },

  // --- Income ------------------------------------------------------------
  {
    code: "PRC-DD",
    name: "Payment method set up",
    teamCode: "TM-INCOME",
    description:
      "Setting up direct debits or alternative payment arrangements at the start of the tenancy.",
  },
  {
    code: "PRC-BENEFIT",
    name: "Welfare benefit & money advice referral",
    teamCode: "TM-TENSUP",
    description:
      "Referring customers for benefit maximisation, budgeting help and access to hardship funds.",
  },
  {
    code: "PRC-ARREARS",
    name: "Arrears escalation & recovery",
    teamCode: "TM-INCOME",
    description:
      "Graduated contact, payment arrangements and pre-action protocol steps before any possession action.",
  },
  {
    code: "PRC-RENTREV",
    name: "Annual rent review",
    teamCode: "TM-INCOME",
    description:
      "Calculating the annual rent change within the Rent Standard and issuing statutory notice to customers.",
  },
  {
    code: "PRC-SVCCHARGE",
    name: "Service charge budgeting & actualisation",
    teamCode: "TM-FINANCE",
    description:
      "Setting annual service charge budgets, reconciling to actual spend and issuing statements to customers.",
  },

  // --- Customer experience ------------------------------------------------
  {
    code: "PRC-CONTACT",
    name: "First contact handling & triage",
    teamCode: "TM-CSC",
    description:
      "Answering contact across phone, web and app, resolving at first point where possible and routing cleanly where not.",
  },
  {
    code: "PRC-PORTAL",
    name: "Customer portal registration",
    teamCode: "TM-DIGITAL",
    description:
      "Registering customers for the app and portal and supporting those who need help to get online.",
  },
  {
    code: "PRC-ACCESS",
    name: "Reasonable adjustments & accessibility",
    teamCode: "TM-CX",
    description:
      "Recording communication and access needs, and adjusting how services are delivered to meet them.",
  },
  {
    code: "PRC-VULN",
    name: "Vulnerability flagging",
    teamCode: "TM-CX",
    description:
      "Capturing and maintaining vulnerability information so it is visible at every subsequent interaction.",
  },
  {
    code: "PRC-SAFEG",
    name: "Safeguarding referral",
    teamCode: "TM-TENSUP",
    description:
      "Raising concerns about a child or adult at risk with the designated lead and statutory partners.",
  },
  {
    code: "PRC-COMPLAINT1",
    name: "Complaint stage one investigation",
    teamCode: "TM-CRES",
    description:
      "Acknowledging, impartially investigating and responding to a complaint within Code timescales.",
  },
  {
    code: "PRC-COMPLAINT2",
    name: "Complaint stage two review",
    teamCode: "TM-CRES",
    description:
      "Independent review of a stage one outcome where the customer remains dissatisfied.",
  },
  {
    code: "PRC-REDRESS",
    name: "Remedy, compensation & learning",
    teamCode: "TM-CRES",
    description:
      "Putting things right through apology, action or compensation, and recording root cause to change the service.",
  },
  {
    code: "PRC-SCRUTINY",
    name: "Scrutiny panel & involvement",
    teamCode: "TM-CENG",
    description:
      "Resident-led review of services and formal consultation on policy changes.",
  },
  {
    code: "PRC-SURVEY",
    name: "TSM perception survey",
    teamCode: "TM-INSIGHT",
    description:
      "Running the annual tenant perception survey to the regulator's requirements and publishing the results.",
  },
  {
    code: "PRC-YSWD",
    name: "'You said, we did' reporting",
    teamCode: "TM-CENG",
    description:
      "Closing the feedback loop by telling customers what changed as a result of what they told us.",
  },
  {
    code: "PRC-KIM",
    name: "Knowledge & information management",
    teamCode: "TM-INSIGHT",
    description:
      "Keeping property and customer records accurate, complete and available to the people who need them.",
  },

  // --- Neighbourhoods -----------------------------------------------------
  {
    code: "PRC-ASBCASE",
    name: "ASB case management",
    teamCode: "TM-NEIGH",
    description:
      "Logging reports, risk assessing the victim, gathering evidence and applying the enforcement ladder.",
  },
  {
    code: "PRC-ESTINSP",
    name: "Estate inspection",
    teamCode: "TM-NEIGH",
    description:
      "Scheduled walkabouts checking cleaning, grounds, lighting and health and safety on estates.",
  },
  {
    code: "PRC-GROUNDS",
    name: "Cleaning & grounds contract management",
    teamCode: "TM-NEIGH",
    description:
      "Monitoring the performance of cleaning and grounds maintenance contractors against specification.",
  },
  {
    code: "PRC-PARTNER",
    name: "Multi-agency partnership working",
    teamCode: "TM-NEIGH",
    description:
      "Working with police, social care and the local authority on complex community and household issues.",
  },

  // --- Home ownership -----------------------------------------------------
  {
    code: "PRC-SALESMKT",
    name: "Sales marketing & listings",
    teamCode: "TM-SALES",
    description:
      "Marketing homes on portals and through show homes, with accurate lease and charge information up front.",
  },
  {
    code: "PRC-SOELIG",
    name: "Shared ownership eligibility & affordability",
    teamCode: "TM-SALES",
    description:
      "Assessing eligibility and running the affordability test to set a sustainable initial share.",
  },
  {
    code: "PRC-RESERVE",
    name: "Reservation & memorandum of sale",
    teamCode: "TM-SALES",
    description:
      "Taking the reservation, issuing the memorandum of sale and instructing solicitors on both sides.",
  },
  {
    code: "PRC-CONVEY",
    name: "Conveyancing progression",
    teamCode: "TM-SALES",
    description:
      "Chasing solicitors and lenders to keep the transaction moving to exchange and completion.",
  },
  {
    code: "PRC-MORTGAGE",
    name: "Mortgage offer verification",
    teamCode: "TM-SALES",
    description:
      "Checking the formal mortgage offer is consistent with the affordability assessment and lease terms.",
  },
  {
    code: "PRC-HOMEDEMO",
    name: "Home demonstration & completion",
    teamCode: "TM-SALES",
    description:
      "Walking the buyer through how the home works, releasing keys and explaining the defects route.",
  },
  {
    code: "PRC-CASHBACK",
    name: "Repairs allowance claim",
    teamCode: "TM-HOMEOWN",
    description:
      "Administering the shared ownership repairs allowance and processing claims for essential repairs.",
  },
  {
    code: "PRC-RICS",
    name: "RICS valuation instruction",
    teamCode: "TM-HOMEOWN",
    description:
      "Instructing an independent RICS valuation to set the price of additional shares or a resale.",
  },
  {
    code: "PRC-STAIR",
    name: "Staircasing application & equity sale",
    teamCode: "TM-HOMEOWN",
    description:
      "Processing the purchase of additional shares, including gradual staircasing in one per cent increments.",
  },
  {
    code: "PRC-LEASEAMEND",
    name: "Lease amendment & rent recalculation",
    teamCode: "TM-HOMEOWN",
    description:
      "Updating the lease and recalculating the rent payable on the retained equity after staircasing.",
  },
  {
    code: "PRC-NOMINATE",
    name: "Resale nomination period",
    teamCode: "TM-HOMEOWN",
    description:
      "Marketing a resale to the waiting list during the nomination period set out in the lease.",
  },
  {
    code: "PRC-OPENMKT",
    name: "Open market resale release",
    teamCode: "TM-HOMEOWN",
    description:
      "Releasing the property to estate agents where no nominee is found within the nomination period.",
  },
];
