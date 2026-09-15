"use client";

import Link from "next/link";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitBranch, HeartHandshake, Network, Route, Sparkles, Users } from "lucide-react";
import type { ProcessWorkflow } from "@/lib/process-workflows";
import { workflowStep } from "@/lib/process-workflows";
import type { StageDetail, TeamRef } from "@/lib/queries";
import { journeyStyle } from "@/lib/journey-presentation";
import ConnectedRoute from "./ConnectedRoute";

type ProcessRef = { code: string; name: string; owningTeam: TeamRef | null };

export default function ProcessWalkthrough({ workflow, stage, processes }: {
  workflow: ProcessWorkflow;
  stage: StageDetail | null;
  processes: ProcessRef[];
}) {
  const params = useSearchParams();
  const selected = workflowStep(workflow, params.get("step"));
  const mainIndex = workflow.mainSteps.indexOf(selected.id);
  const mainSteps = workflow.mainSteps.map(id => workflowStep(workflow, id));
  const process = processes.find(p => p.code === selected.ownerProcess);
  const previous = mainIndex > 0 ? workflow.mainSteps[mainIndex - 1] : selected.returnsFrom;
  const next = mainIndex >= 0 ? workflow.mainSteps[mainIndex + 1] : selected.transitions[0]?.to;
  const detail = useRef<HTMLElement>(null);

  function choose(id: string, focusDetail = false) {
    const url = new URL(window.location.href);
    url.searchParams.set("step", id);
    window.history.replaceState(null, "", url);
    if (focusDetail) requestAnimationFrame(showDetail);
  }
  function showDetail() {
    detail.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    detail.current?.focus({ preventScroll: true });
  }

  return <main className="journey-workspace workflow-workspace" style={journeyStyle("customer")}>
    <nav className="workflow-breadcrumb" aria-label="Process navigation"><Link href="/?journey=customer&stage=C7"><ArrowLeft size={15} /> Resident journey · Repairs</Link><Link href="/processes">All processes <ArrowUpRight size={15} /></Link></nav>
    <header className="explorer-heading"><div><p className="eyebrow">THE SERVICE FROM FIRST CONTACT TO RESOLUTION</p><h1>{workflow.title}</h1><p className="heading-description">Follow each step, see the handovers and explore what happens when the route changes.</p></div><span className="workflow-draft">Draft for review</span></header>
    <p className="workflow-review-note">Proposed steps and responsibilities for discussion with teams and residents. Confirm these against your approved repair procedures.</p>
    <section className="explorer" aria-label="Repair process walkthrough">
      <div className="journey-canvas workflow-canvas">
        <div className="route-bookends"><span>FIRST CONTACT</span><span>RESOLVED & LEARNED FROM</span></div>
        <ConnectedRoute stops={mainSteps.map(step => ({ id: step.id, label: step.title }))} selected={selected.id} onSelect={choose} label="Repair process, six main steps" controls="workflow-step-detail" />
        <div className="workflow-branches"><span><GitBranch size={16} /> When the route changes</span>{workflow.steps.filter(step => step.returnsFrom).map(step => <button type="button" key={step.id} aria-pressed={selected.id === step.id} onClick={() => choose(step.id)}>{step.title}</button>)}<button type="button" onClick={() => choose("learn")}>Unresolved after completion</button></div>
        <button className="mobile-detail-jump" type="button" onClick={showDetail}>View {selected.title.toLowerCase()} details <ArrowRight size={16} /></button>
      </div>
      <section className="stage-inspector" id="workflow-step-detail" ref={detail} tabIndex={-1} aria-labelledby="workflow-step-title">
        <div className="inspector-navigation"><p className="eyebrow">{mainIndex >= 0 ? `STEP ${mainIndex + 1} OF ${mainSteps.length}` : "ALTERNATIVE ROUTE"}</p><div><button className="button-secondary" type="button" disabled={!previous} onClick={() => previous && choose(previous)}><ArrowLeft size={15} /> Previous</button><button className="button-secondary" type="button" disabled={!next} onClick={() => next && choose(next)}>Next <ArrowRight size={15} /></button></div></div>
        <div className="inspector-content"><h2 id="workflow-step-title" aria-live="polite">{selected.title}</h2>
          <div className="resident-outcome"><p><HeartHandshake size={16} />Resident outcome <span>Our ambition</span></p><h3>{selected.outcome}</h3></div>
          <div className="stage-detail-columns"><div>
            <div className="inspector-section-heading"><Sparkles size={18} /><h3>What excellence looks like</h3></div>
            <ul className="workflow-standards">{selected.excellence.map(standard => <li key={standard}>{standard}</li>)}</ul>
            <div className="workflow-handover"><h3><Users size={17} /> Responsibility & handover</h3><p><strong>{process?.owningTeam?.name ?? "Owner to be agreed"}</strong> · proposed lead at this step</p><p>{selected.handover}</p>{process && <Link href={`/processes/${process.code}`}>{process.name} <ArrowUpRight size={14} /></Link>}</div>
          </div><div>
            <div className="workflow-decision"><h3><GitBranch size={18} />{selected.decision}</h3>{selected.id === "learn" && <p>If the repair is resolved, close the loop with the resident and record the learning. Otherwise, follow the route below.</p>}<div>{selected.transitions.map(transition => <button className="button-secondary" type="button" key={transition.to} onClick={() => choose(transition.to, true)}>{transition.label}<ArrowRight size={16} /></button>)}</div></div>
            <div className="inspector-section-heading"><Network size={18} /><h3>Repairs-stage TSM connections</h3></div>
            <p className="section-hint">Existing stage mappings. Connections to individual steps are still to be agreed.</p>
            <div className="workflow-measures">{stage?.tsms.map(tsm => <Link key={tsm.code} href={`/tsm/${tsm.code}`}><strong>{tsm.code}</strong><span>{tsm.name}{!tsm.reportable && " · indicative"}</span><ArrowUpRight size={14} /></Link>)}</div>
            {!stage?.tsms.length && <p className="section-hint">No repairs-stage mappings are available yet.</p>}
          </div></div>
        </div>
      </section>
    </section>
    <div className="workflow-bottom-links"><Link href="/?journey=customer&stage=C7"><Route size={17} /> Back to the whole resident journey</Link><Link href="/processes">Browse all operational processes <ArrowRight size={17} /></Link></div>
  </main>;
}
