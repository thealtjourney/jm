/**
 * Social housing policy library. Codes are internal handles for the map; the
 * `url` field is left blank so an admin can point each entry at the real
 * document on the intranet or policy hub.
 */

export type PolicySeed = {
  code: string;
  name: string;
  category: string;
  description: string;
};

export const POLICY_SEED: PolicySeed[] = [
  // --- Growth and development -------------------------------------------
  {
    code: "POL-DEV",
    name: "Development & Growth Policy",
    category: "Growth",
    description:
      "Sets the criteria for acquiring land and committing to new schemes, including strategic fit, tenure mix and the financial hurdles a scheme must clear.",
  },
  {
    code: "POL-PROC",
    name: "Procurement & Contract Management Policy",
    category: "Governance",
    description:
      "How contractors and consultants are selected, contracted and performance-managed, including thresholds and social value requirements.",
  },
  {
    code: "POL-VFM",
    name: "Value for Money Strategy",
    category: "Governance",
    description:
      "The economy, efficiency and effectiveness tests applied to investment decisions and the metrics reported to the Board.",
  },
  {
    code: "POL-DISP",
    name: "Asset Disposals Policy",
    category: "Assets",
    description:
      "Grounds on which a home may be sold or transferred, the approval route, and how capital receipts are reinvested.",
  },

  // --- Property, safety and standards -----------------------------------
  {
    code: "POL-ASSET",
    name: "Asset Management Strategy",
    category: "Assets",
    description:
      "The framework for understanding stock performance, setting investment priorities and deciding whether to retain, invest in or dispose of an asset.",
  },
  {
    code: "POL-DHS",
    name: "Decent Homes & Property Standards Policy",
    category: "Assets",
    description:
      "The minimum condition standard every home must meet, plus the lettable standard applied before a property is re-let.",
  },
  {
    code: "POL-PLAN",
    name: "Planned & Cyclical Investment Policy",
    category: "Assets",
    description:
      "How component lifecycles drive planned replacement programmes for kitchens, bathrooms, roofs, windows and heating.",
  },
  {
    code: "POL-REP",
    name: "Responsive Repairs & Maintenance Policy",
    category: "Repairs",
    description:
      "Repair categories, target timescales, the split of responsibility between landlord and customer, and the right-first-time standard.",
  },
  {
    code: "POL-RECH",
    name: "Rechargeable Repairs Policy",
    category: "Repairs",
    description:
      "When the cost of a repair is recovered from a customer, how it is assessed and evidenced, and the appeal route.",
  },
  {
    code: "POL-VOID",
    name: "Void Management Policy",
    category: "Repairs",
    description:
      "Target turnaround times, the standard a property must reach before re-letting, and how void loss is monitored.",
  },
  {
    code: "POL-BSAFE",
    name: "Building Safety Policy",
    category: "Compliance",
    description:
      "Duties under the Building Safety Act, including the golden thread of information, accountable person responsibilities and resident engagement strategies.",
  },
  {
    code: "POL-FIRE",
    name: "Fire Safety Policy",
    category: "Compliance",
    description:
      "Fire risk assessment programme, remedial action tracking and evacuation strategy for communal buildings.",
  },
  {
    code: "POL-GAS",
    name: "Gas & Heating Safety Policy",
    category: "Compliance",
    description:
      "Annual gas safety check cycle, no-access escalation procedure and management of the landlord gas safety record.",
  },
  {
    code: "POL-ELEC",
    name: "Electrical Safety Policy",
    category: "Compliance",
    description:
      "Frequency of electrical installation condition reports and the process for remedying C1 and C2 defects.",
  },
  {
    code: "POL-ASBESTOS",
    name: "Asbestos Management Policy",
    category: "Compliance",
    description:
      "Survey types, the asbestos register, and how information is shared with operatives and contractors before work starts.",
  },
  {
    code: "POL-WATER",
    name: "Water Hygiene (Legionella) Policy",
    category: "Compliance",
    description:
      "Legionella risk assessment programme and ongoing monitoring of communal water systems.",
  },
  {
    code: "POL-LIFT",
    name: "Lift Safety Policy",
    category: "Compliance",
    description:
      "LOLER inspection cycle, entrapment response standards and out-of-service escalation.",
  },
  {
    code: "POL-DAMP",
    name: "Damp, Mould & Condensation Policy",
    category: "Repairs",
    description:
      "How damp and mould reports are triaged, investigated and resolved, with no assumption that the cause is customer lifestyle.",
  },
  {
    code: "POL-SUST",
    name: "Sustainability & Decarbonisation Policy",
    category: "Assets",
    description:
      "The pathway to EPC C and net zero, retrofit standards including PAS 2035, and how customers are supported through works.",
  },
  {
    code: "POL-ADAPT",
    name: "Aids & Adaptations Policy",
    category: "Assets",
    description:
      "Eligibility and funding for minor and major adaptations, and how referrals from occupational therapists are handled.",
  },
  {
    code: "POL-HS",
    name: "Health & Safety Policy",
    category: "Compliance",
    description:
      "Organisational health and safety duties covering staff, contractors, customers and members of the public.",
  },

  // --- Tenancy and income ------------------------------------------------
  {
    code: "POL-ALLOC",
    name: "Allocations & Lettings Policy",
    category: "Tenancy",
    description:
      "Eligibility, banding, nomination agreements with local authorities, and how homes are matched to applicant need.",
  },
  {
    code: "POL-TEN",
    name: "Tenancy Policy",
    category: "Tenancy",
    description:
      "Tenancy types offered, security of tenure, succession, assignment, mutual exchange and grounds for ending a tenancy.",
  },
  {
    code: "POL-TENSUS",
    name: "Tenancy Sustainment Policy",
    category: "Tenancy",
    description:
      "Early identification of households at risk of losing their home and the support offer that keeps tenancies going.",
  },
  {
    code: "POL-FRAUD",
    name: "Tenancy Fraud & Anti-Fraud Policy",
    category: "Governance",
    description:
      "Identity and residency verification, investigation of suspected fraud, and recovery of homes obtained fraudulently.",
  },
  {
    code: "POL-RENT",
    name: "Rent Setting Policy",
    category: "Income",
    description:
      "How rents are set and reviewed within the Rent Standard, and the notice given to customers of any change.",
  },
  {
    code: "POL-SVC",
    name: "Service Charges Policy",
    category: "Income",
    description:
      "What can be recovered through service charges, how budgets and actuals are calculated, and the consultation duties that apply.",
  },
  {
    code: "POL-INC",
    name: "Income Management & Arrears Policy",
    category: "Income",
    description:
      "Payment methods offered, the arrears escalation ladder, and the pre-action protocol steps taken before possession is sought.",
  },

  // --- Customer experience ----------------------------------------------
  {
    code: "POL-CUST",
    name: "Customer Service Standards",
    category: "Customer",
    description:
      "The service promises made to customers on contact channels, response times and how people can expect to be treated.",
  },
  {
    code: "POL-DIG",
    name: "Digital & Channel Access Policy",
    category: "Customer",
    description:
      "The digital-first offer, accessibility standards for online services, and how non-digital customers are supported.",
  },
  {
    code: "POL-ENG",
    name: "Customer Engagement & Involvement Policy",
    category: "Customer",
    description:
      "The routes through which customers scrutinise and influence services, and how the organisation reports back on what changed.",
  },
  {
    code: "POL-COMP",
    name: "Complaints & Compensation Policy",
    category: "Customer",
    description:
      "The two-stage complaints process aligned to the Housing Ombudsman Complaint Handling Code, remedies offered and how learning is captured.",
  },
  {
    code: "POL-VULN",
    name: "Vulnerable Customers & Reasonable Adjustments Policy",
    category: "Customer",
    description:
      "How vulnerability is identified and recorded, and the adjustments made so customers can access services equally.",
  },
  {
    code: "POL-SAFEG",
    name: "Safeguarding Policy",
    category: "Customer",
    description:
      "Recognising and referring concerns about children and adults at risk, and the duty to cooperate with statutory partners.",
  },
  {
    code: "POL-EDI",
    name: "Equality, Diversity & Inclusion Policy",
    category: "Governance",
    description:
      "Public sector equality duty commitments, equality impact assessment of decisions, and use of diversity data.",
  },
  {
    code: "POL-DP",
    name: "Data Protection & Privacy Policy",
    category: "Governance",
    description:
      "Lawful basis for processing customer data, retention periods, and how subject access and erasure requests are handled.",
  },
  {
    code: "POL-KIM",
    name: "Knowledge & Information Management Policy",
    category: "Governance",
    description:
      "How property and customer records are created, quality-assured and kept current so decisions rest on accurate data.",
  },

  // --- Neighbourhoods ----------------------------------------------------
  {
    code: "POL-ASB",
    name: "Anti-Social Behaviour Policy",
    category: "Neighbourhood",
    description:
      "ASB categories and response times, victim risk assessment and support, evidence gathering and the enforcement ladder.",
  },
  {
    code: "POL-EST",
    name: "Estate Management Policy",
    category: "Neighbourhood",
    description:
      "Standards for cleaning, grounds maintenance and communal areas, and the estate inspection regime that checks them.",
  },

  // --- Home ownership ----------------------------------------------------
  {
    code: "POL-SO",
    name: "Shared Ownership Sales Policy",
    category: "Home ownership",
    description:
      "Eligibility and affordability assessment for shared ownership, minimum and maximum initial shares, and the reservation process.",
  },
  {
    code: "POL-STAIR",
    name: "Staircasing & Resales Policy",
    category: "Home ownership",
    description:
      "How additional shares are purchased and valued, the nomination period on resale, and the fees that apply.",
  },
  {
    code: "POL-LEASE",
    name: "Leasehold Management Policy",
    category: "Home ownership",
    description:
      "Lease obligations on both sides, the shared ownership repairs allowance, consents for alterations and subletting rules.",
  },
];
