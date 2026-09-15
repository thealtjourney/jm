import assert from "node:assert/strict";
import test from "node:test";
import { STAGE_SEED } from "../lib/data/stages";
import { groupJourneyStages, journeyMeasures, stagePresentation } from "../lib/journey-explorer";
import type { StageDetail } from "../lib/queries";

function stage(code: string, measures: string[] = []): StageDetail {
  return {
    code, title: `Authored title ${code}`,
    tsms: measures.map(code => ({ code, name: `Measure ${code}`, reportable: false })),
  } as StageDetail;
}

test("all 25 stages remain available once across the three regrouped journeys", () => {
  for (const key of ["property", "customer", "owner"]) {
    const source = STAGE_SEED.filter(s => s.journeyKey === key).map(s => stage(s.code));
    const result = groupJourneyStages({ key, stages: source }).flatMap(group => group.stages);
    assert.equal(result.length, source.length);
    assert.deepEqual(new Set(result.map(s => s.code)), new Set(source.map(s => s.code)));
    assert.ok(result.every(s => source.includes(s)), "Preserve the same authored stage records");
  }
});

test("the resident route runs from finding a home to moving on, with recurring services in the living phase", () => {
  const stages = STAGE_SEED.filter(s => s.journeyKey === "customer").map(s => stage(s.code));
  const groups = groupJourneyStages({ key: "customer", stages });
  assert.deepEqual(groups.map(g => g.key), ["finding", "moving-in", "living", "moving-on"]);
  assert.equal(groups[0].stages[0].code, "C4");
  assert.equal(groups.at(-1)?.stages[0].code, "C10");
  assert.ok(groups.find(g => g.key === "living")?.stages.some(s => s.code === "C7"));
  assert.ok(groups.find(g => g.key === "living")?.stages.some(s => s.code === "C9"));
});

test("the property and ownership journeys have explicit beginnings and endings", () => {
  for (const [key, first, last] of [["property", "P1", "P6"], ["owner", "O4", "O9"]]) {
    const stages = STAGE_SEED.filter(s => s.journeyKey === key).map(s => stage(s.code));
    const groups = groupJourneyStages({ key, stages });
    assert.equal(groups[0].stages[0].code, first);
    assert.equal(groups.at(-1)?.stages.at(-1)?.code, last);
  }
});

test("a role subset cannot gain unrelated stages when grouped", () => {
  const groups = groupJourneyStages({ key: "customer", stages: [stage("C7"), stage("C2")] });
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].stages.map(s => s.code), ["C7", "C2"]);
  assert.deepEqual(groupJourneyStages({ key: "customer", stages: [] }), []);
});

test("new stages and unknown journeys remain navigable", () => {
  const added = stage("C11");
  const groups = groupJourneyStages({ key: "customer", stages: [stage("C4"), added] });
  assert.equal(groups.at(-1)?.stages[0], added);
  assert.equal(stagePresentation(added).label, added.title);
  assert.equal(groupJourneyStages({ key: "new-journey", stages: [added] })[0].stages[0], added);
});

test("TSM trace counts distinct stored links including indicative ones", () => {
  const measures = journeyMeasures({ stages: [stage("O1", ["TP01", "TP06", "TP01"]), stage("O2", ["TP01"]), stage("O4")] });
  assert.deepEqual(measures.map(m => [m.code, m.stageCodes]), [["TP01", ["O1", "O2"]], ["TP06", ["O1"]]]);
  assert.deepEqual(journeyMeasures({ stages: [stage("P1")] }), []);
});

test("a role-specific TSM trace counts only the stages in that role", () => {
  assert.deepEqual(journeyMeasures({ stages: [stage("C7", ["TP02"])] })[0].stageCodes, ["C7"]);
});
