"use client";

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

export type RouteStop = {
  id: string;
  label: string;
  caption?: string;
  highlighted?: boolean;
  disabled?: boolean;
};

/** The circles indicate navigation position, never completion or performance. */
export default function ConnectedRoute({ stops, selected, onSelect, label, controls }: {
  stops: RouteStop[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
  controls: string;
}) {
  return <ol className="connected-route" aria-label={label} style={{ "--route-count": stops.length } as CSSProperties}>
    {stops.map((stop, index) => <li key={stop.id} className={stop.highlighted ? "route-highlighted" : ""}>
      <button type="button" className="route-stop" aria-pressed={selected === stop.id} aria-controls={controls} disabled={stop.disabled} onClick={() => onSelect(stop.id)}>
        <span className="route-number">{index + 1}</span>
        <span className="route-stop-copy"><span className="route-stop-title">{stop.label}</span>{stop.caption && <span className="route-stop-caption">{stop.caption}</span>}</span>
      </button>
      {index < stops.length - 1 && <ArrowRight className="route-connector-arrow" size={15} aria-hidden="true" />}
    </li>)}
  </ol>;
}
