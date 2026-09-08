"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, BookOpen, Building2, ChartNoAxesCombined, ChevronRight, House, Menu, MessageSquareText, Route, Search, Sprout, Workflow, X } from "lucide-react";
const navigation = [
    { href: "/", label: "Journey explorer", icon: Route },
    { href: "/coverage", label: "TSM connections", icon: ChartNoAxesCombined },
    { href: "/processes", label: "Processes", icon: Workflow },
    { href: "/library", label: "Policy library", icon: BookOpen },
    { href: "/challenges", label: "Feedback & challenges", icon: MessageSquareText },
];
export default function AppShell({ children }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const current = navigation.find(({ href }) => href === "/" ? pathname === "/" || pathname === "/map" : pathname.startsWith(href))?.label ?? (pathname.startsWith("/tsm/") ? "TSM connections" : "Search");
    return (<div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      {menuOpen && <button className="sidebar-backdrop no-print" aria-label="Close navigation" onClick={() => setMenuOpen(false)}/>}
      <aside className={`sidebar no-print ${menuOpen ? "is-open" : ""}`}>
        <Link href="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><House size={25} strokeWidth={2.3}/></span>
          <span>housing<span className="brand-second">journeys<span className="brand-dot">.</span></span></span>
        </Link>
        <button className="mobile-nav-close icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={20}/></button>
        <div className="workspace-label"><Building2 size={15}/> Social housing workspace</div>
        <p className="nav-label">EXPLORE & CONNECT</p>
        <nav aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = label === current;
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`nav-item ${active ? "active" : ""}`} onClick={() => setMenuOpen(false)}><Icon size={19} strokeWidth={1.8}/><span>{label}</span>{active && <ChevronRight size={15} className="nav-chevron"/>}</Link>;
        })}
        </nav>
        <div className="sidebar-bottom">
          <div className="purpose-note"><span className="purpose-icon"><Sprout size={23}/></span><h2>People. Homes.<br />Possibilities.</h2><p>A shared picture of the service residents deserve.</p></div>
          <a href="https://www.gov.uk/government/publications/tenant-satisfaction-measures-technical-requirements" target="_blank" rel="noreferrer" className="guidance-link">TSM guidance <ArrowUpRight size={15}/></a>
          <div className="workspace-status"><span /> Working draft <span className="version-label">v1.0</span></div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar no-print">
          <div className="breadcrumb"><button className="mobile-nav-toggle icon-button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21}/></button><House size={16} className="breadcrumb-home"/><span className="breadcrumb-divider">/</span><span>{current}</span></div>
          <Link href="/search" className="global-search"><Search size={17}/><span>Search journeys, policies, TSMs…</span><span className="search-hint">Search</span></Link>
          <span className="workspace-badge"><span /> Service design</span>
        </header>
        <div id="main-content" tabIndex={-1}>{children}</div>
        <footer className="app-footer no-print"><span><Sprout size={15}/> Designed around residents.</span><span>Journey content is a working draft. Validate standards and reporting scope with your teams.</span></footer>
      </div>
    </div>);
}
