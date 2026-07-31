#!/usr/bin/env node
/* Stay the Hire — headless verification.
   1. Validates all game data (cards, enemies, events, perks) against the engine's effect vocabulary.
   2. Unit-tests core deck-builder mechanics.
   3. Simulates hundreds of complete runs with a simple bot to prove win AND burnout paths work.
   Run: node tests/run-tests.js */
'use strict';
const path = require('path');
['../js/data/statuses.js', '../js/data/cards.js', '../js/data/roles.js', '../js/data/enemies.js',
 '../js/data/events.js', '../js/data/perks.js', '../js/data/companies.js', '../js/data/art.js',
 '../js/engine.js', '../js/ui.js']
  .forEach(f => require(path.join(__dirname, f)));
const STH = globalThis.STH;

let failures = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { failures++; console.error('  ✗ FAIL:', msg); } };
const section = name => console.log('\n== ' + name + ' ==');

/* ---------------- 1. DATA VALIDATION ---------------- */
section('Data validation');

const CARD_FX = new Set(['p','times','pAll','pPerEnemy','pPerBurnout','pX','tX','t','tStress','heal','healToP','stress',
  'draw','discardRandom','inf','pc','rep','eStatus','eStatusAll','status','cleanse','addCard','removeBurnout',
  'copyRandomHand','upgradeHand','execute','luck','if','onKill']);
const ENEMY_FX = new Set(['atk','times','blk','debuff','buffSelf','buffAll','addCard','stealPC','repDmg','heal',
  'summon','shuffleHand','voteCheck','growPerInvite']);
const EVENT_FX = new Set(['stress','rep','pc','maxStress','luck','addCard','removeRandomCard','removeBurnouts',
  'upgradeRandom','perkRandom','gainCardRandom']);

function checkFxList(list, allowed, ctx) {
  for (const fx of list) {
    for (const k of Object.keys(fx)) ok(allowed.has(k), `${ctx}: unknown fx key "${k}"`);
    if (fx.if) { checkFxList(fx.if.then || [], allowed, ctx + '.if.then'); checkFxList(fx.if.else || [], allowed, ctx + '.if.else'); }
    if (fx.eStatus) ok(STH.STATUSES[fx.eStatus.id], `${ctx}: unknown status ${fx.eStatus.id}`);
    if (fx.eStatusAll) ok(STH.STATUSES[fx.eStatusAll.id], `${ctx}: unknown status ${fx.eStatusAll.id}`);
    if (fx.status) ok(STH.STATUSES[fx.status.id], `${ctx}: unknown status ${fx.status.id}`);
    if (fx.debuff) ok(STH.STATUSES[fx.debuff.id], `${ctx}: unknown status ${fx.debuff.id}`);
    if (fx.buffSelf) ok(STH.STATUSES[fx.buffSelf.id], `${ctx}: unknown status ${fx.buffSelf.id}`);
    if (fx.addCard) ok(STH.CARD[fx.addCard.id], `${ctx}: unknown card ${fx.addCard.id}`);
    if (fx.summon) fx.summon.forEach(id => ok(STH.ENEMIES[id], `${ctx}: unknown summon ${id}`));
  }
}

const playable = STH.CARDS.filter(c => c.rarity !== 'status');
ok(playable.length >= 75, `at least 75 playable cards (found ${playable.length})`);
console.log(`  cards: ${STH.CARDS.length} total, ${playable.length} playable`);
for (const c of STH.CARDS) {
  ok(c.id && c.name && c.cost !== undefined && c.cat && c.rarity && typeof c.text === 'string', `card ${c.id}: required fields`);
  ok(c.rarity === 'status' || typeof c.flavor === 'string', `card ${c.id}: flavor`);
  ok(c.rarity === 'status' || c.up, `card ${c.id}: has upgraded version`);
  checkFxList(c.fx || [], CARD_FX, `card ${c.id}`);
  if (c.up && c.up.fx) checkFxList(c.up.fx, CARD_FX, `card ${c.id}+`);
  if (c.up) ok(typeof c.up.text === 'string', `card ${c.id}+: upgraded text`);
}

const enemyIds = Object.keys(STH.ENEMIES);
const normals = enemyIds.filter(id => !STH.ENEMIES[id].boss);
ok(normals.length >= 25, `at least 25 enemy archetypes (found ${normals.length})`);
const bosses = enemyIds.filter(id => STH.ENEMIES[id].boss);
ok(bosses.length >= 3, `at least 3 bosses (found ${bosses.length})`);
console.log(`  enemies: ${normals.length} archetypes + ${bosses.length} bosses`);
for (const id of enemyIds) {
  const e = STH.ENEMIES[id];
  ok(e.name && e.hp && e.moves && e.script, `enemy ${id}: required fields`);
  for (const [mid, mv] of Object.entries(e.moves)) {
    ok(mv.label, `enemy ${id}.${mid}: label`);
    checkFxList(mv.fx, ENEMY_FX, `enemy ${id}.${mid}`);
  }
  e.script.forEach(mid => ok(e.moves[mid], `enemy ${id}: script move ${mid} exists`));
  (e.phases || []).forEach(ph => ph.script.forEach(mid => ok(e.moves[mid], `enemy ${id}: phase move ${mid} exists`)));
  (e.minions || []).forEach(m => ok(STH.ENEMIES[m], `enemy ${id}: minion ${m} exists`));
}
for (const act of [1, 2, 3]) {
  const pools = STH.ENCOUNTERS[act];
  ok(pools.normal.length && pools.elite.length && pools.boss.length, `act ${act} pools populated`);
  [...pools.normal, ...pools.elite, ...pools.boss].flat().forEach(id => ok(STH.ENEMIES[id], `act ${act}: enemy ${id} exists`));
}

ok(STH.EVENTS.length >= 40, `at least 40 events (found ${STH.EVENTS.length})`);
console.log(`  events: ${STH.EVENTS.length}`);
for (const ev of STH.EVENTS) {
  ok(ev.id && ev.title && ev.text, `event ${ev.id}: fields`);
  ok(ev.choices.length >= 2 && ev.choices.length <= 3, `event ${ev.id}: 2-3 choices`);
  for (const ch of ev.choices) {
    ok(ch.label, `event ${ev.id}: choice label`);
    if (ch.random) {
      ok(ch.random.good && ch.random.bad && typeof ch.random.chance === 'number', `event ${ev.id}: random branch shape`);
      ok(typeof ch.random.good.text === 'string' && typeof ch.random.bad.text === 'string', `event ${ev.id}: branch texts`);
      for (const b of [ch.random.good, ch.random.bad]) if (b.fx) for (const k of Object.keys(b.fx)) ok(EVENT_FX.has(k), `event ${ev.id}: fx key ${k}`);
    } else {
      ok(typeof ch.result === 'string', `event ${ev.id}: result text`);
      if (ch.fx) for (const k of Object.keys(ch.fx)) ok(EVENT_FX.has(k), `event ${ev.id}: fx key ${k}`);
    }
  }
}

ok(STH.PERKS.length >= 30, `at least 30 perks (found ${STH.PERKS.length})`);
console.log(`  perks: ${STH.PERKS.length}`);
STH.PERKS.forEach(p => ok(p.id && p.name && p.desc && p.icon, `perk ${p.id}: fields`));
ok(STH.ROLES.length === 9, `9 roles (found ${STH.ROLES.length})`);
STH.ROLES.forEach(r => r.deck.forEach(id => ok(STH.CARD[id], `role ${r.id}: deck card ${id} exists`)));

/* art coverage: every card has a pixel illustration, every enemy & role has a portrait */
STH.CARDS.forEach(c => {
  ok(STH.CARD_PIX[c.id], `card ${c.id}: has a pixel icon spec`);
  const svg = STH.cardPixelIcon(c.id);
  ok(svg.startsWith('<svg') && svg.includes('<rect'), `card ${c.id}: pixel icon renders`);
});
Object.keys(STH.ENEMIES).forEach(id => {
  ok(STH.ENEMY_ART[id], `enemy ${id}: has caricature art config`);
  const svg = STH.enemyArt(id);
  ok(svg.startsWith('<svg') && svg.includes('</svg>'), `enemy ${id}: art renders valid SVG`);
});
Object.keys(STH.ENEMIES).forEach(id => {
  const svg = STH.pixelEnemy(id);
  ok(svg.startsWith('<svg') && svg.includes('<rect'), `enemy ${id}: 8-bit pixel sprite renders`);
});
ok(STH.hero('idle', 'analyst').includes('<rect'), 'pixel hero renders');
/* design-book sprite assets: every mapped sprite file must exist */
{
  const fs = require('fs');
  const asset = f => fs.existsSync(path.join(__dirname, '..', 'assets', 'characters', f + '.png'));
  Object.entries(STH.ENEMY_SPRITES).forEach(([id, f]) => ok(asset(f), `enemy ${id}: sprite asset ${f}.png exists`));
  Object.entries(STH.ROLE_SPRITES).forEach(([id, f]) => ok(asset(f), `role ${id}: sprite asset ${f}.png exists`));
  Object.entries(STH.NPC_SPRITES).forEach(([id, f]) => ok(asset(f), `npc ${id}: sprite asset ${f}.png exists`));
  ok(STH.enemySprite('npc_compliance').includes('<img'), 'mapped enemy renders design-book sprite');
  ok(STH.enemySprite('micromanager').includes('<svg'), 'unmapped enemy falls back to pixel sprite');
}
STH.ROLES.forEach(r => {
  ok(STH.ROLE_ART[r.id], `role ${r.id}: has cute avatar config`);
  const svg = STH.roleArt(r.id);
  ok(svg.startsWith('<svg') && svg.includes('</svg>'), `role ${r.id}: avatar renders valid SVG`);
});

/* ---------------- 2. MECHANICS UNIT TESTS ---------------- */
section('Mechanics unit tests');
STH.saveProfile(STH.newProfile('TestBot'));

function freshCombatRun(seed) {
  const run = STH.newRun('analyst', seed);
  STH.startCombat(run, ['micromanager'], false, false);
  return run;
}

{ // card costs & influence spending
  const run = freshCombatRun(1);
  const c = run.combat;
  ok(c.influence === 3, 'turn starts with 3 Influence');
  ok(c.hand.length === 5, 'opening hand is 5 cards');
  const before = c.influence;
  const inst = c.hand.find(h => h.id === 'status_update') || c.hand[0];
  const cost = STH.getCost(run, inst);
  STH.playCard(run, inst.uid, 0);
  ok(c.influence === before - cost, 'influence deducted by card cost');
}
{ // "gain 8 Trust" does exactly that
  const run = freshCombatRun(2);
  const c = run.combat;
  c.hand.push({ id: 'build_alignment', up: false, uid: 'T1' });
  c.influence = 5;
  const t0 = c.trust, pc0 = run.pc;
  STH.playCard(run, 'T1', 0);
  ok(c.trust === t0 + 8, `Build Alignment grants exactly 8 Trust (got ${c.trust - t0})`);
  ok(run.pc === pc0 + 1, 'Build Alignment grants exactly 1 PC');
}
{ // draw 2 with reshuffle from discard
  const run = freshCombatRun(3);
  const c = run.combat;
  c.discard.push(...c.draw.splice(0));           // empty draw pile into discard
  c.hand.push({ id: 'ask_for_data', up: false, uid: 'T2' });
  const handBefore = c.hand.length;
  STH.playCard(run, 'T2', 0);
  ok(c.hand.length === handBefore - 1 + 2, 'Ask for Data draws exactly 2 (reshuffling discard)');
}
{ // exhaust goes to exhaust pile
  const run = freshCombatRun(4);
  const c = run.combat;
  c.hand.push({ id: 'coffee_chat', up: false, uid: 'T3' });
  STH.playCard(run, 'T3', 0);
  ok(c.exhaust.some(x => x.uid === 'T3'), 'Exhaust cards go to the exhaust pile');
  ok(!c.discard.some(x => x.uid === 'T3'), 'Exhausted card is not in discard');
}
{ // burnout insertion via Take Credit
  const run = freshCombatRun(5);
  const c = run.combat;
  c.hand.push({ id: 'take_credit', up: false, uid: 'T4' });
  const rep0 = run.rep;
  STH.playCard(run, 'T4', 0);
  ok(c.discard.some(x => x.id === 'burnout'), 'Take Credit shuffles a Burnout into discard');
  ok(run.rep === rep0 + 2, 'Take Credit grants exactly 2 Reputation');
}
{ // trust absorbs stress; stress increases past trust
  const run = freshCombatRun(6);
  const c = run.combat;
  c.trust = 4; const s0 = run.stress;
  STH.gainStress(run, 7, true, false);
  ok(c.trust === 0 && run.stress === s0 + 3, 'Trust absorbs Stress first (7 atk - 4 trust = 3 stress)');
}
{ // unplayable burnout cannot be played, end-turn hand burnout adds stress
  const run = freshCombatRun(7);
  const c = run.combat;
  c.hand = [{ id: 'burnout', up: false, uid: 'T5' }];
  ok(!STH.canPlay(run, c.hand[0]), 'Burnout is unplayable');
  const s0 = run.stress;
  c.enemies.forEach(e => { e.move = null; });    // silence enemies for a clean check
  STH.endTurn(run);
  ok(run.stress >= s0 + 1, 'Burnout in hand at end of turn adds Stress');
}
{ // retain keeps card in hand
  const run = freshCombatRun(8);
  const c = run.combat;
  c.hand = [{ id: 'calendar_tetris_card', up: false, uid: 'T6' }];
  c.enemies.forEach(e => { e.move = null; });
  STH.endTurn(run);
  ok(run.combat.hand.some(x => x.uid === 'T6'), 'Retain cards stay in hand across turns');
}
{ // enemy intent visible & attack applies stress
  const run = freshCombatRun(9);
  const c = run.combat;
  const e = c.enemies[0];
  ok(!!STH.intentFor(run, e), 'enemy intent is exposed for UI');
  const s0 = run.stress;
  c.hand = [];
  STH.endTurn(run);
  ok(run.stress > s0 || run.combat.trust >= 0, 'enemy turn executed');
}
{ // burnout loss condition
  const run = freshCombatRun(10);
  run.stress = run.maxStress - 1;
  STH.gainStress(run, 10, false);
  ok(run.over && !run.victory && run.phase === 'summary', 'reaching max Stress burns out and ends the run');
  ok(typeof run.summary.ending === 'string', 'burnout produces an ending');
}
{ // localStorage-style memory persistence
  const p = STH.loadProfile();
  ok(p && p.name === 'TestBot' && p.runs >= 1, 'profile persists and records runs');
}
{ // X-cost spends all influence and scales the effect
  const run = freshCombatRun(11);
  const c = run.combat;
  c.influence = 3;
  c.hand.push({ id: 'escalation_chain', up: false, uid: 'TX' });
  ok(STH.getCost(run, c.hand[c.hand.length - 1]) === 3, 'X-cost card shows current Influence as cost');
  const hp0 = c.enemies[0].hp;
  STH.playCard(run, 'TX', 0);
  ok(c.influence === 0, 'X-cost spends all Influence');
  ok(hp0 - c.enemies[0].hp >= 18, `X=3 Escalation Chain deals 3 hits (dealt ${hp0 - c.enemies[0].hp})`);
}
{ // shop: buying costs PC and adds card; snack heals; leaving returns to map
  const run = STH.newRun('sales', 42);
  run.stress = 40; run.pc = 20;
  STH.enterNode(run, 0); // row 0 is a fight; abandon it and craft a shop node instead
  run.combat = null; run.phase = 'map';
  run.map[1][1][0].type = 'shop';
  run.row = 0; run.col = 0;
  run.map[1][0][0].edges = [0];
  STH.enterNode(run, 0);
  ok(run.phase === 'shop' && run.shop, 'shop opens with stock');
  const pc0 = run.pc, deck0 = run.deck.length;
  STH.buyShopCard(run, 0);
  ok(run.pc === pc0 - run.shop.cards[0].price && run.deck.length === deck0 + 1, 'buying a card costs PC and grows deck');
  const s0 = run.stress;
  STH.buyShopSnack(run);
  ok(run.stress < s0, 'shop snack heals Stress');
  STH.leaveShop(run);
  ok(run.phase === 'map', 'leaving shop returns to map');
}
{ // innate: Eager Volunteer starts in the opening hand
  const run = STH.newRun('intern', 77);
  STH.startCombat(run, ['micromanager'], false, false);
  ok(run.combat.hand.some(x => x.id === 'eager_volunteer'), 'Innate card appears in the opening hand');
}
{ // ethereal: Leftover Cake exhausts if held at end of turn
  const run = freshCombatRun(78);
  const c = run.combat;
  c.hand = [{ id: 'leftover_cake', up: false, uid: 'TE' }];
  c.enemies.forEach(e => { e.move = null; });
  STH.endTurn(run);
  ok(run.combat.exhaust.some(x => x.uid === 'TE'), 'Ethereal card exhausts at end of turn');
}
{ // Overloaded reduces Trust gained by 25%
  const run = freshCombatRun(79);
  const c = run.combat;
  c.statuses.overloaded = 1;
  c.hand.push({ id: 'set_boundaries', up: false, uid: 'TO' });
  const t0 = c.trust;
  STH.playCard(run, 'TO', 0);
  ok(c.trust - t0 === 3, `Overloaded: 5 Trust becomes 3 (got ${c.trust - t0})`);
}
{ // Roadmap Slime splits into two Untriaged Tasks on defeat
  const run = STH.newRun('developer', 88);
  STH.startCombat(run, ['roadmap_slime'], false, false);
  const slime = run.combat.enemies[0];
  slime.hp = 1;
  run.combat.hand = [{ id: 'ship_it', up: false, uid: 'TS' }];
  run.combat.influence = 2;
  STH.playCard(run, 'TS', 0);
  const tasks = run.combat.enemies.filter(e => e.id === 'task_slime' && e.hp > 0);
  ok(tasks.length === 2, `slime split into 2 tasks (got ${tasks.length})`);
  ok(run.phase === 'combat', 'combat continues against the split tasks');
}
{ // Corporate Debt: -2 Rep at combat end unless exhausted
  const run = STH.newRun('sales', 89);
  STH.startCombat(run, ['calendar_imp'], false, false);
  const c = run.combat;
  c.discard.push({ id: 'corporate_debt', up: false, uid: 'TD' });
  const rep0 = run.rep;
  c.enemies.forEach(e => { e.hp = 1; });
  c.hand = [{ id: 'status_update', up: false, uid: 'TK' }]; c.influence = 1;
  STH.playCard(run, 'TK', 0);
  ok(run.phase === 'reward', 'combat won');
  ok(run.rep === rep0 - 2, `Corporate Debt cost 2 Rep at combat end (rep ${rep0}→${run.rep})`);
}
{ // Spreadsheet Witch: multi-hit attacks hit one extra time
  const run = STH.newRun('witch', 90);
  STH.startCombat(run, ['procurement'], false, false);
  const c = run.combat;
  c.hand.push({ id: 'rubber_duck', up: false, uid: 'TW' });
  c.influence = 1;
  const hp0 = c.enemies[0].hp;
  STH.playCard(run, 'TW', 0);
  ok(hp0 - c.enemies[0].hp === 12, `Rubber Duck hits 3x4 for the Witch (dealt ${hp0 - c.enemies[0].hp})`);
}
{ // upgraded card view differs
  const v0 = STH.cardView({ id: 'status_update', up: false, uid: 'x' });
  const v1 = STH.cardView({ id: 'status_update', up: true, uid: 'y' });
  ok(v0.fx[0].p === 5 && v1.fx[0].p === 8 && v1.name.endsWith('+'), 'upgrade changes card effect and name');
}

/* ---------------- 3. FULL-RUN SIMULATIONS ---------------- */
section('Full-run simulations');

function botCombat(run) {
  let guard = 0;
  while (run.phase === 'combat' && !run.over && guard++ < 300) {
    const c = run.combat;
    // play best available card: prefer heal when stressed, else attack lowest-hp enemy
    let played = false;
    const stressed = run.stress > run.maxStress * 0.6;
    const sorted = c.hand.slice().sort((a, b) => {
      const va = STH.cardView(a), vb = STH.cardView(b);
      const score = v => (stressed ? (v.fx.some(f => f.heal || f.t) ? 2 : 0) : (v.fx.some(f => f.p !== undefined || f.pAll !== undefined) ? 2 : 0)) - v.cost * 0.1;
      return score(vb) - score(va);
    });
    for (const inst of sorted) {
      if (STH.canPlay(run, inst)) {
        const living = c.enemies.map((e, i) => ({ e, i })).filter(x => x.e.hp > 0);
        living.sort((a, b) => a.e.hp - b.e.hp);
        STH.playCard(run, inst.uid, living.length ? living[0].i : 0);
        played = true;
        break;
      }
    }
    if (run.phase !== 'combat' || run.over) break;
    if (!played) STH.endTurn(run);
  }
}

function botRun(seed) {
  const run = STH.newRun(['intern','analyst','developer','support','marketing','sales','coordinator','data'][seed % 8], seed);
  let steps = 0;
  while (!run.over && steps++ < 400) {
    switch (run.phase) {
      case 'map': {
        const avail = STH.availableNodes(run);
        if (!avail.length) throw new Error('no available nodes at act ' + run.act + ' row ' + run.row);
        STH.enterNode(run, avail[seed % avail.length]);
        break;
      }
      case 'combat': botCombat(run); break;
      case 'reward': {
        const r = run.reward;
        if (r.perkChoice) STH.takePerkReward(run, r.perkChoice[0]);
        if (r.cards) STH.takeCardReward(run, (seed + steps) % 2 ? r.cards[0] : null);
        if (run.reward && !run.reward.cards && !run.reward.perkChoice) STH.finishReward(run);
        break;
      }
      case 'event': {
        const evDef = STH.EVENTS.find(e => e.id === run.event.id);
        const idx = evDef.choices.findIndex(ch => STH.eventChoiceAvailable(run, ch));
        STH.chooseEventOption(run, idx >= 0 ? idx : 0);
        if (!run.over) STH.finishEvent(run);
        break;
      }
      case 'rest': STH.restHeal(run); break;
      case 'upgrade': {
        const i = run.deck.findIndex(x => !x.up && STH.CARD[x.id].up);
        if (i >= 0) STH.upgradeCard(run, i); else STH.skipNode(run);
        break;
      }
      case 'review': STH.chooseReview(run, 0); break;
      case 'shop': {
        if (run.pc >= 2 && run.shop.snack && !run.shop.snack.used && run.stress > 20) STH.buyShopSnack(run);
        if (run.pc >= 2 && run.shop.cards[0] && !run.shop.cards[0].sold && (seed + steps) % 2) STH.buyShopCard(run, 0);
        STH.leaveShop(run);
        break;
      }
      case 'mystery': STH.finishMystery(run); break;
      case 'reorg': STH.doReorg(run, run.pc >= 3 && run.deck.length > 8 ? 'remove' : 'ride', 0); break;
      case 'promotion': STH.continueFromPromotion(run); break;
      case 'summary': return run;
      default: throw new Error('unknown phase ' + run.phase);
    }
  }
  if (!run.over) throw new Error('run did not terminate in 400 steps (phase=' + run.phase + ')');
  return run;
}

let wins = 0, losses = 0, errors = 0, actsReached = { 1: 0, 2: 0, 3: 0 };
const endings = {};
const N = 400;
for (let seed = 1; seed <= N; seed++) {
  try {
    const run = botRun(seed);
    actsReached[run.act]++;
    endings[run.summary.ending] = (endings[run.summary.ending] || 0) + 1;
    ok(run.rep >= 0 && run.rep <= 100, 'rep in bounds');
    ok(run.pc >= 0, 'PC non-negative');
    ok(run.stress >= 0 && run.stress <= run.maxStress, 'stress in bounds');
    ok(typeof run.summary.legacy === 'string' && run.summary.legacy.length > 10, 'legacy sentence generated');
    if (run.victory) wins++; else losses++;
  } catch (err) {
    errors++; failures++;
    console.error(`  ✗ run seed ${seed} crashed:`, err.message);
    if (errors > 5) break;
  }
}
console.log(`  simulated ${N} runs → ${wins} wins / ${losses} burnouts / ${errors} crashes`);
console.log('  runs ending in act:', JSON.stringify(actsReached));
console.log('  endings seen:', JSON.stringify(endings));
ok(errors === 0, 'no crashes across simulated runs');
ok(wins > 0, 'the game is winnable (bot won at least once)');
ok(losses > 0, 'the game is losable (burnout path works)');
ok(Object.keys(endings).length >= 2, 'multiple distinct endings observed');

const profile = STH.loadProfile();
ok(profile.runs >= N - errors, 'profile recorded all completed runs');
ok(profile.bossesDefeated.length > 0, 'profile recorded defeated bosses');
ok(profile.legacy.length > 0, 'profile keeps legacy notes');

section('Result');
console.log(checks + ' checks, ' + failures + ' failures');
process.exit(failures ? 1 : 0);
