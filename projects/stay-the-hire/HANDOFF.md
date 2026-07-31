# HANDOFF — everything you need to pick this project up

**Stay the Hire** — a whimsical corporate roguelike deck-builder. Author credit: **nedesblade**.
Plain HTML/CSS/JS, no build step, no dependencies. Open `index.html` and it runs.

## Repo layout

```
/                     THE GAME (latest: design-book visual edition). Deployed to GitHub Pages.
/assets/characters/   35 concept-sprite PNGs used in-game (from the design book, transparent bg)
/design/              CREATIVE SOURCE OF TRUTH
  character-design-book.md   full character bible: 35 characters with story, personality,
                             gameplay identity, sample lines, pixel notes
  design-book/*.png          the 4 contact sheets = the art target for all future art
  design-book/characters/    512px concept sprite per character
/editions/original/   v1: paper/sticky-note theme + "Spire Satire" dark mode (fully playable)
/editions/pixel/      v2: first pixel-hero edition (fully playable)
/AUDIT.md             the foundation audit that verified all deck-builder systems are real
/tests/               run `node tests/run-tests.js` (engine) and `node tests/ui-smoke.js` (needs jsdom)
```

## Architecture (root game)

- `js/engine.js` — ALL rules. UI-agnostic: combat, map, events, shops, saves. This is why the
  test suite can simulate 400 complete runs headlessly.
- `js/ui.js` — rendering + input only. No game logic. Rebuilds DOM from state on every action.
- `js/data/*.js` — declarative content. Cards/enemies/events are data interpreted by the engine:
  - `cards.js` 104 cards. Effects are `fx` arrays (e.g. `{p:7}` = deal 7 Pressure). The test
    suite validates every fx key against the engine's vocabulary, so text and behavior can't drift.
  - `enemies.js` 40+ enemies/bosses with intent scripts, phases, split/summon/vote mechanics.
  - `events.js` 42 events · `perks.js` 40 perks · `roles.js` 9 playable roles · `statuses.js` buffs/debuffs
  - `art.js` all art: procedural pixel sprites, pixel card icons, and the design-book sprite maps.

## Theme glossary (corporate reskin of deck-builder terms)

HP = Composure (inverse of Stress) · Energy = Influence · Block = Trust · Gold = Political Capital ·
Strength = Leverage · Weak = Flustered · Vulnerable = On the Record · Frail = Overloaded ·
Poison = Paper Trail · Relics = Office Artifacts · Campfire = Break Room · Shop = Office Supply Closet.

## How to add content

- **Card:** add to `cards.js` (id, cost, cat, rarity, fx, text matching fx, flavor, `up` overrides),
  a pixel icon spec in `art.js` (`CARD_PIX`), done. Tests will fail loudly if anything's missing.
- **Enemy:** add to `enemies.js` (hp range, moves with fx, script rotation, intro/defeat lines),
  a sprite config in `art.js` (`ENEMY_ART`), and put it in an act pool (`ENCOUNTERS`).
- **Perk:** add to `perks.js`; simple ones are declarative, bespoke ones hook in `engine.js`
  (search `perkHas(` for the hook points).
- **Character art:** follow `/design/character-design-book.md`. The contact sheets are the target.

## Testing & deployment

- `node tests/run-tests.js` — 4,400+ checks: data validation, mechanics unit tests, 400 simulated
  full runs (must produce wins AND burnouts, zero crashes).
- `npm i jsdom && node tests/ui-smoke.js` — boots index.html and clicks through a real game.
- Push to `main` → GitHub Actions runs the tests, then publishes to the `gh-pages` branch → live site.

## Writing rules (do not break these)

Funny, petty, specific, fictional-workplace-Reddit voice. Every joke supports a mechanic.
No real companies or people. No copied Slay the Spire content — genre structure only.
Bad: "Your boss gives you more work." Good: "Your manager marks the task 'quick ask,' then
attaches a 19-tab spreadsheet and says it should be mostly done already."
