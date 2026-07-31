# Foundation Audit — Stay the Hire (8-Bit Edition)

**Question:** can the existing implementation support a real roguelike deck-builder, or does the core need a rebuild?

**Method:** the engine is UI-agnostic, so every core system is verifiable headlessly. `node tests/run-tests.js` runs 3,976 assertions and simulates 400 complete runs with a bot playing real cards through the real engine.

## System-by-system audit

| Required system | Status | Evidence |
|---|---|---|
| Deck / hand / discard / exhaust | ✅ real | unit tests: draw-2-with-reshuffle, exhaust pile routing, retain |
| Energy costs (Influence, 3/turn) | ✅ real | unit test: cost deducted exactly; unplayable cards blocked; X-cost spends all |
| Turn loop (player → enemy → repeat) | ✅ real | 400 simulated runs, avg dozens of turns each, 0 crashes |
| Visible enemy intent, executed as shown | ✅ real | intent derived from the same move the enemy then executes |
| Damage → block first → HP; block resets | ✅ real | unit test: 7 attack − 4 Trust = 3 Stress; Trust resets at turn start |
| Player death + recorded loss | ✅ real | 380/400 bot runs end in Burnout; defeat writes to localStorage profile |
| Statuses (Strength/Weak/Vuln/Frail/etc.) | ✅ real | Leverage / Flustered / On the Record / Overloaded + 18 more, all engine-hooked |
| Status/junk/curse cards | ✅ real | 7 Burnout-family cards enter piles and punish holding/drawing them |
| Keywords | ✅ real | Exhaust, Retain, Innate, Ethereal, X-Cost, draw/discard/generate/upgrade/cleanse |
| Relics/perks (35 Office Artifacts) | ✅ real | passive hooks at combat start/turn start/card play/reward time |
| Rewards (1-of-3 or skip, currency, perks) | ✅ real | after every fight; elites/bosses add perk choices |
| Branching map, elites, bosses, events, shops, rests, mystery | ✅ real | 8 node types; 6 multi-phase bosses; 42 events; shop with buy/remove/heal |
| Save/memory persistence | ✅ real | profile in localStorage: name, runs, wins, burnouts, bosses, discoveries, best run, incidents |

## Verdict

**No rebuild required.** The foundation is a real deck-builder — the tests prove the mechanics rather than assert them. What the build actually lacked was *cohesion of presentation*: hand-drawn smooth-SVG enemies and a paper-craft UI around a pixel hero.

## What this edition changes

1. Every enemy and boss re-rendered as a chunky 16×16 **pixel sprite** from the same archetype configs (flat colors, hard outlines, no gradients).
2. Complete UI reskin: one cohesive 8-bit theme — white space, chunky black borders, hard shadows, square pixels — across all 20+ screens. Visual-mode toggle removed in favor of one coherent style.
3. World lore: the run takes place in **The Infinite Org Chart** — Act 1 *The Onboarding Wastes*, Act 2 *The Middle Management Mire*, Act 3 *The Executive Cloud Castle*.
4. All mechanics, save data, writing, author credit (nedesblade), and tests preserved and re-verified.
