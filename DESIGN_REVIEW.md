# Housing Journeys: review and redesign

The application is most valuable as a shared view of what residents should
experience, what teams need to deliver, and which satisfaction measures can be
influenced. Its existing 25 stages, three journeys and four answer sets are a
strong foundation. It should stay focused on service design rather than grow
into a case management system.

## What changed

- The home page now opens the journey explorer directly.
- The property journey is blue, rented customer journey green, and shared
  ownership journey orange. A shared navigation and type system carries the
  identity across the application.
- Journey selectors, a connected stage path and a list view make browsing easier.
- Excellence and TSM connections are visible together. Activities, detailed
  measures, processes, policies and editing remain available in stage detail.
- Teams and indicative timescales appear alongside each stage.
- Role preferences remain available without hiding the rest of the service.
- Direct stage URLs work from search and TSM pages.
- The stage dialog uses native modal focus handling, Escape dismissal and focus
  restoration. Responsive layouts and reduced-motion styles are included.

## Findings to act on

1. **Validate TSM scope and catalogue.** The prototype's original library contains
   22 measures. RSH added BS06 electrical safety checks in June 2026. The app
   now flags this omission and no longer claims shared ownership is universally
   outside TSM reporting. Existing indicative mappings are preserved pending a
   provider-specific review. Source: [RSH technical requirements, updated
   11 June 2026](https://www.gov.uk/government/publications/tenant-satisfaction-measures-technical-requirements).
2. **Separate influence from measured performance.** Organisation-level TSM
   figures cannot establish a particular stage's performance. The explorer
   leads with connections and ambition; illustrative figures retain their
   labels in detail and reporting. A green stage badge should not be interpreted
   as evidence that every standard at that stage is being met.
3. **Treat the map as a service model.** Repairs, complaints and neighbourhood
   contact can recur, overlap or be skipped. Numbered stages describe the map's
   order, not a mandatory sequence for every resident.
4. **Replace generic content with agreed standards.** The existing service copy,
   targets and policy descriptions are draft material. Teams and residents
   should review them before the map becomes an assurance source.

## Suggested next features, in priority order

| Addition | Practical value | Smallest useful version |
| --- | --- | --- |
| Resident evidence | Grounds the map in lived experience | Attach anonymised resident feedback or research evidence to a stage, with source and date. |
| Ambition versus current practice | Turns standards into improvement work | Assess each excellence statement as evidenced, partly evidenced or not yet evidenced; attach an action and owner. |
| Review dates and ownership | Keeps the content credible | Surface the existing last-reviewed field, add a next review date, and show overdue content to the accountable team. |
| Cross-journey handovers | Makes service gaps visible | Link related stages, starting with property handover and a resident moving in; name what information must transfer. |
| Workshop view | Supports team and resident discussions | Print the selected journey with excellence, evidence gaps and actions, separate from the existing performance board pack. |

Avoid a single unexplained "excellence score" or adding case-level resident data.
A small number of evidence-backed actions will be more useful than another
performance dashboard.

## Implementation boundary

The existing Next.js, Postgres, API and authentication structure is retained.
No production database migrations, live records, credentials or deployment
settings were changed for the redesign. A temporary local database populated
from the existing seed files was used to preview the application because the
configured local database was unavailable.
