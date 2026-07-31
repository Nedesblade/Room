# Stay the Hire

**A Reorguelike Deck-Builder** — Author: **nedesblade**

> 🎮 **Play it: the game at the repo root is the latest edition** (design-book visuals).
> 📁 `design/` holds the character bible + contact sheets (the creative source of truth).
> 🕹️ `editions/` holds two earlier fully-playable visual editions.
> 🧭 **New here? Read [`HANDOFF.md`](HANDOFF.md)** — architecture, content guides, theme glossary, test & deploy.

---

# Stay the Hire — 8-Bit Edition

**A Reorguelike Deck-Builder** — Author: **nedesblade**

*This is the 8-Bit Edition: the full game re-skinned as one cohesive retro pixel experience. See `AUDIT.md` for the foundation audit that preceded it. The cast follows the game's character bible: 9 playable roles including the Spreadsheet Witch, 40+ enemies including the Roadmap Slime (splits into Untriaged Tasks), Calendar Imp, Budget Skeleton and Slack Thread Hydra, 8 bosses including The Recurring Meeting With No End Date and the Chief Vibes Officer, plus friendly NPCs — the Haunted Handbook, the Office Supply Oracle, the Printer Elder, the Break Room Goblin, the Swag Box Mimic, and Alfred (badge varies weekly). Characters with design-book portraits use the concept-art PNGs from `assets/characters/` (extracted from the game's character contact sheets); the rest use procedurally-built 16x16 pixel sprites, the hero is a 16x21 pixel office worker, and the entire UI — menu, org chart, combat, cards, shop, events, summary — uses chunky black outlines, flat color blocks, hard shadows and clean white space. The run takes place in THE INFINITE ORG CHART: Act 1 The Onboarding Wastes, Act 2 The Middle Management Mire, Act 3 The Executive Cloud Castle.*

Survive meetings, office politics, burnout, layoffs and baffling executive decisions long enough to climb the corporate ladder. Each run is one ridiculous career arc: pick a role, join a procedurally generated company, and fight your way through three acts of turn-based card combat — from Entry-Level Chaos to Executive Survival.

A complete browser-playable roguelike deck-builder: no build step, no dependencies, no server. Your career memory (name, wins, burnouts, incident reports, unlocked titles) is stored in your browser's localStorage.

## Features

Real deck-builder mechanics (shuffled draw pile, hand, discard, exhaust, Influence costs, X-cost cards, enemy intents, status effects, card rewards, upgrades and removal), 90 playable cards across 7 corporate categories — every card with its own icon, type line (Attack/Skill/Power/Status/Curse) and rarity treatment — 8 cute starter characters with distinct decks and passives, 29 enemy archetypes plus 6 multi-phase act bosses with intro scenes, drawn as original workplace meme caricatures, 42 branching corporate events, 34 perks, shops (the Procurement Portal), mystery nodes, procedural company generation, a branching career-ladder map, performance reviews, reorgs, coffee breaks, combat with floating damage numbers, hit flashes and screen shake, and a career retrospective with 10+ possible endings.

**Two visual modes**, switchable from the main menu and remembered in your save: *Office Pony* (cozy paper-and-sticky-note board game — the default) and *Spire Satire* (dusk-lit parchment-and-shadow premium deck-builder staging). Same mechanics, same DOM, two moods. No image assets — all art is inline SVG and emoji.

## Play locally

No build step required. Either:

1. **Just open it** — double-click `index.html` (everything runs from plain `<script>` tags), or
2. **Serve it** (recommended):

```bash
cd stay-the-hire
python3 -m http.server 8000
# then open http://localhost:8000
```

Requirements: any modern desktop browser. Mouse-first; keyboard shortcuts `1–9` play cards and `E` ends the turn.

## Deploy with GitHub Pages

1. Create a **public** GitHub repository (e.g. `stay-the-hire`).
2. Push this folder to it:

   ```bash
   cd stay-the-hire
   git init && git add -A && git commit -m "Stay the Hire v1"
   git branch -M main
   git remote add origin https://github.com/<your-username>/stay-the-hire.git
   git push -u origin main
   ```

3. **That's it.** The included workflow (`.github/workflows/deploy-pages.yml`) runs on every push to `main`: it executes the test suite, then publishes the content to a `gh-pages` branch. Creating that branch automatically enables branch-based GitHub Pages, so after a minute or two the game is live at `https://<your-username>.github.io/stay-the-hire/` — no manual Pages setup needed.

If you prefer the manual route instead (or Actions are disabled): **Settings → Pages → Build and deployment**, set **Source** to *Deploy from a branch*, choose branch `main` and folder `/ (root)`, save, and delete the workflow file.

Note: pushing the workflow file requires a token with the `workflow` scope (classic PAT) or *Workflows: write* (fine-grained PAT).

## Project structure

```
index.html            entry point (loads everything, no bundler)
css/style.css         corporate-satire UI theme, responsive layout
js/engine.js          all game rules: combat, map, events, run state, localStorage memory
js/ui.js              rendering + mouse/keyboard input (no game logic)
js/data/cards.js      95 card definitions (88 playable + Burnout/status cards)
js/data/enemies.js    35 enemies incl. bosses, encounter pools per act
js/data/events.js     42 corporate events
js/data/perks.js      34 perks (relics)
js/data/roles.js      8 starter roles
js/data/statuses.js   buff/debuff definitions + resource tooltips
js/data/companies.js  procedural company generator
js/data/art.js        presentation only: card icons + hand-drawn SVG characters
                      (cute player avatars, original meme-caricature enemies)
tests/run-tests.js    data validation, mechanics unit tests, 400 simulated full runs
tests/ui-smoke.js     jsdom click-through smoke test of the actual UI
```

## Tests

```bash
node tests/run-tests.js            # engine: 3,700+ checks, simulates 400 complete runs
npm install jsdom                  # only needed for the UI smoke test
node tests/ui-smoke.js             # boots index.html and clicks through a real game
```

## Design notes

The engine (`js/engine.js`) is fully UI-agnostic — every rule from card costs to boss phases lives there, which is what makes headless simulation of complete runs possible. The UI layer renders state and forwards clicks. All effects are data-driven: a card that says "gain 8 Trust" executes `{t:8}` through the same interpreter the tests validate, so rules text and behavior can't drift apart.

All companies, characters and incidents are fictional. Any resemblance to your actual workplace is a coincidence, a tragedy, or both.
