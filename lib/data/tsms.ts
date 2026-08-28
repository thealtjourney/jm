/**
 * The 22 Tenant Satisfaction Measures set out in the Regulator of Social
 * Housing's TSM Standard. TP* are perception measures collected by survey;
 * the rest are management information reported by the landlord.
 *
 * Note: TSMs are reported for Low Cost Rental Accommodation (LCRA). Shared
 * ownership (LCHO) households are outside the TSM perception survey, which is
 * why shared ownership stages flag their measures as indicative only.
 */

export type TsmSeed = {
  code: string;
  name: string;
  category: string;
  measureType: "perception" | "management";
  definition: string;
  calculation: string;
  /** False where a lower number is the better outcome. */
  higherIsBetter: boolean;
  unit: string;
};

const PERCEPTION_CALC =
  "Number of respondents who answered 'very satisfied' or 'fairly satisfied', divided by the number of respondents who answered the question, multiplied by 100.";

export const TSM_SEED: TsmSeed[] = [
  {
    code: "TP01",
    name: "Overall satisfaction",
    category: "Overall",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied with the overall service from their landlord.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP02",
    name: "Satisfaction with repairs",
    category: "Keeping properties in good repair",
    measureType: "perception",
    definition:
      "Proportion of respondents who have received a repair in the last 12 months who report that they are satisfied with the overall repairs service.",
    higherIsBetter: true,
    unit: "%",
    calculation:
      "Number of respondents who answered 'very satisfied' or 'fairly satisfied', divided by the number of respondents who answered the question (excluding those who have not had a repair in the last 12 months), multiplied by 100.",
  },
  {
    code: "TP03",
    name: "Satisfaction with time taken to complete most recent repair",
    category: "Keeping properties in good repair",
    measureType: "perception",
    definition:
      "Proportion of respondents who have received a repair in the last 12 months who report that they are satisfied with the time taken to complete their most recent repair.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP04",
    name: "Satisfaction that the home is well maintained",
    category: "Keeping properties in good repair",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied that their home is well maintained.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP05",
    name: "Satisfaction that the home is safe",
    category: "Maintaining building safety",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied that their home is safe.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP06",
    name: "Satisfaction that the landlord listens to tenant views and acts upon them",
    category: "Respectful and helpful engagement",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied that their landlord listens to tenant views and acts upon them.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP07",
    name: "Satisfaction that the landlord keeps tenants informed about things that matter to them",
    category: "Respectful and helpful engagement",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied that their landlord keeps them informed about things that matter to them.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP08",
    name: "Agreement that the landlord treats tenants fairly and with respect",
    category: "Respectful and helpful engagement",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they agree their landlord treats them fairly and with respect.",
    higherIsBetter: true,
    unit: "%",
    calculation:
      "Number of respondents who answered 'strongly agree' or 'agree', divided by the number of respondents who answered the question, multiplied by 100.",
  },
  {
    code: "TP09",
    name: "Satisfaction with the landlord's approach to handling complaints",
    category: "Effective handling of complaints",
    measureType: "perception",
    definition:
      "Proportion of respondents who report making a complaint in the last 12 months who are satisfied with their landlord's approach to complaints handling.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP10",
    name: "Satisfaction that the landlord keeps communal areas clean and well maintained",
    category: "Responsible neighbourhood management",
    measureType: "perception",
    definition:
      "Proportion of respondents with communal areas who report that they are satisfied their landlord keeps these clean and well maintained.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP11",
    name: "Satisfaction that the landlord makes a positive contribution to neighbourhoods",
    category: "Responsible neighbourhood management",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied their landlord makes a positive contribution to the neighbourhood.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "TP12",
    name: "Satisfaction with the landlord's approach to handling anti-social behaviour",
    category: "Responsible neighbourhood management",
    measureType: "perception",
    definition:
      "Proportion of respondents who report that they are satisfied with their landlord's approach to handling anti-social behaviour.",
    higherIsBetter: true,
    unit: "%",
    calculation: PERCEPTION_CALC,
  },
  {
    code: "CH01",
    name: "Complaints relative to the size of the landlord",
    category: "Effective handling of complaints",
    measureType: "management",
    definition:
      "Number of stage one and stage two complaints received per 1,000 homes.",
    calculation:
      "Number of complaints received at each stage in the reporting year, divided by the number of homes, multiplied by 1,000. Reported separately for stage one and stage two.",
    higherIsBetter: false,
    unit: "per 1,000 homes",
  },
  {
    code: "CH02",
    name: "Complaints responded to within Complaint Handling Code timescales",
    category: "Effective handling of complaints",
    measureType: "management",
    definition:
      "Proportion of stage one and stage two complaints responded to within the Housing Ombudsman's Complaint Handling Code timescales.",
    calculation:
      "Number of complaints responded to within timescale, divided by the number of complaints responded to, multiplied by 100. Reported separately for stage one and stage two.",
    higherIsBetter: true,
    unit: "%",
  },
  {
    code: "NM01",
    name: "Anti-social behaviour cases relative to the size of the landlord",
    category: "Responsible neighbourhood management",
    measureType: "management",
    definition:
      "Number of anti-social behaviour cases opened per 1,000 homes, reported in total and for cases that involve hate incidents.",
    calculation:
      "Number of ASB cases opened in the reporting year, divided by the number of homes, multiplied by 1,000.",
    higherIsBetter: false,
    unit: "per 1,000 homes",
  },
  {
    code: "RP01",
    name: "Homes that do not meet the Decent Homes Standard",
    category: "Keeping properties in good repair",
    measureType: "management",
    definition:
      "Proportion of homes that do not meet the Decent Homes Standard.",
    calculation:
      "Number of homes failing the Decent Homes Standard, divided by the total number of homes, multiplied by 100.",
    higherIsBetter: false,
    unit: "%",
  },
  {
    code: "RP02",
    name: "Repairs completed within target timescale",
    category: "Keeping properties in good repair",
    measureType: "management",
    definition:
      "Proportion of non-emergency and emergency responsive repairs completed within the landlord's target timescale.",
    calculation:
      "Number of repairs completed within target, divided by the number of repairs completed, multiplied by 100. Reported separately for emergency and non-emergency repairs.",
    higherIsBetter: true,
    unit: "%",
  },
  {
    code: "BS01",
    name: "Gas safety checks",
    category: "Maintaining building safety",
    measureType: "management",
    definition:
      "Proportion of homes for which all required gas safety checks have been carried out.",
    calculation:
      "Number of homes with an in-date gas safety record, divided by the number of homes requiring a check, multiplied by 100.",
    higherIsBetter: true,
    unit: "%",
  },
  {
    code: "BS02",
    name: "Fire safety checks",
    category: "Maintaining building safety",
    measureType: "management",
    definition:
      "Proportion of homes for which all required fire risk assessments have been carried out.",
    calculation:
      "Number of buildings with an in-date fire risk assessment, divided by the number of buildings requiring one, multiplied by 100.",
    higherIsBetter: true,
    unit: "%",
  },
  {
    code: "BS03",
    name: "Asbestos safety checks",
    category: "Maintaining building safety",
    measureType: "management",
    definition:
      "Proportion of homes for which all required asbestos management surveys or re-inspections have been carried out.",
    calculation:
      "Number of buildings with an in-date asbestos survey or re-inspection, divided by the number requiring one, multiplied by 100.",
    higherIsBetter: true,
    unit: "%",
  },
  {
    code: "BS04",
    name: "Water safety checks",
    category: "Maintaining building safety",
    measureType: "management",
    definition:
      "Proportion of homes for which all required legionella risk assessments have been carried out.",
    calculation:
      "Number of buildings with an in-date legionella risk assessment, divided by the number requiring one, multiplied by 100.",
    higherIsBetter: true,
    unit: "%",
  },
  {
    code: "BS05",
    name: "Lift safety checks",
    category: "Maintaining building safety",
    measureType: "management",
    definition:
      "Proportion of homes for which all required communal passenger lift safety checks have been carried out.",
    calculation:
      "Number of buildings with an in-date lift safety check, divided by the number requiring one, multiplied by 100.",
    higherIsBetter: true,
    unit: "%",
  },
];
