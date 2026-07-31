# Italia — Oct 1–11 2026

A single-file trip planner for eleven days in Rome, Florence, Chianti, Bologna and Venice.
Everything lives in `italia.html`: no build step, no dependencies to install.

## What's in it

- **Four trip variants** — Balanced, Experiences, Food, Romantic. Same flights and cities;
  each one patches the base plan, checklist, costs and map pins.
- **Day-by-day plan** with time slots, costs, tips and a Plan B for rain or delays.
- **Map** (Leaflet + OpenStreetMap) with numbered stops in visit order, time-of-day bands,
  walking/boat/train legs, and station and airport pins.
- **"Don't miss it"** cards for every fixed departure: which station, how to get there,
  how much buffer, and what happens if you miss it.
- **Booking checklist** sorted by urgency, with a vault for confirmation refs and meeting points.
- **Budget ledger** in EUR, displayed in CAD or EUR.
- **Trip talk** — shared comments per day and votes on which variant to take.

## Running it

Open `italia.html` in any browser and the plan, map, checklist and budget all work.

Two features need the Claude artifact runtime and will be inert on a plain file open
or on static hosting like GitHub Pages:

- **Live hotel and tour search** (Expedia and Viator via MCP)
- **Saved state and shared comments/votes** (`window.storage`)

For the group discussion and voting to work, share the published Claude artifact link
rather than this file.

## Notes on the plan

- Sun Oct 4 2026 is a first Sunday — *Domenica al Museo* — so state sites including the
  Colosseum and Forum are free, which usually means no advance timed tickets and long
  queues. Verify before booking; the fallback is Mon Oct 5 first thing.
- Vatican Museums are closed Sundays; the Uffizi is closed Mondays. The plan is built
  around both.
- EES biometrics apply on first EU entry, so nothing is scheduled tightly on landing day.
