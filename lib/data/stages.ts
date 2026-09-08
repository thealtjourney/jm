/**
 * The three journeys and their stages. Activity and excellence copy is carried
 * over from the original journey map; the policy and process mappings are
 * a first-pass authored set for the business to review and refine in-app.
 */

export type JourneySeed = {
  key: string;
  name: string;
  description: string;
  tenure: "LCRA" | "LCHO" | "N/A";
  colour: string;
};

export type StageSeed = {
  journeyKey: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  type: string;
  /** The team answerable for this stage. */
  accountableTeam: string;
  /** The named post that carries it. */
  accountableRole: string;
  activities: string;
  excellence: string;
  tsmCodes: string[];
  policyCodes: string[];
  processCodes: string[];
};

export const JOURNEY_SEED: JourneySeed[] = [
  {
    key: "property",
    name: "Property Journey",
    description:
      "The life of the asset, from land acquisition through construction and active management to eventual disposal.",
    tenure: "N/A",
    colour: "#006064",
  },
  {
    key: "customer",
    name: "Rented Customer Journey",
    description:
      "The life of a rented tenancy, from first contact and letting through living in the home to moving on.",
    tenure: "LCRA",
    colour: "#e67e22",
  },
  {
    key: "owner",
    name: "Shared Ownership Journey",
    description:
      "The shared ownership experience, from sales and conveyancing through living in the home to staircasing and resale.",
    tenure: "LCHO",
    colour: "#8e44ad",
  },
];

export const STAGE_SEED: StageSeed[] = [
  // =======================================================================
  // PROPERTY JOURNEY
  // =======================================================================
  {
    journeyKey: "property",
    code: "P1",
    title: "Land Acquisition",
    subtitle: "New Business",
    icon: "\u{1F5FA}\u{FE0F}",
    type: "property",
    accountableTeam: "TM-NEWBUS",
    accountableRole: "Director of Growth & Development",
    activities:
      "<ul><li><strong>Site identification:</strong> scanning the market for viable land opportunities that match strategic growth areas.</li><li><strong>Financial viability assessment:</strong> testing NPV and IRR so the scheme is financially sound before any offer is made.</li><li><strong>Negotiation:</strong> securing land at the right price and agreeing heads of terms with landowners and agents.</li><li><strong>Partnership creation:</strong> establishing Section 106 agreements with developers or setting up joint ventures.</li><li><strong>Planning application:</strong> managing architects and consultants to submit robust applications to local authorities.</li><li><strong>Grant funding:</strong> securing allocation from Homes England where applicable.</li></ul>",
    excellence:
      "<ul><li><strong>Strategic fit:</strong> land is acquired in a high-demand area that meets evidenced local housing need.</li><li><strong>Viable schemes:</strong> projects stack up without later value engineering that compromises quality for the people who will live there.</li><li><strong>Smooth planning:</strong> community consultation happens early, and permission is secured with minimal conditions.</li><li><strong>Zero abortive costs:</strong> legal and ground due diligence is thorough enough to prevent costly late pull-outs.</li><li><strong>Designed for life:</strong> tenure mix, space standards and accessibility are settled at acquisition, not retrofitted later.</li></ul>",
    tsmCodes: [],
    policyCodes: ["POL-DEV", "POL-VFM", "POL-PROC", "POL-EDI"],
    processCodes: [
      "PRC-LAND",
      "PRC-VIABILITY",
      "PRC-S106",
      "PRC-PLANNING",
      "PRC-GRANT",
      "PRC-BOARDREP",
    ],
  },
  {
    journeyKey: "property",
    code: "P2",
    title: "Construction",
    subtitle: "Delivery Team",
    icon: "\u{1F3D7}\u{FE0F}",
    type: "property",
    accountableTeam: "TM-DEVDEL",
    accountableRole: "Head of Development Delivery",
    activities:
      "<ul><li><strong>Contractor management:</strong> acting as client representative and holding main contractors to their JCT Design &amp; Build obligations.</li><li><strong>Site supervision:</strong> clerk of works inspections at key stages including foundations and first fix.</li><li><strong>Health and safety:</strong> monitoring CDM compliance on site throughout the build.</li><li><strong>Stakeholder updates:</strong> regular reporting to the Board on spend, programme and risk.</li><li><strong>Golden thread:</strong> capturing the digital building safety information required under the Building Safety Act.</li></ul>",
    excellence:
      "<ul><li><strong>On time and on budget:</strong> the scheme completes on the promised date, so letting forecasts hold.</li><li><strong>High quality finish:</strong> a snag-free standard is reached before practical completion is even attempted.</li><li><strong>Safe sites:</strong> zero RIDDOR-reportable accidents during the build.</li><li><strong>Future proof:</strong> homes meet or exceed energy efficiency standards, reducing the future retrofit burden and customer bills.</li><li><strong>Records built in:</strong> the golden thread is assembled as the building goes up, not reconstructed afterwards.</li></ul>",
    tsmCodes: ["TP04", "TP05"],
    policyCodes: ["POL-DEV", "POL-BSAFE", "POL-HS", "POL-PROC", "POL-SUST"],
    processCodes: [
      "PRC-TENDER",
      "PRC-SITEINSP",
      "PRC-CDM",
      "PRC-GOLDTHREAD",
      "PRC-BOARDREP",
    ],
  },
  {
    journeyKey: "property",
    code: "P3",
    title: "Handover",
    subtitle: "Defects Period",
    icon: "\u{1F511}",
    type: "property",
    accountableTeam: "TM-DEVDEL",
    accountableRole: "Head of Development Delivery",
    activities:
      "<ul><li><strong>Practical completion:</strong> formal sign-off that the building is ready for occupation and keys are accepted.</li><li><strong>Compliance handover:</strong> immediate transfer of gas, electrical, fire and lift certificates into the compliance system.</li><li><strong>Defects liability period:</strong> managing the twelve months during which the builder remains responsible for fixes.</li><li><strong>End of defects inspection:</strong> final check at month eleven or twelve before retention is released.</li></ul>",
    excellence:
      "<ul><li><strong>Zero day-one defects:</strong> the customer moves in and the heating, locks and windows all work.</li><li><strong>Seamless data:</strong> asset management holds complete component and lifecycle data from day one.</li><li><strong>Fast rectification:</strong> where a defect does occur, the builder fixes it to the same timescales as a responsive repair.</li><li><strong>Customer knowledge:</strong> new residents understand how to run their heating system before they need it.</li><li><strong>No gaps:</strong> nobody moves into a home whose safety certification has not already been logged.</li></ul>",
    tsmCodes: ["TP04", "TP05", "BS01", "BS02", "BS03", "BS04", "BS05"],
    policyCodes: ["POL-BSAFE", "POL-DHS", "POL-KIM", "POL-GAS", "POL-ELEC"],
    processCodes: [
      "PRC-PC",
      "PRC-COMPHAND",
      "PRC-ASSETLOAD",
      "PRC-DEFECTS",
      "PRC-EOD",
      "PRC-GOLDTHREAD",
      "PRC-KIM",
    ],
  },
  {
    journeyKey: "property",
    code: "P4",
    title: "Void & Re-Let",
    subtitle: "Turnaround",
    icon: "\u{1F9F9}",
    type: "property",
    accountableTeam: "TM-VOIDS",
    accountableRole: "Head of Repairs & Voids",
    activities:
      "<ul><li><strong>Pre-void inspection:</strong> inspecting the property before the outgoing customer leaves to identify recharges and works.</li><li><strong>Void works:</strong> rapid safety checks, clearance, cleaning and minor repairs to reach the lettable standard.</li><li><strong>EPC check:</strong> confirming the energy rating meets the minimum before the home is re-let.</li><li><strong>Key management:</strong> secure transfer of keys from the voids team to lettings.</li></ul>",
    excellence:
      "<ul><li><strong>Speed:</strong> key-to-key turnaround inside target, so homes are not standing empty and rent is not lost.</li><li><strong>Safety first:</strong> a complete compliance package is ready before the new customer takes the keys.</li><li><strong>Lettable standard:</strong> the property is clean, cleared and genuinely ready to be someone's home.</li><li><strong>Honest condition:</strong> what the applicant saw at viewing is what they get on move-in day.</li></ul>",
    tsmCodes: ["TP04", "RP01", "BS01"],
    policyCodes: ["POL-VOID", "POL-DHS", "POL-RECH", "POL-SUST", "POL-GAS"],
    processCodes: [
      "PRC-PTV",
      "PRC-VOIDWORKS",
      "PRC-EPC",
      "PRC-KEYS",
      "PRC-RECHARGE",
      "PRC-GASSERV",
    ],
  },
  {
    journeyKey: "property",
    code: "P5",
    title: "Asset Management",
    subtitle: "Safety & Maintenance",
    icon: "\u{1F6E0}\u{FE0F}",
    type: "property",
    accountableTeam: "TM-ASSET",
    accountableRole: "Director of Property & Assets",
    activities:
      "<ul><li><strong>Big six compliance:</strong> managing cycles for gas, fire, asbestos, legionella, lifts and electrical safety.</li><li><strong>Stock condition surveys:</strong> a rolling programme validating component age and condition across the portfolio.</li><li><strong>Planned investment:</strong> replacing kitchens, bathrooms, roofs and windows on lifecycle data rather than on failure.</li><li><strong>Responsive repairs:</strong> managing the direct labour organisation and contractors for day-to-day fixes.</li><li><strong>Damp and mould:</strong> investigating reports at root cause and tracking cases to resolution.</li></ul>",
    excellence:
      "<ul><li><strong>Full compliance:</strong> no home is ever without a valid safety certificate, and no-access cases are escalated rather than parked.</li><li><strong>Predictive maintenance:</strong> components are replaced before they fail, not after a winter breakdown.</li><li><strong>Right first time:</strong> repairs are diagnosed correctly and fixed in a single visit.</li><li><strong>Decent homes and better:</strong> homes exceed the minimum standard and are warm, modern and desirable.</li><li><strong>Data you can trust:</strong> investment decisions rest on surveyed condition data, not assumption.</li></ul>",
    tsmCodes: [
      "TP02",
      "TP03",
      "TP04",
      "TP05",
      "RP01",
      "RP02",
      "BS01",
      "BS02",
      "BS03",
      "BS04",
      "BS05",
    ],
    policyCodes: [
      "POL-ASSET",
      "POL-DHS",
      "POL-PLAN",
      "POL-REP",
      "POL-DAMP",
      "POL-BSAFE",
      "POL-FIRE",
      "POL-GAS",
      "POL-ELEC",
      "POL-ASBESTOS",
      "POL-WATER",
      "POL-LIFT",
      "POL-ADAPT",
      "POL-HS",
    ],
    processCodes: [
      "PRC-SCS",
      "PRC-PLANPROG",
      "PRC-GASSERV",
      "PRC-FRA",
      "PRC-ASBSURV",
      "PRC-LEGIONELLA",
      "PRC-LIFT",
      "PRC-EICR",
      "PRC-REPDEL",
      "PRC-DAMP",
      "PRC-ADAPT",
      "PRC-KIM",
    ],
  },
  {
    journeyKey: "property",
    code: "P6",
    title: "Disposal & Retrofit",
    subtitle: "End of Lifecycle",
    icon: "\u{267B}\u{FE0F}",
    type: "property",
    accountableTeam: "TM-ASSET",
    accountableRole: "Head of Asset Management",
    activities:
      "<ul><li><strong>Option appraisal:</strong> analysing assets where maintenance cost outweighs return and deciding whether to keep, invest or sell.</li><li><strong>Retrofit projects:</strong> delivering PAS 2035 decarbonisation works such as insulation and heat pumps to hit energy targets.</li><li><strong>Disposal process:</strong> managing legal conveyance for sales on the open market or at auction.</li></ul>",
    excellence:
      "<ul><li><strong>Strategic alignment:</strong> every home in the portfolio makes a positive financial or social contribution.</li><li><strong>Future proofed:</strong> retained stock is energy efficient and affordable for customers to heat.</li><li><strong>Best value:</strong> disposals generate the maximum receipt to reinvest in new and better homes.</li><li><strong>Customers first:</strong> where a home is sold or retrofitted, residents are consulted early and supported throughout.</li></ul>",
    tsmCodes: ["RP01", "TP04"],
    policyCodes: ["POL-DISP", "POL-ASSET", "POL-SUST", "POL-VFM", "POL-ENG"],
    processCodes: [
      "PRC-OPTAPP",
      "PRC-RETROFIT",
      "PRC-DISPOSAL",
      "PRC-EPC",
      "PRC-SCRUTINY",
    ],
  },

  // =======================================================================
  // RENTED CUSTOMER JOURNEY
  // =======================================================================
  {
    journeyKey: "customer",
    code: "C1",
    title: "What Matters",
    subtitle: "Framework",
    icon: "\u{1F49B}",
    type: "framework",
    accountableTeam: "TM-CX",
    accountableRole: "Director of Customer & Communities",
    activities:
      "<ul><li><strong>Integration:</strong> embedding the values in every interaction, from the contact centre to the operative on the doorstep.</li><li><strong>Training:</strong> making sure every colleague understands what the standard looks like in their role.</li><li><strong>Measurement:</strong> using perception scores to test whether the values are actually being lived.</li></ul>",
    excellence:
      "<ul><li><strong>Empathy:</strong> we listen and we care.</li><li><strong>Ownership:</strong> we take responsibility and see it through.</li><li><strong>Clarity:</strong> we keep it simple and keep you informed.</li><li><strong>Speed:</strong> we value your time.</li><li><strong>Fairness:</strong> we treat everyone with respect and adjust how we work to meet individual needs.</li></ul>",
    tsmCodes: ["TP01", "TP06", "TP07", "TP08"],
    policyCodes: ["POL-CUST", "POL-EDI", "POL-VULN", "POL-ENG"],
    processCodes: ["PRC-SURVEY", "PRC-ACCESS", "PRC-VULN"],
  },
  {
    journeyKey: "customer",
    code: "C2",
    title: "Helping Hand",
    subtitle: "Contact Centre Triage",
    icon: "\u{1F3A7}",
    type: "csc",
    accountableTeam: "TM-CSC",
    accountableRole: "Head of Customer Service",
    activities:
      "<ul><li><strong>First contact resolution:</strong> aiming to solve the query in a single contact.</li><li><strong>Speed of answer:</strong> answering calls inside the published target.</li><li><strong>Triage:</strong> routing complex cases to specialist teams without bouncing the customer between them.</li><li><strong>Empathy:</strong> active listening where a customer is in distress, and recognising when to escalate.</li></ul>",
    excellence:
      "<ul><li><strong>Accessibility:</strong> we are easy to reach by phone, web and app, and easy to reach for people who cannot use those channels.</li><li><strong>Knowledge:</strong> advisers are empowered to make decisions rather than take a message.</li><li><strong>Clean hand-off:</strong> if a case is transferred, the customer never has to tell their story twice.</li><li><strong>Recorded needs:</strong> vulnerability and adjustment information is captured once and visible to everyone thereafter.</li></ul>",
    tsmCodes: ["TP01", "TP07", "TP08"],
    policyCodes: ["POL-CUST", "POL-VULN", "POL-DP", "POL-SAFEG", "POL-EDI"],
    processCodes: [
      "PRC-CONTACT",
      "PRC-ACCESS",
      "PRC-VULN",
      "PRC-SAFEG",
      "PRC-KIM",
    ],
  },
  {
    journeyKey: "customer",
    code: "C3",
    title: "Voice of the Customer",
    subtitle: "Engagement",
    icon: "\u{1F4E2}",
    type: "voice",
    accountableTeam: "TM-CENG",
    accountableRole: "Head of Customer Engagement",
    activities:
      "<ul><li><strong>Scrutiny panels:</strong> resident-led reviews of how services actually perform.</li><li><strong>Consultation:</strong> formal engagement on policy and service changes before they are made.</li><li><strong>Surveys:</strong> transactional surveys after individual events and annual perception surveys across the customer base.</li></ul>",
    excellence:
      "<ul><li><strong>Influence:</strong> residents can point to decisions that changed because of what they said.</li><li><strong>Accountability:</strong> 'you said, we did' reporting is routine and specific.</li><li><strong>Representative:</strong> the people involved reflect the diversity of the customer base, not just those easiest to reach.</li><li><strong>Acted on:</strong> insight from complaints, surveys and panels lands in the same place and drives one improvement plan.</li></ul>",
    tsmCodes: ["TP06", "TP07"],
    policyCodes: ["POL-ENG", "POL-EDI", "POL-CUST"],
    processCodes: ["PRC-SCRUTINY", "PRC-SURVEY", "PRC-YSWD", "PRC-REPSURVEY"],
  },
  {
    journeyKey: "customer",
    code: "C4",
    title: "New Chapter",
    subtitle: "Lettings",
    icon: "\u{1F4DD}",
    type: "customer",
    accountableTeam: "TM-LETTINGS",
    accountableRole: "Head of Housing & Neighbourhoods",
    activities:
      "<ul><li><strong>Marketing:</strong> advertising homes through choice based lettings or direct channels.</li><li><strong>Vetting:</strong> thorough affordability assessment and identity and fraud checks.</li><li><strong>Matching:</strong> making sure the property genuinely meets the applicant's needs, including accessibility.</li><li><strong>Viewings:</strong> accompanied viewings that answer questions honestly and set expectations.</li></ul>",
    excellence:
      "<ul><li><strong>Speed:</strong> void turnaround is minimised, so homes do not sit empty while people wait.</li><li><strong>Transparency:</strong> applicants know exactly what the rent and service charges will be before they commit.</li><li><strong>Sustainability:</strong> tenancies start with a payment plan already in place, preventing immediate arrears.</li><li><strong>First impression:</strong> the home is clean, safe and welcoming at the viewing.</li><li><strong>Right home:</strong> nobody is offered a property that cannot meet their household or mobility needs.</li></ul>",
    tsmCodes: ["TP08"],
    policyCodes: [
      "POL-ALLOC",
      "POL-TEN",
      "POL-RENT",
      "POL-SVC",
      "POL-FRAUD",
      "POL-EDI",
      "POL-VULN",
    ],
    processCodes: [
      "PRC-CBL",
      "PRC-AFFORD",
      "PRC-FRAUDCHK",
      "PRC-VIEW",
      "PRC-ACCESS",
    ],
  },
  {
    journeyKey: "customer",
    code: "C5",
    title: "Warm Welcome",
    subtitle: "Onboarding",
    icon: "\u{1F4E6}",
    type: "customer",
    accountableTeam: "TM-LETTINGS",
    accountableRole: "Head of Housing & Neighbourhoods",
    activities:
      "<ul><li><strong>Sign-up:</strong> completing the tenancy agreement, digitally or in person, and handing over keys.</li><li><strong>Digital set-up:</strong> registering the customer for the portal and setting up a direct debit.</li><li><strong>Settling-in visit:</strong> proactive contact at around six weeks to check welfare and resolve teething issues.</li><li><strong>Signposting:</strong> referring to furniture, utility or benefit support where the household needs it.</li></ul>",
    excellence:
      "<ul><li><strong>Clarity:</strong> the customer fully understands their rights and their responsibilities.</li><li><strong>Connection:</strong> they know exactly who to contact and how, and they have used that route once already.</li><li><strong>No surprises:</strong> they know how to work the heating and where the stopcock is on day one.</li><li><strong>Safety:</strong> the home feels safe and secure from the first night.</li><li><strong>Money sorted:</strong> benefit claims and payment arrangements are in place before the first charge falls due.</li></ul>",
    tsmCodes: ["TP01", "TP05", "TP07"],
    policyCodes: [
      "POL-TEN",
      "POL-TENSUS",
      "POL-INC",
      "POL-VULN",
      "POL-DP",
      "POL-DIG",
    ],
    processCodes: [
      "PRC-SIGNUP",
      "PRC-DD",
      "PRC-PORTAL",
      "PRC-SETTLE",
      "PRC-BENEFIT",
      "PRC-VULN",
    ],
  },
  {
    journeyKey: "customer",
    code: "C6",
    title: "Digital Self-Service",
    subtitle: "App & Portal",
    icon: "\u{1F4F1}",
    type: "digital",
    accountableTeam: "TM-DIGITAL",
    accountableRole: "Head of Digital",
    activities:
      "<ul><li><strong>Self-service:</strong> rent checks, payments and repair booking available at any hour through the app and portal.</li><li><strong>Accessibility:</strong> making sure digital tools meet WCAG 2.1 so all customers can use them.</li><li><strong>Automation:</strong> immediate confirmation by email or text for every interaction.</li></ul>",
    excellence:
      "<ul><li><strong>Immediate:</strong> a customer can sort their issue at ten o'clock on a Sunday night.</li><li><strong>Useful:</strong> repair tracking is real-time, so people know where their appointment stands.</li><li><strong>Simple:</strong> the design is intuitive enough that nobody needs training to use it.</li><li><strong>Never the only door:</strong> digital is the easiest channel, not a barrier for people who cannot use it.</li></ul>",
    tsmCodes: ["TP01", "TP07"],
    policyCodes: ["POL-DIG", "POL-DP", "POL-EDI", "POL-CUST"],
    processCodes: ["PRC-PORTAL", "PRC-CONTACT", "PRC-ACCESS", "PRC-KIM"],
  },
  {
    journeyKey: "customer",
    code: "C7",
    title: "Great Home",
    subtitle: "Repairs",
    icon: "\u{1F6E0}\u{FE0F}",
    type: "customer",
    accountableTeam: "TM-REPAIRS",
    accountableRole: "Head of Repairs & Voids",
    activities:
      "<ul><li><strong>Triage:</strong> diagnosing the issue at first point of contact and identifying responsibility immediately.</li><li><strong>Vulnerability check:</strong> flagging where an assisted repair is needed because of age, disability or risk.</li><li><strong>Scheduling:</strong> offering real-time appointment slots that suit the customer.</li><li><strong>Execution:</strong> the operative arrives on time with the right parts and treats the home with respect.</li><li><strong>Feedback:</strong> an immediate survey after the visit to capture satisfaction.</li></ul>",
    excellence:
      "<ul><li><strong>Right first time:</strong> the operative fixes it in one visit rather than ordering a part and returning.</li><li><strong>Communication:</strong> 'on my way' messages mean nobody waits in all day.</li><li><strong>Respect:</strong> operatives protect the home, clear up and explain what they have done.</li><li><strong>Ease:</strong> booking a repair is as simple as booking any other service.</li><li><strong>Damp taken seriously:</strong> reports of damp and mould are investigated at root cause, never blamed on lifestyle.</li></ul>",
    tsmCodes: ["TP02", "TP03", "TP04", "TP05", "RP02"],
    policyCodes: [
      "POL-REP",
      "POL-DAMP",
      "POL-RECH",
      "POL-VULN",
      "POL-ADAPT",
      "POL-HS",
      "POL-ASBESTOS",
    ],
    processCodes: [
      "PRC-REPTRIAGE",
      "PRC-REPSCHED",
      "PRC-REPDEL",
      "PRC-REPSURVEY",
      "PRC-DAMP",
      "PRC-ADAPT",
      "PRC-VULN",
      "PRC-RECHARGE",
    ],
  },
  {
    journeyKey: "customer",
    code: "C8",
    title: "Community",
    subtitle: "ASB & Place",
    icon: "\u{1F91D}",
    type: "customer",
    accountableTeam: "TM-NEIGH",
    accountableRole: "Head of Housing & Neighbourhoods",
    activities:
      "<ul><li><strong>Estate inspections:</strong> regular walkabouts checking cleaning standards, grounds maintenance and safety issues.</li><li><strong>ASB management:</strong> logging cases, risk assessing victims, gathering evidence and enforcing where needed.</li><li><strong>Tenancy sustainment:</strong> identifying households in crisis and referring to specialist support.</li><li><strong>Partnership working:</strong> liaising with police, social care and the local authority on complex issues.</li></ul>",
    excellence:
      "<ul><li><strong>Clean and safe:</strong> communal areas are spotless, grass is cut and lights work. People are proud of where they live.</li><li><strong>Peace of mind:</strong> ASB is dealt with swiftly, and victims are supported and kept informed rather than left wondering.</li><li><strong>Presence:</strong> staff are visible in the community, not just voices on a phone.</li><li><strong>Community spirit:</strong> residents look out for each other and tenancy turnover is low.</li><li><strong>Support before enforcement:</strong> the cause of the behaviour is addressed wherever it can be.</li></ul>",
    tsmCodes: ["NM01", "TP10", "TP11", "TP12"],
    policyCodes: [
      "POL-ASB",
      "POL-EST",
      "POL-TENSUS",
      "POL-SAFEG",
      "POL-VULN",
      "POL-SVC",
      "POL-EDI",
    ],
    processCodes: [
      "PRC-ASBCASE",
      "PRC-ESTINSP",
      "PRC-GROUNDS",
      "PRC-PARTNER",
      "PRC-SAFEG",
      "PRC-BENEFIT",
    ],
  },
  {
    journeyKey: "customer",
    code: "C9",
    title: "Resolution",
    subtitle: "Complaints",
    icon: "\u{1F4E3}",
    type: "customer",
    accountableTeam: "TM-CRES",
    accountableRole: "Head of Customer Resolution",
    activities:
      "<ul><li><strong>Acknowledgement:</strong> confirming receipt of the complaint within Code timescales.</li><li><strong>Stage one investigation:</strong> impartial investigation by a case handler with a full written response.</li><li><strong>Remedy:</strong> offering fair redress through apology, action or compensation.</li><li><strong>Learning:</strong> recording root cause so the policy or process changes and the issue does not recur.</li></ul>",
    excellence:
      "<ul><li><strong>Empathy:</strong> we say sorry and mean it, without hiding behind policy language.</li><li><strong>Speed:</strong> issues are resolved well inside the deadline wherever possible.</li><li><strong>Fairness:</strong> the customer feels heard and validated, even when the answer is not the one they wanted.</li><li><strong>Closure:</strong> we do what the response letter promised without needing to be chased.</li><li><strong>Easy to complain:</strong> raising a complaint is straightforward and never counts against the customer.</li></ul>",
    tsmCodes: ["CH01", "CH02", "TP09"],
    policyCodes: ["POL-COMP", "POL-CUST", "POL-VULN", "POL-EDI", "POL-DP"],
    processCodes: [
      "PRC-COMPLAINT1",
      "PRC-COMPLAINT2",
      "PRC-REDRESS",
      "PRC-YSWD",
      "PRC-ACCESS",
    ],
  },
  {
    journeyKey: "customer",
    code: "C10",
    title: "Moving On",
    subtitle: "Termination",
    icon: "\u{1F69A}",
    type: "customer",
    accountableTeam: "TM-NEIGH",
    accountableRole: "Head of Housing & Neighbourhoods",
    activities:
      "<ul><li><strong>Notice processing:</strong> managing the notice period and closing the rent account correctly.</li><li><strong>Pre-termination visit:</strong> inspecting the home with the customer present to identify recharges or alterations.</li><li><strong>Key return:</strong> secure handover of the property back to the voids team.</li></ul>",
    excellence:
      "<ul><li><strong>Clarity:</strong> the customer knows exactly what to do to clear their account and avoid a recharge bill.</li><li><strong>Smooth exit:</strong> returning keys is simple and does not require taking a day off work.</li><li><strong>Zero debt:</strong> the customer leaves with a clear account and a positive reference.</li><li><strong>Void ready:</strong> the property is left in good condition so the next household can move in quickly.</li><li><strong>Dignity:</strong> where the move follows bereavement or crisis, the process flexes to the circumstances.</li></ul>",
    tsmCodes: ["TP08"],
    policyCodes: ["POL-TEN", "POL-RECH", "POL-INC", "POL-VULN", "POL-VOID"],
    processCodes: ["PRC-NTQ", "PRC-PTV", "PRC-RECHARGE", "PRC-KEYS", "PRC-ARREARS"],
  },

  // =======================================================================
  // SHARED OWNERSHIP JOURNEY
  // =======================================================================
  {
    journeyKey: "owner",
    code: "O1",
    title: "What Matters",
    subtitle: "Framework",
    icon: "\u{1F49B}",
    type: "framework",
    accountableTeam: "TM-HOMEOWN",
    accountableRole: "Head of Home Ownership",
    activities:
      "<ul><li><strong>Professionalism:</strong> delivering expert advice on a complex leasehold product.</li><li><strong>Consistency:</strong> aligning service standards with the rented sector wherever it is right to do so.</li></ul>",
    excellence:
      "<ul><li><strong>Trust:</strong> customers feel they are dealing with people who genuinely know the product.</li><li><strong>Clarity:</strong> complex financial and lease terms are explained in plain language before anyone commits.</li><li><strong>Consistency:</strong> a shared owner gets the same standard of service as a rented customer.</li></ul>",
    tsmCodes: ["TP06", "TP08"],
    policyCodes: ["POL-CUST", "POL-LEASE", "POL-EDI", "POL-ENG"],
    processCodes: ["PRC-ACCESS", "PRC-SCRUTINY"],
  },
  {
    journeyKey: "owner",
    code: "O2",
    title: "Helping Hand",
    subtitle: "Contact Centre Triage",
    icon: "\u{1F3A7}",
    type: "csc",
    accountableTeam: "TM-CSC",
    accountableRole: "Head of Customer Service",
    activities:
      "<ul><li><strong>First contact resolution:</strong> resolving the query in one contact where possible.</li><li><strong>Speed of answer:</strong> answering within the published target.</li><li><strong>Triage:</strong> routing leasehold and service charge queries to the specialists who can actually answer them.</li></ul>",
    excellence:
      "<ul><li><strong>Accessibility:</strong> easy to reach by phone, web and app.</li><li><strong>Knowledge:</strong> advisers understand the difference between a rented tenancy and a shared ownership lease.</li><li><strong>Ownership:</strong> queries about service charges get a substantive answer, not a referral loop.</li></ul>",
    tsmCodes: ["TP01"],
    policyCodes: ["POL-CUST", "POL-LEASE", "POL-SVC", "POL-DP"],
    processCodes: ["PRC-CONTACT", "PRC-ACCESS", "PRC-KIM"],
  },
  {
    journeyKey: "owner",
    code: "O3",
    title: "Voice of the Customer",
    subtitle: "Engagement",
    icon: "\u{1F4E2}",
    type: "voice",
    accountableTeam: "TM-CENG",
    accountableRole: "Head of Customer Engagement",
    activities:
      "<ul><li><strong>Scrutiny:</strong> panels specifically for shared owners, whose concerns differ from rented customers.</li><li><strong>Feedback:</strong> surveys on service charges and the sales experience.</li><li><strong>Consultation:</strong> statutory consultation on major works affecting leaseholders.</li></ul>",
    excellence:
      "<ul><li><strong>Influence:</strong> owners can see that their service charge money is well spent and can challenge it when they cannot.</li><li><strong>Transparency:</strong> budgets and actuals are published in a form people can actually interrogate.</li><li><strong>Heard:</strong> shared owners are not an afterthought in engagement structures built for tenants.</li></ul>",
    tsmCodes: ["TP06", "TP07"],
    policyCodes: ["POL-ENG", "POL-SVC", "POL-LEASE", "POL-CUST"],
    processCodes: ["PRC-SCRUTINY", "PRC-YSWD", "PRC-SVCCHARGE"],
  },
  {
    journeyKey: "owner",
    code: "O4",
    title: "Finding Home",
    subtitle: "Sales & Marketing",
    icon: "\u{1F3E0}",
    type: "owner",
    accountableTeam: "TM-SALES",
    accountableRole: "Head of Sales",
    activities:
      "<ul><li><strong>Listings:</strong> high quality photography and accurate descriptions on the major portals.</li><li><strong>Show homes:</strong> maintaining immaculate show homes for viewings.</li><li><strong>Initial assessment:</strong> affordability checks to confirm eligibility and set a sustainable share.</li></ul>",
    excellence:
      "<ul><li><strong>Desirability:</strong> the homes look aspirational and are built to a quality that matches the marketing.</li><li><strong>Clear advice:</strong> buyers understand exactly what they can afford, including rent on the retained equity.</li><li><strong>No surprises:</strong> service charges, lease length and staircasing terms are on the table from the first conversation.</li><li><strong>Right share:</strong> the initial share is set at a level the household can sustain, not the maximum they can scrape to.</li></ul>",
    tsmCodes: [],
    policyCodes: ["POL-SO", "POL-LEASE", "POL-SVC", "POL-EDI", "POL-DP"],
    processCodes: ["PRC-SALESMKT", "PRC-SOELIG", "PRC-VIEW"],
  },
  {
    journeyKey: "owner",
    code: "O5",
    title: "Buying",
    subtitle: "Conveyancing",
    icon: "\u{270D}\u{FE0F}",
    type: "owner",
    accountableTeam: "TM-SALES",
    accountableRole: "Head of Sales",
    activities:
      "<ul><li><strong>Memorandum of sale:</strong> taking the reservation and instructing solicitors promptly.</li><li><strong>Progression:</strong> chasing lenders and solicitors to hit the exchange target.</li><li><strong>Mortgage offer:</strong> verifying the formal offer matches the affordability assessment and the lease.</li></ul>",
    excellence:
      "<ul><li><strong>Speed:</strong> exchange of contracts happens inside the target window.</li><li><strong>Communication:</strong> weekly updates mean the buyer is never left in the dark.</li><li><strong>One version of the truth:</strong> the lease pack is complete and accurate first time, so solicitors are not sending repeat enquiries.</li><li><strong>Honest timelines:</strong> where a build slips, the buyer hears it from us before they hear it from anyone else.</li></ul>",
    tsmCodes: [],
    policyCodes: ["POL-SO", "POL-LEASE", "POL-DP", "POL-KIM"],
    processCodes: ["PRC-RESERVE", "PRC-CONVEY", "PRC-MORTGAGE", "PRC-KIM"],
  },
  {
    journeyKey: "owner",
    code: "O6",
    title: "Moving In",
    subtitle: "Handover",
    icon: "\u{1F4E6}",
    type: "owner",
    accountableTeam: "TM-SALES",
    accountableRole: "Head of Sales",
    activities:
      "<ul><li><strong>Home demonstration:</strong> showing the buyer how the heating, ventilation and locks work.</li><li><strong>Key handover:</strong> formal completion and release of keys.</li><li><strong>Defects guide:</strong> explaining the difference between a builder defect and owner maintenance.</li></ul>",
    excellence:
      "<ul><li><strong>Celebration:</strong> completion feels like a milestone, not just a transaction.</li><li><strong>Zero snags:</strong> the home is genuinely finished on move-in day.</li><li><strong>Clear routes:</strong> the owner knows exactly who to call for a defect, a communal issue and an emergency.</li><li><strong>Documents ready:</strong> warranties, certificates and the home user guide are handed over on the day.</li></ul>",
    tsmCodes: ["TP01", "TP05"],
    policyCodes: ["POL-LEASE", "POL-SO", "POL-BSAFE", "POL-DHS"],
    processCodes: ["PRC-HOMEDEMO", "PRC-DEFECTS", "PRC-COMPHAND", "PRC-KEYS"],
  },
  {
    journeyKey: "owner",
    code: "O7",
    title: "Living",
    subtitle: "Charges & Repairs Allowance",
    icon: "\u{1F4B0}",
    type: "owner",
    accountableTeam: "TM-HOMEOWN",
    accountableRole: "Head of Home Ownership",
    activities:
      "<ul><li><strong>Reporting defects:</strong> managing builder defects through the liability period.</li><li><strong>Repairs allowance:</strong> administering the annual allowance for essential repairs under the newer lease model.</li><li><strong>Service charges:</strong> collecting rent and service charges accurately and reconciling to actual spend.</li></ul>",
    excellence:
      "<ul><li><strong>Value for money:</strong> service charges feel fair, and the statement shows what the money bought.</li><li><strong>Prompt support:</strong> allowance claims are processed quickly and without unnecessary evidence demands.</li><li><strong>Predictable:</strong> owners get early warning of major works and their likely cost.</li><li><strong>Fair split:</strong> the boundary between owner responsibility and landlord responsibility is applied consistently.</li></ul>",
    tsmCodes: ["TP04", "TP10"],
    policyCodes: [
      "POL-LEASE",
      "POL-SVC",
      "POL-INC",
      "POL-EST",
      "POL-REP",
      "POL-COMP",
    ],
    processCodes: [
      "PRC-CASHBACK",
      "PRC-SVCCHARGE",
      "PRC-DEFECTS",
      "PRC-ESTINSP",
      "PRC-GROUNDS",
      "PRC-ARREARS",
    ],
  },
  {
    journeyKey: "owner",
    code: "O8",
    title: "Staircasing",
    subtitle: "Buying More",
    icon: "\u{1F4C8}",
    type: "owner",
    accountableTeam: "TM-HOMEOWN",
    accountableRole: "Head of Home Ownership",
    activities:
      "<ul><li><strong>Valuation:</strong> instructing an independent RICS valuation to set the price of additional shares.</li><li><strong>Equity sale:</strong> managing the legal process for buying further shares, including gradual staircasing.</li><li><strong>Lease amendment:</strong> updating the lease and recalculating rent on the retained equity.</li></ul>",
    excellence:
      "<ul><li><strong>Wealth building:</strong> we actively help customers move towards owning their home outright.</li><li><strong>Seamless:</strong> the process is as simple as it can be, with fees stated up front.</li><li><strong>Well timed:</strong> valuations are instructed quickly so they do not expire mid-transaction.</li><li><strong>Proactive:</strong> owners are told when staircasing might make financial sense for them.</li></ul>",
    tsmCodes: [],
    policyCodes: ["POL-STAIR", "POL-LEASE", "POL-VFM", "POL-DP"],
    processCodes: ["PRC-RICS", "PRC-STAIR", "PRC-LEASEAMEND", "PRC-CONVEY"],
  },
  {
    journeyKey: "owner",
    code: "O9",
    title: "Resale",
    subtitle: "Moving On",
    icon: "\u{1F501}",
    type: "owner",
    accountableTeam: "TM-HOMEOWN",
    accountableRole: "Head of Home Ownership",
    activities:
      "<ul><li><strong>Nomination period:</strong> marketing the home to the waiting list for the period set out in the lease.</li><li><strong>Valuation:</strong> setting the market price through independent valuation.</li><li><strong>Open market:</strong> releasing to estate agents where no nominee is found.</li></ul>",
    excellence:
      "<ul><li><strong>Quick sale:</strong> the process maximises the outgoing owner's equity rather than eroding it through delay.</li><li><strong>Transparency:</strong> fees and the process are clear from the very start.</li><li><strong>No dead time:</strong> the nomination period is used actively, not simply run down before going to market.</li><li><strong>Supported:</strong> owners in financial difficulty are offered options before a forced sale becomes the only route.</li></ul>",
    tsmCodes: [],
    policyCodes: ["POL-STAIR", "POL-LEASE", "POL-SO", "POL-TENSUS"],
    processCodes: ["PRC-NOMINATE", "PRC-RICS", "PRC-OPENMKT", "PRC-CONVEY"],
  },
];

/**
 * Indicative stage timescales, in days. These turn a journey from a sequence
 * into a timeline: how long should this stage take when it goes well?
 *
 * Values are ILLUSTRATIVE first-pass figures drawn from common UK social
 * housing service standards (e.g. 10 working days for a stage 1 complaint
 * response under the Complaint Handling Code, ~20 days void turnaround).
 * Stages that are ongoing rather than bounded (living in the home, asset
 * management) carry no target and are shown as "ongoing".
 */
export const STAGE_TARGET_DAYS: Record<string, number> = {
  P1: 90, // land acquisition to approval
  P2: 540, // construction programme
  P3: 365, // defects liability period
  P4: 20, // void turnaround, key to key
  P6: 180, // disposal / retrofit decision to completion
  C2: 5, // contact resolved or triaged
  C4: 15, // advert to sign-up
  C5: 42, // settling-in visits complete
  C7: 28, // routine repair completed
  C8: 56, // ASB case reviewed / resolved
  C9: 10, // stage 1 complaint response (working days)
  C10: 28, // notice period to tenancy end
  O2: 5, // contact resolved or triaged
  O4: 90, // marketing to reservation
  O5: 56, // reservation to completion
  O6: 14, // completion to settled move-in
  O8: 90, // staircasing application to completion
  O9: 56, // resale nomination period
};
