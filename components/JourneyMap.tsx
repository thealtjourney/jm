"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Award, Building2, Check, ChevronLeft, ChevronRight, Clock3, FileText, HeartHandshake, House, Info, KeyRound, LayoutList, MessageSquareText, Route, ShieldCheck, Sparkles, Users, Workflow } from "lucide-react";
import type { JourneyDetail, RoleLens, StageDetail as Stage } from "@/lib/queries";
import { firstStandard, journeyStyle, journeyTheme } from "@/lib/journey-presentation";
import { setRoleCookie } from "@/lib/role-cookie";
import { STATUS_META } from "@/lib/status";
import StageDetail from "./StageDetail";
import AdminBar from "./AdminBar";
type Library = {
    policies: {
        code: string;
        name: string;
        category: string;
    }[];
    processes: {
        code: string;
        name: string;
        team: string;
    }[];
    tsms: {
        code: string;
        name: string;
        category: string;
    }[];
};
const journeyIcons = { property: Building2, customer: HeartHandshake, owner: KeyRound };
const stageIcons = [House, Users, KeyRound, ShieldCheck, HeartHandshake, Workflow, Building2, MessageSquareText, Route, ArrowUpRight];
export default function JourneyMap({ journeys, library, initialAdmin, roles, activeRole, initialJourney, initialStage }: {
    journeys: JourneyDetail[];
    library: Library;
    initialAdmin: boolean;
    roles: RoleLens[];
    activeRole: RoleLens;
    initialJourney?: string;
    initialStage?: string;
}) {
    const router = useRouter();
    const [admin, setAdmin] = useState(initialAdmin);
    const [showAll, setShowAll] = useState(Boolean(initialStage || initialJourney));
    const [journeyKey, setJourneyKey] = useState(initialJourney ?? journeys.find(j => j.stages.some(s => s.code === initialStage))?.key ?? "customer");
    const [stageCode, setStageCode] = useState(initialStage ?? "");
    const [view, setView] = useState<"map" | "list">("map");
    const [detail, setDetail] = useState<RoleLens["leadAnswer"] | null>(null);
    const rail = useRef<HTMLDivElement>(null);
    const focused = activeRole.focusStageCodes.length > 0 && !showAll;
    const visible = useMemo(() => journeys.map(j => ({ ...j, stages: focused ? j.stages.filter(s => activeRole.focusStageCodes.includes(s.code)) : j.stages })).filter(j => j.stages.length), [journeys, focused, activeRole]);
    const journey = visible.find(j => j.key === journeyKey) ?? visible[0];
    const stage = journey?.stages.find(s => s.code === stageCode) ?? journey?.stages[0];
    const stageIndex = journey?.stages.findIndex(s => s.code === stage?.code) ?? 0;
    const totalStages = journeys.reduce((n, j) => n + j.stages.length, 0);
    const allTsms = new Set(journeys.flatMap(j => j.stages.flatMap(s => s.tsms.map(t => t.code))));
    const theme = journeyTheme(journey?.key ?? "customer");
    function choose(j: JourneyDetail, s: Stage = j.stages[0]) {
        setJourneyKey(j.key);
        setStageCode(s.code);
        const url = new URL(window.location.href);
        url.searchParams.set("journey", j.key);
        url.searchParams.set("stage", s.code);
        window.history.replaceState(null, "", url);
    }
    function step(direction: number) {
        if (!journey)
            return;
        const next = journey.stages[stageIndex + direction];
        if (!next)
            return;
        choose(journey, next);
        rail.current?.querySelector(`[data-stage="${next.code}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    return (<main className="journey-workspace">
      <div className="workspace-heading">
        <div><p className="eyebrow"><span /> THE RESIDENT EXPERIENCE</p><h1>Every stage. A better experience<span>.</span></h1><p className="heading-description">Explore the journeys that connect our homes, our services and our residents.</p></div>
      </div>
      <div className="overview-strip"><span><strong>{journeys.length}</strong> connected journeys</span><i /><span><strong>{totalStages}</strong> stages to explore</span><i /><Link href="/coverage"><strong>{allTsms.size}</strong> TSMs linked <ArrowUpRight size={14}/></Link><span className="overview-note"><Sparkles size={15}/> Excellence at every step</span></div>

      <div className="journey-picker" aria-label="Choose a journey">
        {journeys.map(j => {
            const t = journeyTheme(j.key);
            const Icon = journeyIcons[j.key as keyof typeof journeyIcons] ?? House;
            const available = visible.find(v => v.key === j.key);
            const active = journey?.key === j.key;
            return <button key={j.key} type="button" className={`journey-choice ${active ? "selected" : ""}`} style={journeyStyle(j.key)} aria-pressed={active} onClick={() => { if (!available)
                setShowAll(true); choose(available ?? j); rail.current?.scrollTo({ left: 0 }); }}><span className="journey-choice-top"><span className="journey-symbol"><Icon size={25} strokeWidth={1.6}/></span><span className="journey-kicker">{t.short}</span><span className={`choice-indicator ${active ? "checked" : ""}`}>{active ? <Check size={14}/> : <ArrowUpRight size={17}/>}</span></span><span className="journey-choice-name">{t.name}</span><span className="journey-choice-description">{t.description}</span><span className="journey-choice-bottom"><span>{j.stages.length} stages</span><span>{new Set(j.stages.flatMap(s => s.tsms.map(t => t.code))).size} TSM connections</span></span></button>;
        })}
      </div>

      <section className="map-section" style={journeyStyle(journey?.key ?? "customer")} aria-label="Journey stages">
        <div className="map-section-heading"><div><h2>{theme.name}</h2><p>Select a stage to discover what excellent service looks like.</p></div><div className="map-controls no-print"><label className="role-select"><Users size={16}/><span className="sr-only">View as a role</span><select value={activeRole.key} onChange={e => { setRoleCookie(e.target.value); setShowAll(false); router.refresh(); }}>{roles.map(r => <option key={r.key} value={r.key}>{r.name}</option>)}</select></label><div className="view-toggle" aria-label="Stage layout"><button aria-label="Map view" aria-pressed={view === "map"} onClick={() => setView("map")}><Route size={17}/></button><button aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><LayoutList size={17}/></button></div></div></div>
        {focused && <div className="focus-note">Showing stages relevant to {activeRole.name.toLowerCase()}. <button onClick={() => setShowAll(true)}>Show all stages</button></div>}
        {!journey || !stage ? <div className="empty-journey"><Route size={30}/><h3>No stages to show yet</h3><p>Journey stages will appear here once they have been added.</p>{focused && <button className="button-secondary" onClick={() => setShowAll(true)}>Show the whole map</button>}</div> : <>
          <div className={`journey-rail rail ${view === "list" ? "list-view" : ""}`} ref={rail}>
            {journey.stages.map((s, index) => {
                const Icon = stageIcons[index % stageIcons.length];
                const selected = s.code === stage.code;
                const sample = s.tsms.some(t => t.source === "placeholder");
                return <button key={s.code} data-stage={s.code} className={`stage-card ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={() => choose(journey, s)}><span className="stage-path-point"><span>{String(index + 1).padStart(2, "0")}</span><ArrowRight size={14}/></span><span className="stage-card-inner"><span className="stage-card-top"><Icon size={22} strokeWidth={1.7}/><span>{s.code}</span></span><span className="stage-card-title">{s.title}</span><span className="stage-card-subtitle">{s.subtitle}</span>{view === "list" && <span className="stage-excellence-preview">{firstStandard(s.excellence)}</span>}<span className="stage-card-meta"><span>{s.tsms.length ? `${s.tsms.length} TSMs` : "Enabling stage"}</span><span className="stage-selection-arrow">{selected ? <ArrowDownRight size={17}/> : <ArrowRight size={17}/>}</span></span>{activeRole.altitude === "summary" && <span className="stage-health" style={{ color: STATUS_META[s.health].colour }}>{sample ? "Illustrative · " : ""}{STATUS_META[s.health].label}</span>}</span></button>;
            })}
          </div>
          <div className="rail-footer"><span><span className="legend-point"/> Selected stage <span className="rail-instruction">· Follow the journey from left to right</span></span><div className="rail-navigation no-print"><span>{stageIndex + 1} <span className="text-muted">of {journey.stages.length}</span></span><button className="icon-button" aria-label="Previous stage" disabled={stageIndex === 0} onClick={() => step(-1)}><ChevronLeft size={17}/></button><button className="icon-button" aria-label="Next stage" disabled={stageIndex === journey.stages.length - 1} onClick={() => step(1)}><ChevronRight size={17}/></button></div></div>

          <section className="stage-focus" aria-labelledby="selected-stage-title" key={stage.code}>
            <div className="stage-focus-header"><div className="stage-focus-number">{String(stageIndex + 1).padStart(2, "0")}</div><div><p className="stage-focus-eyebrow">STAGE {stageIndex + 1} OF {journey.stages.length} <span> / </span> {stage.code}</p><h2 id="selected-stage-title">{stage.title}</h2><p>{stage.subtitle}</p></div><button className="button-secondary no-print" onClick={() => setDetail(activeRole.leadAnswer)}>Full stage detail <ArrowUpRight size={16}/></button></div>
            <div className="stage-focus-meta"><span><Users size={15}/>{stage.accountableTeam?.name ?? "Owner to be agreed"}</span><span><Clock3 size={15}/>{stage.targetDays === null ? "Ongoing service" : `${stage.targetDays} days · indicative target`}</span><button onClick={() => setDetail("processes")}><Workflow size={15}/>{stage.processes.length} processes</button><button onClick={() => setDetail("policies")}><BookIcon />{stage.policies.length} policies</button></div>
            <div className="stage-focus-grid">
              <div className="excellence-panel"><div className="panel-heading"><span className="panel-icon excellence-icon"><Sparkles size={20}/></span><div><h3>What excellence looks like</h3><p>The standard we want every resident to experience.</p></div><span className="aspiration-badge">Our ambition</span></div><div className="rich-text excellence-list" dangerouslySetInnerHTML={{ __html: stage.excellence }}/><details className="activities-disclosure"><summary>What happens at this stage <ChevronRight size={16}/></summary><div className="rich-text" dangerouslySetInnerHTML={{ __html: stage.activities }}/></details></div>
              <aside className="tsm-panel"><div className="panel-heading"><span className="panel-icon tsm-icon"><ChartIcon /></span><div><h3>TSM connections</h3><p>How this stage shapes satisfaction.</p></div></div><div className="tsm-connections">{stage.tsms.map(t => <Link href={`/tsm/${t.code}`} key={t.code} className="tsm-connection"><span className={`tsm-code ${!t.reportable ? "indicative" : ""}`}>{t.code}</span><span><strong>{t.name}</strong><small>{t.reportable ? (t.measureType === "perception" ? "Tenant perception" : "Service measure") : "Indicative link · scope to review"}</small></span><ArrowUpRight size={15}/></Link>)}</div>{!stage.tsms.length && <div className="enabling-stage"><Building2 size={24}/><h4>Good foundations matter</h4><p>This stage enables later resident outcomes. No direct TSM link is mapped yet.</p></div>}<div className="mapping-note"><Info size={15}/><p>{journey.tenure === "LCHO" ? "Shared ownership links are indicative in this map. Confirm the applicable measures and reporting scope using current RSH guidance." : "These links show where a stage can influence a measure; they do not establish how much it contributes."}</p></div><button className="text-link" onClick={() => setDetail("tsms")}>Explore measures & performance <ArrowRight size={15}/></button></aside>
            </div>
            <div className="stage-focus-footer"><span><MessageSquareText size={17}/><span>{stage.openChallenges > 0 ? `${stage.openChallenges} open challenges for this stage` : "Great services are shaped together. Does this reflect your experience?"}</span></span><button onClick={() => setDetail("excellence")}>Review & give feedback <ArrowUpRight size={15}/></button></div>
          </section>
          <div className="journey-bottom-nav no-print"><button disabled={stageIndex === 0} onClick={() => step(-1)}><ArrowLeft size={16}/> Previous stage</button><p>Better experiences, one stage at a time.</p><button disabled={stageIndex === journey.stages.length - 1} onClick={() => step(1)}>Next stage <ArrowRight size={16}/></button></div>
        </>}
      </section>
      <details className="editor-disclosure no-print"><summary><Award size={15}/> Content administration</summary><AdminBar admin={admin} onChange={setAdmin}/></details>
      {detail && stage && journey && <StageDetail key={`${stage.code}-${detail}`} stage={stage} journeyName={theme.name} journeyColour={theme.colour} admin={admin} library={library} leadAnswer={detail} onClose={() => setDetail(null)} onSaved={() => { setDetail(null); router.refresh(); }}/>}
    </main>);
}
function BookIcon() { return <FileText size={15}/>; }
function ChartIcon() { return <Route size={20}/>; }
