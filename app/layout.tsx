import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Housing Journey Manager",
  description:
    "Property, rented customer and shared ownership journeys mapped to service standards, processes, policies and Tenant Satisfaction Measures.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen">
        <header className="no-print sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-6">
            <Link href="/" className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-7 w-7 rotate-45 rounded-[6px] bg-brand"
              />
              <span className="text-lg font-extrabold tracking-tight text-brand">
                Housing Journey Manager
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-muted transition hover:bg-canvas hover:text-brand"
              >
                Journeys
              </Link>
              <Link
                href="/library"
                className="rounded-lg px-3 py-2 text-muted transition hover:bg-canvas hover:text-brand"
              >
                Library
              </Link>
              <Link
                href="/coverage"
                className="rounded-lg px-3 py-2 text-muted transition hover:bg-canvas hover:text-brand"
              >
                TSM coverage
              </Link>
              <Link
                href="/challenges"
                className="rounded-lg px-3 py-2 text-muted transition hover:bg-canvas hover:text-brand"
              >
                Challenges
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="no-print border-t border-line bg-surface">
          <div className="mx-auto max-w-[1600px] px-6 py-8 text-sm text-muted">
            Journey content is a working draft for review. Tenant Satisfaction
            Measures are reported for rented (LCRA) homes; measures shown against
            shared ownership stages are indicative of influence only.
          </div>
        </footer>
      </body>
    </html>
  );
}
