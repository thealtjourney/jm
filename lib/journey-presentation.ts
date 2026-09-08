import type { CSSProperties } from "react";
export const JOURNEY_THEMES: Record<string, {
    name: string;
    short: string;
    description: string;
    colour: string;
    tint: string;
    bright: string;
}> = {
    property: { name: "Property journey", short: "Our homes", description: "From the first plans to a home's next chapter.", colour: "#1762ae", tint: "#edf5ff", bright: "#c9e3ff" },
    customer: { name: "Rented customer journey", short: "Our residents", description: "From finding a home to feeling at home.", colour: "#087255", tint: "#edf9ef", bright: "#d4eea9" },
    owner: { name: "Shared ownership journey", short: "Our homeowners", description: "From the first enquiry to the next step in ownership.", colour: "#a94a20", tint: "#fff4eb", bright: "#ffdac0" },
};
export function journeyTheme(key: string) { return JOURNEY_THEMES[key] ?? JOURNEY_THEMES.property; }
export function journeyStyle(key: string): CSSProperties {
    const theme = journeyTheme(key);
    return { "--journey-colour": theme.colour, "--journey-tint": theme.tint, "--journey-bright": theme.bright } as CSSProperties;
}
export function firstStandard(html: string): string {
    const first = html.match(/<li[^>]*>([\s\S]*?)<\/li>/i)?.[1] ?? html;
    return first.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();
}
