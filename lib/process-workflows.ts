/** Draft service-design content. These steps are not approved policy or case records. */
export type WorkflowStep = {
  id: string;
  title: string;
  outcome: string;
  excellence: string[];
  ownerProcess: string;
  handover: string;
  decision: string;
  transitions: { label: string; to: string }[];
  returnsFrom?: string;
};

export type ProcessWorkflow = {
  id: string;
  title: string;
  stageCode: string;
  mainSteps: string[];
  steps: WorkflowStep[];
};

export const REPAIRS_WORKFLOW: ProcessWorkflow = {
  id: "repairs",
  title: "Repairs, start to finish",
  stageCode: "C7",
  mainSteps: ["report", "assess", "book", "visit", "confirm", "learn"],
  steps: [
    {
      id: "report", title: "Report a repair", ownerProcess: "PRC-REPTRIAGE",
      outcome: "I can explain the problem once, in a way that works for me.",
      excellence: ["Offer accessible contact options and record communication or access needs.", "Acknowledge the report and give the resident a reference and a clear next step.", "Capture what is wrong, where it is and how it affects the household."],
      handover: "Pass the repair description, contact preferences, access needs and any immediate concerns to the person assessing the repair.",
      decision: "The report is captured", transitions: [{ label: "Assess the repair", to: "assess" }],
    },
    {
      id: "assess", title: "Assess & prioritise", ownerProcess: "PRC-REPTRIAGE",
      outcome: "The urgency and impact on my household are understood.",
      excellence: ["Clarify the fault, repair responsibility and household circumstances.", "Use the organisation's approved priority and safety procedures; explain the response to the resident.", "Arrange a specialist assessment when the cause or scope is unclear."],
      handover: "Give planning or the urgent response team the diagnosis, priority, required trade, known hazards and agreed resident update.",
      decision: "Which response is needed?", transitions: [{ label: "Routine work → book a visit", to: "book" }, { label: "Urgent risk → make safe", to: "make-safe" }],
    },
    {
      id: "book", title: "Book the visit", ownerProcess: "PRC-REPSCHED",
      outcome: "I know when someone is coming and what to expect.",
      excellence: ["Agree an appointment that takes the resident's needs into account.", "Allocate the right trade, time, equipment and parts for the known work.", "Confirm the appointment and explain how to rearrange it or report a change."],
      handover: "Send the operative the work order, diagnosis, parts, access arrangements and relevant safety information before the visit.",
      decision: "The appointment is agreed", transitions: [{ label: "Attend the visit", to: "visit" }],
    },
    {
      id: "visit", title: "Carry out the work", ownerProcess: "PRC-REPDEL",
      outcome: "My home is treated with respect and I understand the work being done.",
      excellence: ["Keep the resident updated about arrival and explain the planned work.", "Protect the home, work safely and complete the repair in one visit where possible.", "Record what was done and explain anything still outstanding before leaving."],
      handover: "Record the work, checks and resident explanation. Where work remains, give planning a clear scope, parts requirement and follow-up owner.",
      decision: "What happened at the visit?", transitions: [{ label: "Work finished → check the repair", to: "confirm" }, { label: "More work or parts → return visit", to: "return-visit" }, { label: "Could not gain access → reconnect", to: "no-access" }],
    },
    {
      id: "confirm", title: "Confirm the repair", ownerProcess: "PRC-REPDEL",
      outcome: "I know what was fixed and whether anything remains outstanding.",
      excellence: ["Check the repair works and record the completion evidence.", "Explain the result and any aftercare in language the resident understands.", "Keep outstanding work visible with a named owner and an agreed next update."],
      handover: "Pass an accurate completion record and any outstanding actions to the team following up with the resident.",
      decision: "Has the repair been completed?", transitions: [{ label: "Yes → check the resident outcome", to: "learn" }, { label: "Work remains → arrange a return", to: "return-visit" }],
    },
    {
      id: "learn", title: "Check the outcome", ownerProcess: "PRC-REPSURVEY",
      outcome: "I can say whether the problem is resolved, and any remaining concern is acted on.",
      excellence: ["Give the resident a simple way to comment on the repair and their experience.", "Route unresolved concerns to an accountable team and explain what happens next.", "Use feedback and repeat repairs to improve diagnosis, communication and delivery."],
      handover: "Share learning with the repairs team. If the problem remains, return the history and resident's concerns for reassessment.",
      decision: "If the problem remains unresolved", transitions: [{ label: "Reassess the repair", to: "assess" }],
    },
    {
      id: "make-safe", title: "Urgent response / make safe", ownerProcess: "PRC-REPDEL", returnsFrom: "assess",
      outcome: "The immediate risk is addressed and I know what will happen next.",
      excellence: ["Follow the organisation's approved emergency and specialist escalation procedures.", "Explain any immediate action and support the resident needs.", "Record whether making safe resolved the repair or whether further work is required."],
      handover: "Give the resident and planning team the safety outcome, remaining work, priority and next point of contact.",
      decision: "What is needed after the urgent response?", transitions: [{ label: "Further work → book a visit", to: "book" }, { label: "Repair finished → confirm it", to: "confirm" }],
    },
    {
      id: "return-visit", title: "Arrange a return visit", ownerProcess: "PRC-REPSCHED", returnsFrom: "visit",
      outcome: "I know why another visit is needed and who is arranging it.",
      excellence: ["Explain why the first visit could not finish the repair.", "Confirm the scope, trade and parts before agreeing the next appointment.", "Keep one clear record and owner so the resident does not have to restart the request."],
      handover: "Return the updated scope, parts readiness and resident commitments to appointment planning.",
      decision: "The follow-up work is defined", transitions: [{ label: "Agree the next appointment", to: "book" }],
    },
    {
      id: "no-access", title: "Reconnect with the resident", ownerProcess: "PRC-REPSCHED", returnsFrom: "visit",
      outcome: "I can explain what prevented access and agree a workable next step.",
      excellence: ["Record the attempted visit and contact the resident through their preferred channel.", "Check for communication, access or support needs before rearranging.", "Escalate any safety concern through the approved procedure."],
      handover: "Give planning the agreed access arrangements and any support required for the next visit.",
      decision: "Access arrangements are agreed", transitions: [{ label: "Rebook the visit", to: "book" }],
    },
  ],
};

export function workflowStep(workflow: ProcessWorkflow, id?: string | null): WorkflowStep {
  return workflow.steps.find(step => step.id === id) ?? workflow.steps.find(step => step.id === workflow.mainSteps[0])!;
}

export function repairsStepForProcess(code: string) {
  return REPAIRS_WORKFLOW.steps.find(step => step.ownerProcess === code);
}
