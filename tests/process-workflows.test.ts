import assert from "node:assert/strict";
import test from "node:test";
import { PROCESS_SEED } from "../lib/data/processes";
import { REPAIRS_WORKFLOW, repairsStepForProcess, workflowStep } from "../lib/process-workflows";

test("the repair workflow has six main steps and every decision points to a reachable step", () => {
  const workflow = REPAIRS_WORKFLOW;
  const ids = new Set(workflow.steps.map(step => step.id));
  assert.equal(ids.size, workflow.steps.length);
  assert.equal(workflow.mainSteps.length, 6);
  assert.ok(workflow.mainSteps.every(id => ids.has(id)));
  const reached = new Set<string>();
  function visit(id: string) {
    if (reached.has(id)) return;
    reached.add(id);
    const step = workflow.steps.find(step => step.id === id);
    assert.ok(step, `Broken workflow destination: ${id}`);
    for (const transition of step.transitions) visit(transition.to);
  }
  visit(workflow.mainSteps[0]);
  assert.deepEqual(reached, ids);
});

test("return visits and unresolved repairs reconnect to the main process", () => {
  assert.equal(workflowStep(REPAIRS_WORKFLOW, "return-visit").transitions[0].to, "book");
  assert.equal(workflowStep(REPAIRS_WORKFLOW, "no-access").transitions[0].to, "book");
  assert.equal(workflowStep(REPAIRS_WORKFLOW, "learn").transitions[0].to, "assess");
  assert.deepEqual(workflowStep(REPAIRS_WORKFLOW, "make-safe").transitions.map(t => t.to), ["book", "confirm"]);
});

test("proposed responsibility references real library processes and supports deep links", () => {
  const codes = new Set(PROCESS_SEED.map(process => process.code));
  for (const step of REPAIRS_WORKFLOW.steps) assert.ok(codes.has(step.ownerProcess));
  assert.equal(repairsStepForProcess("PRC-REPSCHED")?.id, "book");
  assert.equal(repairsStepForProcess("unrelated"), undefined);
  assert.equal(workflowStep(REPAIRS_WORKFLOW, "missing").id, "report");
  assert.equal(workflowStep(REPAIRS_WORKFLOW, "return-visit").id, "return-visit");
});
