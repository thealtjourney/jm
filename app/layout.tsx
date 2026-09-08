import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Housing Journeys · Better resident experiences",
  description: "Explore property, rented customer and shared ownership journeys. Connect every stage to excellent service, accountable teams and Tenant Satisfaction Measures.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body><AppShell>{children}</AppShell></body></html>;
}
