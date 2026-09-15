"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, House, Menu, MessageSquareText, Network, Route, Search, Sprout, Workflow, X } from "lucide-react";

const navigation = [
  { href: "/", label: "Journey explorer", short: "Journeys", icon: Route },
  { href: "/coverage", label: "TSM connections", short: "TSMs", icon: Network },
  { href: "/processes", label: "Processes", short: "Processes", icon: Workflow },
  { href: "/library", label: "Policy library", short: "Policies", icon: BookOpen },
  { href: "/challenges", label: "Feedback & challenges", short: "Feedback", icon: MessageSquareText },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const current = navigation.find(({ href }) => href === "/" ? pathname === "/" || pathname === "/map" : pathname.startsWith(href))?.label ?? (pathname.startsWith("/tsm/") ? "TSM connections" : pathname === "/board-pack" ? "Board pack" : "Search");

  useEffect(() => {
    if (!menuOpen) return;
    const trigger = menuButton.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = sidebar.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const focusFrame = requestAnimationFrame(() => controls?.[0]?.focus());
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key !== "Tab" || !controls?.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (!sidebar.current?.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [menuOpen]);

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {menuOpen && <button className="sidebar-backdrop no-print" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <aside ref={sidebar} id="main-navigation" className={`sidebar no-print ${menuOpen ? "is-open" : ""}`} role={menuOpen ? "dialog" : undefined} aria-modal={menuOpen ? true : undefined} aria-label="Application navigation">
      <Link href="/" className="brand-lockup" aria-label="Housing Journeys home" onClick={() => setMenuOpen(false)}><span className="brand-mark"><House size={25} strokeWidth={1.8} /></span></Link>
      <button className="mobile-nav-close icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={20} /></button>
      <nav aria-label="Main navigation">{navigation.map(({ href, label, short, icon: Icon }) => <Link key={href} href={href} aria-label={label} aria-current={label === current ? "page" : undefined} className={`nav-item ${label === current ? "active" : ""}`} onClick={() => setMenuOpen(false)}><Icon size={22} strokeWidth={1.7} /><span>{short}</span></Link>)}</nav>
      <div className="sidebar-bottom"><a href="https://www.gov.uk/government/publications/tenant-satisfaction-measures-technical-requirements" target="_blank" rel="noreferrer" className="guidance-link" aria-label="Read official TSM guidance"><BookOpen size={19} /><span>Guidance</span><ArrowUpRight size={12} /></a><div className="sidebar-purpose"><Sprout size={24} /><span>People.<br />Homes.<br />Possibilities.</span></div></div>
    </aside>
    <div className="app-main" inert={menuOpen}>
      <header className="topbar no-print">
        <div className="topbar-identity"><button ref={menuButton} className="mobile-nav-toggle icon-button" aria-label="Open navigation" aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21} /></button><Link href="/" className="wordmark">housing journeys<span>.</span></Link><span className="breadcrumb">{current}</span></div>
        <div className="topbar-tools"><Link href="/search" className="global-search" aria-label="Search journeys, policies and TSMs"><Search size={17} /><span>Search the workspace</span></Link><span className="workspace-badge"><span />Social housing</span></div>
      </header>
      <div id="main-content" tabIndex={-1}>{children}</div>
      <footer className="app-footer no-print"><span><Sprout size={15} />Designed around residents.</span><span>Working draft · Validate standards and reporting scope with your teams.</span></footer>
    </div>
  </div>;
}
