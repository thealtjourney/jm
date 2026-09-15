"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Award, Building2, Check, ChevronLeft, ChevronRight, Clock3, FileText, HeartHandshake, House, Info, KeyRound, LayoutList, MessageSquareText, Network, Repeat2, Route, Sparkles, Users, Workflow, X } from "lucide-react";
import type { JourneyDetail, RoleLens, StageDetail as Stage } from "@/lib/queries";
import { firstStandard, journeyStyle, journeyTheme } from "@/lib/journey-presentation";
import { groupJourneyStages, journeyMeasures, stagePresentation } from "@/lib/journey-explorer";
import { setRoleCookie } from "@/lib/role-cookie";
import StageDetail from "./StageDetail";
import AdminBar from "./AdminBar";

type Library = {
  policies: { code: string; name: string; category: string }[];
  processes: { code: string; name: string; team: string }[];
  tsms: { code: string; name: string; category: string }[];
};
const journeyIcons = { property: Building2, customer: HeartHandshake, owner: KeyRound };

export default function JourneyMap({ journeys, library, initialAdmin, roles, activeRole, initialJourney, initialStage }: {
  journeys: JourneyDetail[]; library: Library; initialAdmin: boolean; roles: RoleLens[]; activeRole: RoleLens; initialJourney?: string; initialStage?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [admin, setAdmin] = useState(initialAdmin);
  const [showAll, setShowAll] = useState(Boolean(initialStage || initialJourney));
  const [view, setView] = useState<"map" | "list">("map");
  const [detail, setDetail] = useState<RoleLens["leadAnswer"] | null>(null);
  const [selectedMeasure, setSelectedMeasure] = useState("");
  const detailPanel = useRef<HTMLElement>(null);
  const focused = activeRole.focusStageCodes.length > 0 && !showAll;
  const visible = useMemo(() => journeys.map(j => ({ ...j, stages: focused ? j.stages.filter(s => activeRole.focusStageCodes.includes(s.code)) : j.stages })).filter(j => j.stages.length), [journeys, focused, activeRole]);
  const stageCode = params.get("stage") ?? "";
  const journeyKey = params.get("journey") ?? journeys.find(j => j.stages.some(s => s.code === stageCode))?.key ?? "customer";
  const journey = visible.find(j => j.key === journeyKey) ?? visible[0];
  const groups = useMemo(() => journey ? groupJourneyStages(journey) : [], [journey]);
  const orderedStages = groups.flatMap(group => group.stages);
  const stage = orderedStages.find(s => s.code === stageCode) ?? orderedStages[0];
  const stageIndex = orderedStages.findIndex(s => s.code === stage?.code);
  const measures = useMemo(() => journey ? journeyMeasures(journey) : [], [journey]);
  const measure = measures.find(tsm => tsm.code === selectedMeasure);
  const theme = journeyTheme(journey?.key ?? journeyKey);
  const totalStages = journeys.reduce((n, j) => n + j.stages.length, 0);
  const allTsms = new Set(journeys.flatMap(j => j.stages.flatMap(s => s.tsms.map(t => t.code))));
  const presentation = stage ? stagePresentation(stage) : null;

  function choose(j: JourneyDetail, s: Stage | undefined = groupJourneyStages(j).flatMap(group => group.stages)[0]) {
    const url = new URL(window.location.href);
    url.searchParams.set("journey", j.key);
    if (s) url.searchParams.set("stage", s.code);
    else url.searchParams.delete("stage");
    window.history.replaceState(null, "", url);
  }
  function chooseRole(key: string) {
    setRoleCookie(key); setShowAll(false); setSelectedMeasure("");
    const url = new URL(window.location.href);
    url.searchParams.delete("journey"); url.searchParams.delete("stage");
    window.history.replaceState(null, "", url);
    router.refresh();
  }
  function step(direction: number) {
    const next = orderedStages[stageIndex + direction];
    if (journey && next) choose(journey, next);
  }
  function showSelectedDetail() {
    detailPanel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    detailPanel.current?.focus({ preventScroll: true });
  }

  return (
    <main className="journey-workspace">
      <header className="explorer-heading">
        <div><p className="eyebrow"><span /> THE RESIDENT EXPERIENCE</p><h1>Every connection matters<span>.</span></h1><p className="heading-description">Explore the journey. Define excellent service. Connect it to what residents value.</p></div>
        <div className="explorer-overview"><span>{journeys.length} journeys</span><span>{totalStages} stages</span><Link href="/coverage">{allTsms.size} TSMs <ArrowUpRight size={14} /></Link></div>
      </header>
      <div className="explorer-toolbar">
        <div className="journey-tabs" role="group" aria-label="Choose a journey">
          {journeys.map(j => {
            const t = journeyTheme(j.key);
            const Icon = journeyIcons[j.key as keyof typeof journeyIcons] ?? House;
            const available = visible.find(v => v.key === j.key);
            return <button key={j.key} type="button" className="journey-tab" style={journeyStyle(j.key)} aria-pressed={journey?.key === j.key} onClick={() => { if (!available) setShowAll(true); setSelectedMeasure(""); choose(available ?? j); }}><Icon size={19} /><span>{t.short}</span><span className="journey-tab-count">{j.stages.length}</span></button>;
          })}
        </div>
        {roles.length > 0 && <label className="role-select"><Users size={17} /><span className="sr-only">View as a role</span><select value={activeRole.key} onChange={event => chooseRole(event.target.value)}>{roles.map(role => <option key={role.key} value={role.key}>{role.name}</option>)}</select></label>}
      </div>
      <section className="explorer" style={journeyStyle(journey?.key ?? journeyKey)} aria-label="Journey stages">
        <div className="explorer-titlebar"><div><span className="journey-indicator" /><h2>{theme.name}</h2><span className="stage-count">{orderedStages.length} stages{focused ? " in this role" : ""}</span></div><div className="view-toggle" role="group" aria-label="Stage layout"><button type="button" aria-label="Map view" aria-pressed={view === "map"} onClick={() => setView("map")}><Route size={16} /><span>Map</span></button><button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><LayoutList size={16} /><span>List</span></button></div></div>
        {focused && <div className="focus-note">Showing stages relevant to {activeRole.name.toLowerCase()}. <button onClick={() => setShowAll(true)}>Show all stages</button></div>}
        {!journey || !stage || !presentation ? <div className="empty-journey"><Route size={30} /><h3>No stages to show yet</h3><p>Journey stages will appear here once they have been added.</p>{focused && <button className="button-secondary" onClick={() => setShowAll(true)}>Show all stages</button>}</div> : <div className="explorer-columns">
          <div className="journey-canvas">
            <div className="connection-lens"><label htmlFor="measure-lens"><Network size={16} /><span>Trace a TSM</span></label><select id="measure-lens" value={measure?.code ?? ""} onChange={event => setSelectedMeasure(event.target.value)}><option value="">All connections</option>{measures.map(tsm => <option key={tsm.code} value={tsm.code}>{tsm.code} · {tsm.name}</option>)}</select>{measure && <button className="icon-button" type="button" aria-label="Clear TSM highlight" onClick={() => setSelectedMeasure("")}><X size={15} /></button>}</div>
            <div className="connection-status" aria-live="polite">{measure ? <><strong>{measure.code}</strong> connects to {measure.stageCodes.length} {measure.stageCodes.length === 1 ? "stage" : "stages"}{focused ? " in this role" : " in this journey"}. <Link href={`/tsm/${measure.code}`}>Measure details <ArrowUpRight size={13} /></Link></> : "Select a stage to see the resident outcome and service standard."}</div>
            <button className="mobile-detail-jump" type="button" onClick={showSelectedDetail}>View {presentation.label.toLowerCase()} details <ArrowRight size={16} /></button>
            {groups.map(group => <section className={`journey-group ${group.sequence ? "sequence-group" : "service-group"}`} key={group.key} aria-labelledby={`group-${group.key}`}><div className="group-heading">{group.sequence ? <ArrowRight size={16} /> : <Repeat2 size={16} />}<h3 id={`group-${group.key}`}>{group.title}</h3></div><p className="group-description">{group.description}</p><div className={`stage-nodes ${view === "list" ? "nodes-list" : ""}`}>{group.stages.map(s => {
              const selected = s.code === stage.code;
              const matched = Boolean(measure?.stageCodes.includes(s.code));
              const node = stagePresentation(s);
              return <button type="button" key={s.code} className={`stage-node ${matched ? "tsm-matched" : ""}`} data-stage={s.code} aria-pressed={selected} aria-controls="selected-stage-panel" onClick={() => choose(journey, s)}><span className="node-header"><span className="node-code">{s.code}</span>{selected ? <Check size={16} aria-label="Selected stage" /> : <ArrowUpRight size={15} aria-hidden="true" />}</span><span className="node-title">{node.label}</span><span className="node-subtitle">{s.title}</span>{view === "list" && <span className="node-standard">{firstStandard(s.excellence)}</span>}<span className="node-footer">{matched ? <><Network size={13} />{measure?.code} linked</> : <>{s.tsms.length ? `${s.tsms.length} TSM ${s.tsms.length === 1 ? "connection" : "connections"}` : "Enabling stage"}</>}{s.openChallenges > 0 && <span className="node-feedback" aria-label={`${s.openChallenges} open challenges`}><MessageSquareText size={13} />{s.openChallenges}</span>}</span></button>;
            })}</div></section>)}
            <div className="canvas-legend"><span><span className="legend-selected" />Selected stage</span>{measure && <span><Network size={14} />TSM connection</span>}<span>Stages can recur or overlap.</span></div>
          </div>
          <section id="selected-stage-panel" className="stage-inspector" ref={detailPanel} tabIndex={-1} aria-labelledby="selected-stage-title">
            <div className="inspector-navigation"><p className="eyebrow">STAGE {stage.code}</p><div><button className="icon-button" type="button" aria-label="Previous stage" disabled={stageIndex <= 0} onClick={() => step(-1)}><ChevronLeft size={17} /></button><button className="icon-button" type="button" aria-label="Next stage" disabled={stageIndex === orderedStages.length - 1} onClick={() => step(1)}><ChevronRight size={17} /></button></div></div>
            <div className="inspector-content" key={stage.code}><h2 id="selected-stage-title">{presentation.label}</h2><p className="inspector-subtitle">{stage.title} · {stage.subtitle}</p><p className="sr-only" aria-live="polite">Selected stage: {stage.code}, {presentation.label}</p>
              <div className="resident-outcome"><p><HeartHandshake size={16} />Resident outcome <span>Our ambition</span></p><h3>{presentation.outcome}</h3></div>
              <div className="inspector-section-heading"><Sparkles size={18} /><h3>What excellence looks like</h3></div>
              <div className="rich-text inspector-standards" dangerouslySetInnerHTML={{ __html: stage.excellence }} />
              <details className="activities-disclosure"><summary>What happens at this stage <ChevronRight size={16} /></summary><div className="rich-text" dangerouslySetInnerHTML={{ __html: stage.activities }} /></details>
              <div className="inspector-section-heading"><Network size={18} /><h3>Connected measures</h3><span>{stage.tsms.length}</span></div>
              <p className="section-hint">Select a measure to highlight its stages on the map.</p>
              <div className="measure-buttons">{stage.tsms.map(tsm => <button type="button" key={tsm.code} aria-label={`Highlight ${tsm.code}: ${tsm.name}${!tsm.reportable ? ", indicative link" : ""}`} aria-pressed={measure?.code === tsm.code} onClick={() => setSelectedMeasure(measure?.code === tsm.code ? "" : tsm.code)}><span>{tsm.code}</span><span>{tsm.name}</span>{!tsm.reportable && <small>Indicative</small>}</button>)}</div>
              {!stage.tsms.length && <div className="enabling-stage"><Building2 size={19} /><p>This stage supports later resident outcomes. No direct TSM connection is mapped yet.</p></div>}
              <div className="mapping-note"><Info size={15} /><p>{journey.tenure === "LCHO" ? "Shared ownership links are indicative. Confirm which measures and reporting scope apply using current RSH guidance." : "Connections show where a service can influence satisfaction. They do not measure this stage's performance."}</p></div>
              <button className="text-link" type="button" onClick={() => setDetail("tsms")}>Measure definitions & performance <ArrowUpRight size={15} /></button>
              <div className="inspector-ownership"><div><Users size={16} /><span>{stage.accountableTeam?.name ?? "Owner to be agreed"}{stage.accountableRole && <small>{stage.accountableRole}</small>}</span></div><div><Clock3 size={16} /><span>{stage.targetDays === null ? "Ongoing service" : `${stage.targetDays} days · indicative target`}</span></div></div>
              <div className="inspector-resources"><button type="button" onClick={() => setDetail("processes")}><Workflow size={16} />{stage.processes.length} processes<ChevronRight size={14} /></button><button type="button" onClick={() => setDetail("policies")}><FileText size={16} />{stage.policies.length} policies<ChevronRight size={14} /></button></div>
              <div className="inspector-feedback"><MessageSquareText size={19} /><div><h3>Help shape this stage</h3><p>{stage.openChallenges ? `${stage.openChallenges} open ${stage.openChallenges === 1 ? "challenge" : "challenges"} for discussion` : "Does this reflect the experience residents should have?"}</p></div><button type="button" aria-label="Review this stage and give feedback" onClick={() => setDetail("excellence")}><ArrowUpRight size={19} /></button></div>
              <button className="button-secondary inspector-full-detail" type="button" onClick={() => setDetail(activeRole.leadAnswer)}>Full stage detail{admin ? " & editing" : ""}<ArrowUpRight size={16} /></button>
            </div>
          </section>
        </div>}
      </section>
      <details className="editor-disclosure no-print"><summary><Award size={15} />Content administration</summary><AdminBar admin={admin} onChange={setAdmin} /></details>
      {detail && stage && journey && <StageDetail key={`${stage.code}-${detail}`} stage={stage} journeyName={theme.name} journeyColour={theme.colour} admin={admin} library={library} leadAnswer={detail} onClose={() => setDetail(null)} onSaved={() => { setDetail(null); router.refresh(); }} />}
    </main>
  );
}
