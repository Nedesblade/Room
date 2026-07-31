/* Stay the Hire — core game engine (UI-agnostic).
   All rules live here. The UI layer (ui.js) renders state and calls these methods.
   Works in the browser and in Node (for headless simulation tests). */
(function (g) {
  const STH = g.STH = g.STH || {};

  /* ---------------- RNG (seedable for tests) ---------------- */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const shuffle = (arr, rng) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];

  /* ---------------- Persistent player memory ---------------- */
  const MEM_KEY = 'stayTheHire.profile.v1';
  const storage = (function () {
    try { if (typeof localStorage !== 'undefined') { localStorage.getItem(MEM_KEY); return localStorage; } } catch (e) {}
    const mem = {}; return { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
  })();

  STH.loadProfile = function () {
    try { const raw = storage.getItem(MEM_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  };
  STH.saveProfile = function (p) { storage.setItem(MEM_KEY, JSON.stringify(p)); };
  STH.resetProfile = function () { storage.removeItem(MEM_KEY); };
  STH.newProfile = function (name) {
    return { name, created: Date.now(), runs: 0, wins: 0, burnouts: 0,
      roles: {}, bossesDefeated: [], incidents: [], endings: [],
      favoriteCards: {}, titles: [], legacy: [],
      visualMode: 'pony', cardsDiscovered: [], perksDiscovered: [], bestRun: null };
  };
  STH.setVisualMode = function (mode) {
    const p = STH.loadProfile();
    if (p) { p.visualMode = mode; STH.saveProfile(p); }
  };

  /* ---------------- Card helpers ---------------- */
  function cardView(inst) { // resolve an instance {id, up} against defs
    const def = STH.CARD[inst.id];
    const v = Object.assign({}, def, inst.up ? def.up : {});
    v.name = def.name + (inst.up ? '+' : '');
    v.id = def.id; v.up = !!inst.up; v.uid = inst.uid;
    if (v.cost === undefined) v.cost = def.cost;
    return v;
  }
  STH.cardView = cardView;
  /* Card kind (Attack / Skill / Power / Status / Curse) — derived for display */
  const POWER_CARDS = new Set(['delegate', 'task_force', 'take_notes', 'deep_work_sprint', 'deck_alignment']);
  const CURSE_CARDS = new Set(['burnout', 'pip_paperwork']);
  STH.cardKind = function (v) {
    if (v.rarity === 'status') return CURSE_CARDS.has(v.id) ? 'Curse' : 'Status';
    if (POWER_CARDS.has(v.id)) return 'Power';
    const hasAtk = (v.fx || []).some(f => f.p !== undefined || f.pAll !== undefined || f.pPerEnemy !== undefined
      || f.pPerBurnout !== undefined || f.healToP !== undefined || f.pX !== undefined);
    return hasAtk ? 'Attack' : 'Skill';
  };
  const isBurnoutCard = id => STH.BURNOUT_IDS.includes(id);
  let UID = 1;
  const mkCard = (id, up) => ({ id, up: !!up, uid: 'c' + (UID++) });

  /* ---------------- Map generation ---------------- */
  const ROWS_PER_ACT = 8;
  function genActMap(act, rng) {
    const rows = [];
    for (let r = 0; r < ROWS_PER_ACT; r++) {
      let types;
      if (r === 0) types = ['fight', 'fight', 'fight'];
      else if (r === ROWS_PER_ACT - 1) types = ['boss'];
      else if (r === ROWS_PER_ACT - 2) types = ['rest', 'rest'];
      else {
        const bag = ['fight', 'fight', 'fight', 'event', 'event', 'drama', 'network', 'rest', 'upgrade', 'review', 'reorg', 'hr', 'shop', 'mystery'];
        if (r >= 2) bag.push('elite', 'elite', 'shop');
        const width = 2 + Math.floor(rng() * 2);
        types = Array.from({ length: width }, () => pick(bag, rng));
      }
      rows.push(types.map((t, c) => ({ type: t, col: c, row: r, edges: [], done: false })));
    }
    // connect rows: each node links to nearest nodes in next row
    for (let r = 0; r < rows.length - 1; r++) {
      const cur = rows[r], nxt = rows[r + 1];
      cur.forEach((node, i) => {
        const ratio = nxt.length === 1 ? 0 : (i / Math.max(1, cur.length - 1)) * (nxt.length - 1);
        const main = Math.round(ratio);
        node.edges.push(main);
        if (rng() < 0.45) {
          const alt = clamp(main + (rng() < 0.5 ? -1 : 1), 0, nxt.length - 1);
          if (alt !== main) node.edges.push(alt);
        }
      });
      // ensure every next-row node reachable
      nxt.forEach((_, j) => {
        if (!cur.some(n => n.edges.includes(j))) pick(cur, rng).edges.push(j);
      });
    }
    return rows;
  }

  const NODE_INFO = {
    fight:  { icon: '🗣️', label: 'Meeting Encounter' },
    elite:  { icon: '⚡', label: 'Elite Political Encounter' },
    event:  { icon: '❓', label: 'Office Event' },
    drama:  { icon: '🎭', label: 'Office Drama' },
    network:{ icon: '🥂', label: 'Networking Event' },
    hr:     { icon: '📋', label: 'HR Incident' },
    rest:   { icon: '☕', label: 'Coffee Break' },
    upgrade:{ icon: '📚', label: 'Card Upgrade' },
    review: { icon: '📊', label: 'Performance Review' },
    reorg:  { icon: '🌪️', label: 'Reorg' },
    shop:   { icon: '🛒', label: 'Procurement Portal' },
    mystery:{ icon: '❔', label: 'Unmarked Calendar Hold' },
    boss:   { icon: '👑', label: 'Boss Encounter' }
  };
  STH.NODE_INFO = NODE_INFO;

  /* ---------------- Run creation ---------------- */
  STH.newRun = function (roleId, seed) {
    const rng = mulberry32(seed === undefined ? Math.floor(Math.random() * 1e9) : seed);
    const role = STH.ROLES.find(r => r.id === roleId);
    const run = {
      seed, rngState: null, rng,
      role: role.id, roleName: role.name, passive: role.passive,
      company: STH.generateCompany(rng),
      act: 1, row: 0, col: -1, // col -1 = pick any node in row 0
      map: { 1: genActMap(1, rng), 2: genActMap(2, rng), 3: genActMap(3, rng) },
      deck: role.deck.map(id => mkCard(id)),
      maxStress: role.stats.maxStress, stress: 15,
      rep: role.stats.rep, pc: role.stats.pc,
      handSize: role.stats.handSize, baseInfluence: 3,
      perks: [], luck: 0, amnesiaActUsed: 0,
      bossPool: { 1: pick(STH.ENCOUNTERS[1].boss, rng), 2: pick(STH.ENCOUNTERS[2].boss, rng), 3: pick(STH.ENCOUNTERS[3].boss, rng) },
      seenEvents: [],
      stats: { cardsPlayed: {}, combatsWon: 0, elitesWon: 0, bossesDefeated: [], incidents: [],
               moralGood: 0, moralBad: 0, stressPeak: 15, cardsAdded: 0, burnoutsGained: 0, turns: 0 },
      over: false, victory: false, ending: null,
      combat: null, event: null, phase: 'map' // map|combat|event|reward|rest|review|reorg|upgrade|summary
    };
    if (run.company.mod.luck) run.luck += run.company.mod.luck;
    return run;
  };

  const perkHas = (run, id) => run.perks.includes(id);
  STH.perkHas = perkHas;

  function acquirePerk(run, id) {
    run.perks.push(id);
    if (id === 'standing_desk') run.maxStress += 10;
    if (id === 'mentor_network') run.luck += 2;
    if (id === 'suspicious_promotion') run.deck.push({ id: 'burnout', up: false, uid: 'sp' + Date.now() });
  }
  STH.acquirePerk = acquirePerk;

  /* ---------------- Map navigation ---------------- */
  STH.availableNodes = function (run) {
    const rows = run.map[run.act];
    if (run.col === -1) return rows[0].map((n, i) => i); // start of act
    if (run.row >= rows.length - 1) return [];
    return rows[run.row][run.col].edges;
  };

  STH.enterNode = function (run, colIdx) {
    const rows = run.map[run.act];
    const nextRow = run.col === -1 ? 0 : run.row + 1;
    const node = rows[nextRow][colIdx];
    run.row = nextRow; run.col = colIdx;
    node.done = true;
    switch (node.type) {
      case 'fight': startCombat(run, pick(STH.ENCOUNTERS[run.act].normal, run.rng), false, false); break;
      case 'elite': startCombat(run, pick(STH.ENCOUNTERS[run.act].elite, run.rng), true, false); break;
      case 'boss':  startCombat(run, run.bossPool[run.act], false, true); break;
      case 'event': case 'drama': case 'network': case 'hr': startEvent(run, node.type); break;
      case 'rest':  run.phase = 'rest'; break;
      case 'upgrade': run.phase = 'upgrade'; break;
      case 'review': startReview(run); break;
      case 'reorg': run.phase = 'reorg'; break;
      case 'shop': startShop(run); break;
      case 'mystery': {
        const roll = run.rng();
        if (roll < 0.40) startEvent(run, 'event');
        else if (roll < 0.70) startCombat(run, pick(STH.ENCOUNTERS[run.act].normal, run.rng), false, false);
        else if (roll < 0.85) startShop(run);
        else { run.pc += 3; run.mysteryGift = 'You find an unattended snack budget. +3 Political Capital.'; run.phase = 'mystery'; }
        break;
      }
    }
    return node;
  };
  STH.finishMystery = function (run) { run.mysteryGift = null; run.phase = 'map'; };

  /* ---------------- Shop (Procurement Portal) ---------------- */
  function shopPrice(rarity) { return rarity === 'rare' ? 5 : rarity === 'uncommon' ? 3 : 2; }
  function startShop(run) {
    const toner = perkHas(run, 'forbidden_toner') ? 1 : 0;
    const cards = rollCardChoices(run, 4, false).map(id => ({ id, price: shopPrice(STH.CARD[id].rarity) + toner, sold: false }));
    const owned = new Set(run.perks);
    const avail = STH.PERKS.filter(p => !owned.has(p.id));
    run.shop = {
      cards,
      perk: avail.length ? { id: pick(avail, run.rng).id, price: 6, sold: false } : null,
      removal: { price: 3, used: false },
      snack: { price: 2, used: false }
    };
    run.phase = 'shop';
  }
  STH.buyShopCard = function (run, i) {
    const it = run.shop.cards[i];
    if (!it || it.sold || run.pc < it.price) return false;
    run.pc -= it.price; it.sold = true;
    run.deck.push(mkCard(it.id)); run.stats.cardsAdded++;
    return true;
  };
  STH.buyShopPerk = function (run) {
    const it = run.shop.perk;
    if (!it || it.sold || run.pc < it.price) return false;
    run.pc -= it.price; it.sold = true;
    acquirePerk(run, it.id);
    return true;
  };
  STH.buyShopRemoval = function (run, deckIdx) {
    const it = run.shop.removal;
    if (it.used || run.pc < it.price || !run.deck[deckIdx]) return false;
    run.pc -= it.price; it.used = true;
    run.deck.splice(deckIdx, 1);
    return true;
  };
  STH.buyShopSnack = function (run) {
    const it = run.shop.snack;
    if (it.used || run.pc < it.price) return false;
    run.pc -= it.price; it.used = true;
    heal(run, 12);
    return true;
  };
  STH.leaveShop = function (run) { run.shop = null; run.phase = 'map'; };

  /* ---------------- Combat setup ---------------- */
  function mkEnemy(id, rng, act) {
    const def = STH.ENEMIES[id];
    const hp = def.hp[0] + Math.floor(rng() * (def.hp[1] - def.hp[0] + 1));
    return { id, name: def.name, icon: def.icon, def,
      hp, maxHp: hp, block: 0, statuses: {}, scriptIdx: 0, phase: 0,
      usedOnce: {}, move: null };
  }

  function startCombat(run, enemyIds, elite, boss) {
    const rng = run.rng;
    let ids = enemyIds.slice();
    const c = {
      elite, boss, turn: 0,
      enemies: ids.map(id => mkEnemy(id, rng, run.act)),
      draw: shuffle(run.deck.map(x => ({ ...x })), rng),
      hand: [], discard: [], exhaust: [],
      trust: 0, influence: 0, statuses: {},
      log: [], fxq: [], flags: { firstStressReduced: false, firstAttackSoftened: false, firstRepNegated: false,
        espressoUsed: false, firstBurnoutExhausted: false, firstDebuffBoosted: false,
        prodPlayedThisTurn: 0, inboxZeroUsedTurn: -1, firstCardThisTurn: true, firstProdThisTurn: true, combatUpgrades: [] },
      intro: []
    };
    // boss minions
    const bossDef = STH.ENEMIES[ids[0]];
    if (bossDef.minions) bossDef.minions.forEach(mid => c.enemies.push(mkEnemy(mid, rng, run.act)));
    c.enemies.forEach(e => { if (e.def.intro) c.intro.push({ who: e.name, text: e.def.intro }); });
    run.combat = c; run.phase = 'combat';

    // Innate: cards marked innate surface to the top of the draw pile (opening hand)
    const innate = [];
    for (let i = c.draw.length - 1; i >= 0; i--) {
      if (cardView(c.draw[i]).innate) innate.push(...c.draw.splice(i, 1));
    }
    c.draw.push(...innate);

    // combat-start perks & company mods
    if (perkHas(run, 'slack_ghost')) c.trust += 5;
    if (run.company.mod.startTrust) c.trust += run.company.mod.startTrust;
    if (perkHas(run, 'ergo_chair')) run.stress = Math.max(0, run.stress - 2);
    if (perkHas(run, 'two_pizza') && c.enemies.length >= 3) c.trust += 6;
    if (perkHas(run, 'head_of_vibes')) c.enemies.forEach(e => addEnemyStatus(run, e, 'flustered', 1));
    if (perkHas(run, 'suspicious_promotion')) addPlayerStatus(run, 'leverage', 1);
    if (perkHas(run, 'cloud_secrets')) addEnemyStatus(run, pick(c.enemies, rng), 'paperTrail', 2);
    if (boss && perkHas(run, 'exec_sponsor')) run.pc += 3;

    chooseIntents(run);
    startPlayerTurn(run);
    if (perkHas(run, 'legacy_spreadsheet')) {
      const cands = c.hand.filter(h => !h.up && STH.CARD[h.id].up);
      if (cands.length) { const t = pick(cands, rng); t.up = true; c.flags.combatUpgrades.push(t.uid); log(run, `Legacy Spreadsheet upgrades ${STH.CARD[t.id].name} for this combat.`); }
    }
    return c;
  }
  STH.startCombat = startCombat;

  function log(run, text) { if (run.combat) run.combat.log.push(text); }
  function fx(run, ev) { if (run.combat && run.combat.fxq) run.combat.fxq.push(ev); }
  function exhaustCard(run, card) {
    const c = run.combat;
    c.exhaust.push(card);
    if (perkHas(run, 'the_shredder') && STH.CARD[card.id].rarity === 'status') {
      drawCards(run, 1);
      log(run, 'The Shredder purrs. Draw 1 card.');
    }
  }

  /* ---------------- Statuses ---------------- */
  function addPlayerStatus(run, id, n) {
    const c = run.combat;
    const def = STH.STATUSES[id];
    if (!def.buff && c.statuses.sponsored > 0) { c.statuses.sponsored--; log(run, `Your sponsor shields you from ${def.name}.`); return; }
    c.statuses[id] = (c.statuses[id] || 0) + n;
  }
  function addEnemyStatus(run, e, id, n) {
    if (e.hp <= 0) return;
    const c = run.combat;
    // Data Analyst passive: first debuff each combat +1 stack
    if (run.passive === 'insight' && !c.flags.firstDebuffBoosted && !STH.STATUSES[id].buff) {
      c.flags.firstDebuffBoosted = true; n += 1;
    }
    e.statuses[id] = (e.statuses[id] || 0) + n;
  }
  function decayStatuses(obj) {
    for (const id of Object.keys(obj.statuses || obj)) {
      const map = obj.statuses || obj;
      const def = STH.STATUSES[id];
      if (!def) continue;
      if (def.decay === 'turn') { map[id]--; if (map[id] <= 0) delete map[id]; }
      if (def.decay === 'endTurn') delete map[id];
    }
  }

  /* ---------------- Stress / damage ---------------- */
  function gainStress(run, n, isAttack, fromBoss) {
    const c = run.combat;
    if (n <= 0) return 0;
    if (isAttack && c) {
      if (fromBoss && perkHas(run, 'tenure')) n = Math.floor(n * 0.85);
      if ((c.statuses.legalRisk || 0) > 0) n = Math.floor(n * 1.5);
      if (perkHas(run, 'headphones') && !c.flags.firstStressReduced) { c.flags.firstStressReduced = true; n = Math.max(0, n - 4); }
      const absorbed = Math.min(c.trust, n);
      c.trust -= absorbed; n -= absorbed;
      if (absorbed) { log(run, `Trust absorbs ${absorbed} Stress.`); fx(run, { t: 'pblock', n: absorbed }); }
    }
    if (n > 0) {
      if (c) fx(run, { t: 'phit', n });
      run.stress += n;
      run.stats.stressPeak = Math.max(run.stats.stressPeak, run.stress);
      if (c && perkHas(run, 'espresso') && !c.flags.espressoUsed && run.stress > run.maxStress * 0.75) {
        c.flags.espressoUsed = true; run.stress = Math.max(0, run.stress - 8);
        log(run, 'Emergency Espresso kicks in: -8 Stress.');
      }
      if (c && perkHas(run, 'emergency_slide_deck') && !c.flags.slideDeckUsed && run.stress > run.maxStress * 0.5) {
        c.flags.slideDeckUsed = true; c.trust += 12;
        log(run, 'Emergency Slide Deck deployed: +12 Trust. Nobody reads it. That was never the point.');
      }
      if (run.stress >= run.maxStress) return burnOut(run);
    }
    return n;
  }
  STH.gainStress = gainStress;

  function heal(run, n) {
    const before = run.stress;
    run.stress = Math.max(0, run.stress - n);
    if (before > run.stress) fx(run, { t: 'heal', n: before - run.stress });
  }

  function changeRep(run, n, isEnemy) {
    const c = run.combat;
    if (n < 0 && isEnemy && c && perkHas(run, 'old_manager') && !c.flags.firstRepNegated) {
      c.flags.firstRepNegated = true; log(run, 'Your old manager makes a call. Reputation damage negated.'); return;
    }
    run.rep = clamp(run.rep + n, 0, 100);
  }

  function playerPressureValue(run, base) {
    const c = run.combat;
    let v = base + (c.statuses.leverage || 0) + (c.statuses.deepWork || 0);
    if (perkHas(run, 'rejected_promo') && run.rep < 40) v += 2;
    if (perkHas(run, 'forbidden_toner')) v += 1;
    if ((c.statuses.imposter || 0) > 0) v = Math.floor(v * 0.75);
    return Math.max(0, v);
  }

  function dealPressure(run, e, base, cardCat) {
    const c = run.combat;
    if (!e || e.hp <= 0) e = c.enemies.find(x => x.hp > 0);
    if (!e) return 0;
    let v = playerPressureValue(run, base);
    if (cardCat === 'Social' && perkHas(run, 'linkedin_aura')) v += 2;
    if ((e.statuses.onRecord || 0) > 0) v = Math.floor(v * 1.5);
    const absorbed = Math.min(e.block, v);
    e.block -= absorbed;
    const dmg = v - absorbed;
    e.hp -= dmg;
    fx(run, { t: 'ehit', i: c.enemies.indexOf(e), n: dmg });
    log(run, `${e.name} takes ${dmg} Pressure${absorbed ? ` (${absorbed} deflected)` : ''}.`);
    if (e.hp <= 0) onEnemyDefeated(run, e);
    checkPhases(run);
    return dmg;
  }

  function onEnemyDefeated(run, e) {
    e.hp = 0;
    log(run, `${e.name} concedes the point. Defeated.`);
    if (e.def.defeat) log(run, e.def.defeat);
    const c = run.combat;
    if (e.def.splitInto && !e._split) {
      e._split = true;
      e.def.splitInto.forEach(id => {
        if (c.enemies.filter(x => x.hp > 0).length < 4) {
          const m = mkEnemy(id, run.rng, run.act);
          c.enemies.push(m); chooseIntentFor(run, m);
          log(run, `${m.name} splits off. It was three projects all along.`);
        }
      });
    }
  }

  function checkPhases(run) {
    const c = run.combat;
    c.enemies.forEach(e => {
      if (e.hp <= 0 || !e.def.phases) return;
      const ph = e.def.phases[e.phase];
      if (ph && e.hp <= e.maxHp * ph.at) {
        e.phase++;
        e.script = ph.script; e.scriptIdx = 0;
        log(run, `${e.name}: ${ph.say}`);
        chooseIntentFor(run, e);
      }
    });
  }

  /* ---------------- Drawing ---------------- */
  function drawCards(run, n) {
    const c = run.combat;
    for (let i = 0; i < n; i++) {
      if (c.hand.length >= 10) break;
      if (!c.draw.length) {
        if (!c.discard.length) break;
        c.draw = shuffle(c.discard, run.rng); c.discard = [];
      }
      const card = c.draw.pop();
      const def = STH.CARD[card.id];
      // on-draw effects
      if (isBurnoutCard(card.id)) {
        if ((c.statuses.reorgRumor || 0) > 0) gainStress(run, 2, false);
        if (perkHas(run, 'fire_drill') && !c.flags.firstBurnoutExhausted) {
          c.flags.firstBurnoutExhausted = true; exhaustCard(run, card);
          log(run, `Fire Drill Veteran: ${def.name} exhausted on draw.`); continue;
        }
      }
      if (def.onDrawStress) {
        gainStress(run, def.onDrawStress, false);
        log(run, `${def.name} drawn: +${def.onDrawStress} Stress.`);
        if (def.exhaustOnDraw) { exhaustCard(run, card); continue; }
      }
      c.hand.push(card);
      if (run.over) return;
    }
  }

  /* ---------------- Player turn ---------------- */
  function startPlayerTurn(run) {
    const c = run.combat;
    const playedLastTurn = c.flags ? (c.flags.playedCount || 0) : 0;
    c.turn++;
    run.stats.turns++;
    c.flags.playedCount = 0;
    if ((c.statuses.aligned || 0) > 0 && playedLastTurn >= 3) {
      addPlayerStatus(run, 'inTheLoop', c.statuses.aligned);
      log(run, 'Deck Alignment holds: the slides agree. Gain In the Loop.');
    }
    c.flags.firstCardThisTurn = true;
    c.flags.firstProdThisTurn = true;
    c.flags.prodPlayedThisTurn = 0;
    c.flags.tetrisUsedThisTurn = false;
    // trust reset
    if (!(c.statuses.psychSafety > 0)) c.trust = 0;
    if (c.statuses.delegation) c.trust += c.statuses.delegation;
    if (run.passive === 'thick_skin') c.trust += 2;
    // influence
    let inf = run.baseInfluence;
    if (c.statuses.perfPlan > 0) inf -= 1;
    if (perkHas(run, 'whiteboard') && c.turn % 3 === 0) inf += 1;
    if (perkHas(run, 'meeting_free_friday') && c.turn % 5 === 0) { inf += 2; log(run, 'Meeting-Free Friday: +2 Influence. The calendar is silent. Suspiciously silent.'); }
    if (perkHas(run, 'overemployed') && c.turn === 1) inf += 1;
    c.influence = Math.max(0, inf);
    // dev passive
    if (run.passive === 'deep_focus' && c.turn % 3 === 0) addPlayerStatus(run, 'deepWork', 2);
    // standup comedian
    if (perkHas(run, 'standup_comedian')) c.enemies.filter(e => e.hp > 0).forEach(e => {
      e.hp -= 1; if (e.hp <= 0) onEnemyDefeated(run, e);
    });
    // draw
    let n = run.handSize;
    if (c.statuses.inTheLoop > 0) n += 1;
    if (c.statuses.calendarFlood > 0) n -= 1;
    if (c.turn === 1 && perkHas(run, 'dual_monitors')) n += 1;
    if (c.turn === 1 && run.passive === 'roadmap') n += 1;
    drawCards(run, Math.max(0, n));
    checkCombatEnd(run);
  }

  /* ---------------- Costs & playing cards ---------------- */
  STH.getCost = function (run, inst) {
    const c = run.combat;
    const v = cardView(inst);
    if (v.unplayable) return null;
    if (v.cost === 'X') return c.influence;   // X-cost: spends all current Influence
    let cost = v.cost;
    if (run.passive === 'first_prod_free' && v.cat === 'Productivity' && c.flags.firstProdThisTurn) cost -= 1;
    if (perkHas(run, 'calendar_tetris_perk') && c.flags.firstCardThisTurn) cost -= 1;
    if (v.cat === 'HR' && (perkHas(run, 'hr_vocab') || run.company.mod.hrDiscount)) cost -= 1;
    if ((c.statuses.paralysis || 0) > 0 && c.flags.firstCardThisTurn) cost += 1;
    return Math.max(0, cost);
  };

  STH.canPlay = function (run, inst) {
    const c = run.combat;
    const v = cardView(inst);
    if (v.unplayable) return false;
    const cost = STH.getCost(run, inst);
    if (cost > c.influence) return false;
    if (v.pcCost && run.pc < v.pcCost) return false;
    return true;
  };

  STH.playCard = function (run, uid, targetIdx) {
    const c = run.combat;
    if (!c || run.over) return false;
    const i = c.hand.findIndex(h => h.uid === uid);
    if (i < 0) return false;
    const inst = c.hand[i];
    const v = cardView(inst);
    if (!STH.canPlay(run, inst)) return false;
    const cost = STH.getCost(run, inst);
    const xVal = v.cost === 'X' ? cost : 0;
    c.influence -= cost;
    if (v.pcCost) run.pc -= v.pcCost;
    if (v.cat === 'Productivity') { c.flags.firstProdThisTurn = false; c.flags.prodPlayedThisTurn++; }
    c.flags.firstCardThisTurn = false;
    c.hand.splice(i, 1);
    run.stats.cardsPlayed[v.id] = (run.stats.cardsPlayed[v.id] || 0) + 1;
    c.flags.playedCount = (c.flags.playedCount || 0) + 1;
    if (v.moral === 'good') run.stats.moralGood++;
    if (v.moral === 'bad') run.stats.moralBad++;
    let target = c.enemies[targetIdx];
    if (!target || target.hp <= 0) target = c.enemies.find(e => e.hp > 0);
    log(run, `You play ${v.name}${xVal ? ` (X=${xVal})` : ''}.`);
    applyFxList(run, v.fx, target, v, xVal);
    if (perkHas(run, 'company_hoodie') && STH.cardKind(v) === 'Power') { c.trust += 3; log(run, 'Company Hoodie: +3 Trust. It has culture on it.'); }
    // inbox zero perk
    if (perkHas(run, 'inbox_zero') && c.flags.prodPlayedThisTurn === 3 && c.flags.inboxZeroUsedTurn !== c.turn) {
      c.flags.inboxZeroUsedTurn = c.turn; drawCards(run, 1); log(run, 'Inbox Zero Myth: draw 1.');
    }
    if (v.exhaust) exhaustCard(run, inst); else c.discard.push(inst);
    checkCombatEnd(run);
    return true;
  };

  function evalCond(run, cond, target) {
    switch (cond) {
      case 'stressHigh': return run.stress >= run.maxStress * 0.5;
      case 'repLow': return run.rep < 40;
      case 'repHigh': return run.rep >= 60;
      case 'enemyDebuffed': return target && Object.keys(target.statuses).some(id => !STH.STATUSES[id].buff);
      case 'enemyBlocked': return target && target.block > 0;
      default: return false;
    }
  }

  function gainTrust(run, n, cat) {
    const c = run.combat;
    let v = n + (c.statuses.boundaries || 0);
    if (cat === 'Social' && perkHas(run, 'linkedin_aura')) v += 2;
    if ((c.statuses.overloaded || 0) > 0) v = Math.floor(v * 0.75);
    c.trust += v;
    fx(run, { t: 'block', n: v });
  }

  function addCardsToPile(run, id, n, where, inCombat) {
    for (let k = 0; k < n; k++) {
      if (isBurnoutCard(id) && perkHas(run, 'corporate_amnesia') && run.amnesiaActUsed < run.act) {
        run.amnesiaActUsed = run.act;
        log(run, 'Corporate Amnesia: the Burnout card simply... never happened.');
        continue;
      }
      const card = mkCard(id);
      if (isBurnoutCard(id)) run.stats.burnoutsGained++;
      if (inCombat && run.combat) {
        const c = run.combat;
        if (where === 'hand' && c.hand.length < 10) c.hand.push(card);
        else if (where === 'draw') { c.draw.splice(Math.floor(run.rng() * (c.draw.length + 1)), 0, card); }
        else c.discard.push(card);
      } else {
        run.deck.push(card);
      }
    }
  }

  function applyFxList(run, fxList, target, srcCard, xVal) {
    const c = run.combat;
    for (const fx of fxList) {
      if (run.over) return;
      if (fx.pX !== undefined) { for (let k = 0; k < (xVal || 0); k++) dealPressure(run, target, fx.pX, srcCard && srcCard.cat); }
      if (fx.tX !== undefined) gainTrust(run, fx.tX * (xVal || 0), srcCard && srcCard.cat);
      if (fx.p !== undefined) {
        let times = fx.times || 1;
        if (fx.times && run.passive === 'witch_hits') times += 1;
        for (let k = 0; k < times; k++) {
          const before = target && target.hp > 0;
          dealPressure(run, target, fx.p, srcCard && srcCard.cat);
          if (before && target && target.hp <= 0) c.lastKill = true;
        }
      }
      if (fx.pAll !== undefined) c.enemies.filter(e => e.hp > 0).forEach(e => dealPressure(run, e, fx.pAll, srcCard && srcCard.cat));
      if (fx.pPerEnemy !== undefined) dealPressure(run, target, fx.pPerEnemy * c.enemies.filter(e => e.hp > 0).length, srcCard && srcCard.cat);
      if (fx.pPerBurnout !== undefined) {
        const count = [...c.draw, ...c.discard, ...c.hand].filter(x => isBurnoutCard(x.id)).length;
        dealPressure(run, target, fx.pPerBurnout * count, srcCard && srcCard.cat);
      }
      if (fx.t !== undefined) gainTrust(run, fx.t, srcCard && srcCard.cat);
      if (fx.tStress) gainTrust(run, Math.floor(run.stress / fx.tStress.div), srcCard && srcCard.cat);
      if (fx.heal !== undefined) heal(run, fx.heal);
      if (fx.healToP !== undefined) {
        const amount = Math.min(fx.healToP, run.stress);
        heal(run, amount);
        if (amount > 0) dealPressure(run, target, amount, srcCard && srcCard.cat);
      }
      if (fx.stress !== undefined) gainStress(run, fx.stress, false);
      if (fx.draw !== undefined) drawCards(run, fx.draw);
      if (fx.discardRandom) {
        for (let k = 0; k < fx.discardRandom && c.hand.length; k++) {
          const j = Math.floor(run.rng() * c.hand.length);
          c.discard.push(c.hand.splice(j, 1)[0]);
        }
      }
      if (fx.inf !== undefined) c.influence += fx.inf;
      if (fx.pc !== undefined) run.pc = Math.max(0, run.pc + fx.pc);
      if (fx.rep !== undefined) changeRep(run, fx.rep, false);
      if (fx.eStatus && target && target.hp > 0) addEnemyStatus(run, target, fx.eStatus.id, fx.eStatus.n);
      if (fx.eStatusAll) c.enemies.filter(e => e.hp > 0).forEach(e => addEnemyStatus(run, e, fx.eStatusAll.id, fx.eStatusAll.n));
      if (fx.status) addPlayerStatus(run, fx.status.id, fx.status.n);
      if (fx.cleanse) {
        for (const id of Object.keys(c.statuses)) if (!STH.STATUSES[id].buff) delete c.statuses[id];
      }
      if (fx.addCard) addCardsToPile(run, fx.addCard.id, fx.addCard.n, fx.addCard.where, true);
      if (fx.removeBurnout) {
        let left = fx.removeBurnout;
        for (const pile of [c.hand, c.discard, c.draw]) {
          for (let j = pile.length - 1; j >= 0 && left > 0; j--) {
            if (isBurnoutCard(pile[j].id)) { exhaustCard(run, pile.splice(j, 1)[0]); left--; }
          }
        }
        if (left < fx.removeBurnout) log(run, 'A Burnout card is exhausted. Bliss.');
      }
      if (fx.copyRandomHand && c.hand.length) {
        const src = pick(c.hand, run.rng);
        const copy = mkCard(src.id, src.up);
        if (c.hand.length < 10) { c.hand.push(copy); log(run, `Copied ${STH.CARD[src.id].name}.`); }
      }
      if (fx.upgradeHand) {
        const targets = c.hand.filter(h => !h.up && STH.CARD[h.id].up);
        const list = fx.upgradeHand === 'all' ? targets : (targets.length ? [pick(targets, run.rng)] : []);
        list.forEach(h => { h.up = true; c.flags.combatUpgrades.push(h.uid); });
        if (list.length) log(run, `${list.length} card(s) upgraded for this combat.`);
      }
      if (fx.execute && target && target.hp > 0 && target.hp <= target.maxHp * fx.execute) {
        log(run, `${target.name} accepts the package. Executed clause.`);
        onEnemyDefeated(run, target);
      }
      if (fx.luck) run.luck += fx.luck;
      if (fx.if) applyFxList(run, evalCond(run, fx.if.cond, target) ? fx.if.then : (fx.if.else || []), target, srcCard, xVal);
      if (fx.onKill && c.lastKill) { c.lastKill = false; applyFxList(run, [fx.onKill], target, srcCard, xVal); }
    }
  }

  /* ---------------- End turn & enemy turn ---------------- */
  STH.endTurn = function (run) {
    const c = run.combat;
    if (!c || run.over) return;
    // end-of-turn hand effects
    const keep = [];
    for (const inst of c.hand) {
      const def = STH.CARD[inst.id];
      const v = cardView(inst);
      if (def.endTurnInHand) {
        const e = def.endTurnInHand;
        if (e.stress && !(isBurnoutCard(inst.id) && perkHas(run, 'burnout_insurance'))) {
          gainStress(run, e.stress, false);
          log(run, `${def.name} nags at you: +${e.stress} Stress.`);
        }
        if (e.rep) changeRep(run, e.rep, false);
        if (run.over) return;
        if (e.exhaust) { exhaustCard(run, inst); continue; }
      }
      if (v.ethereal) { exhaustCard(run, inst); log(run, `${def.name} goes stale and exhausts.`); continue; }
      if (v.retain) { keep.push(inst); continue; }
      c.discard.push(inst);
    }
    c.hand = keep;
    if ((c.statuses.meetingFatigue || 0) > 0) {
      gainStress(run, c.statuses.meetingFatigue, false);
      log(run, `Meeting Fatigue: +${c.statuses.meetingFatigue} Stress.`);
      if (run.over) return;
    }
    decayStatuses(c);
    // overtime: very long meetings escalate so combats always resolve
    if (c.turn >= 20) {
      c.enemies.filter(e => e.hp > 0).forEach(e => { e.statuses.eLeverage = (e.statuses.eLeverage || 0) + 1; });
      if (c.turn === 20) log(run, 'The meeting is running long. Everyone grows more impatient every turn.');
    }
    // enemies act
    for (const e of c.enemies) {
      if (run.over) return;
      if (e.hp <= 0) continue;
      enemyAct(run, e);
    }
    if (run.over) return;
    c.enemies.forEach(e => { if (e.hp > 0) decayStatuses(e); });
    checkCombatEnd(run);
    if (run.phase !== 'combat') return;
    chooseIntents(run);
    startPlayerTurn(run);
  };

  function currentScript(e) { return e.script || e.def.script; }

  function chooseIntentFor(run, e) {
    const script = currentScript(e);
    let idx = e.scriptIdx % script.length;
    let moveId = script[idx];
    // skip once-used moves
    let guard = 0;
    while (e.def.moves[moveId].once && e.usedOnce[moveId] && guard++ < script.length) {
      e.scriptIdx++; idx = e.scriptIdx % script.length; moveId = script[idx];
    }
    e.move = moveId;
  }
  function chooseIntents(run) { run.combat.enemies.forEach(e => { if (e.hp > 0) chooseIntentFor(run, e); }); }

  STH.intentFor = function (run, e) {
    if (e.hp <= 0 || !e.move) return null;
    const mv = e.def.moves[e.move];
    const parts = [];
    for (const fx of mv.fx) {
      if (fx.atk !== undefined) {
        let v = fx.atk + (e.statuses.eLeverage || 0);
        if ((e.statuses.flustered || 0) > 0) v = Math.floor(v * 0.75);
        parts.push({ icon: '💢', text: `${v}${fx.times ? '×' + fx.times : ''} Stress` });
      }
      if (fx.blk !== undefined) parts.push({ icon: '🛡️', text: `${fx.blk} Deniability` });
      if (fx.debuff) parts.push({ icon: '🌀', text: STH.STATUSES[fx.debuff.id].name });
      if (fx.buffSelf || fx.buffAll) parts.push({ icon: '📈', text: 'Powering up' });
      if (fx.addCard) parts.push({ icon: '🃏', text: `Adds ${STH.CARD[fx.addCard.id].name}` });
      if (fx.stealPC) parts.push({ icon: '💰', text: `Steals ${fx.stealPC} PC` });
      if (fx.repDmg) parts.push({ icon: '📉', text: `-${fx.repDmg} Reputation` });
      if (fx.heal) parts.push({ icon: '💚', text: 'Recovering' });
      if (fx.summon) parts.push({ icon: '➕', text: 'Calling reinforcements' });
      if (fx.shuffleHand) parts.push({ icon: '🌪️', text: 'Scrambles your hand' });
      if (fx.voteCheck) parts.push({ icon: '🗳️', text: 'CALLING A VOTE' });
      if (fx.growPerInvite) parts.push({ icon: '📅', text: 'Feeds on Meeting Invites' });
    }
    return { label: mv.label, parts };
  };

  function enemyAct(run, e) {
    const c = run.combat;
    if ((e.statuses.paperTrail || 0) > 0) {
      e.hp -= e.statuses.paperTrail;
      log(run, `${e.name} loses ${e.statuses.paperTrail} Resolve to the Paper Trail.`);
      if (e.hp <= 0) { onEnemyDefeated(run, e); return; }
    }
    if ((e.statuses.buried || 0) > 0) {
      log(run, `${e.name} is buried in Legal Review and skips their turn.`);
      e.scriptIdx++;
      return;
    }
    const mv = e.def.moves[e.move];
    if (!mv) return;
    log(run, `${e.name} uses ${mv.label}.`);
    if (mv.once) e.usedOnce[e.move] = true;
    for (const fx of mv.fx) {
      if (run.over) return;
      if (fx.atk !== undefined) {
        const times = fx.times || 1;
        for (let k = 0; k < times; k++) {
          let v = fx.atk + (e.statuses.eLeverage || 0);
          if ((e.statuses.flustered || 0) > 0) v = Math.floor(v * 0.75);
          if (run.company.mod.stressCombat) v += run.company.mod.stressCombat;
          if (perkHas(run, 'meeting_declined') && !c.flags.firstAttackSoftened) { c.flags.firstAttackSoftened = true; v = Math.max(0, v - 3); }
          gainStress(run, v, true, e.def.boss);
          if (run.over) return;
        }
      }
      if (fx.blk !== undefined) e.block += fx.blk;
      if (fx.debuff) addPlayerStatus(run, fx.debuff.id, fx.debuff.n);
      if (fx.buffSelf) e.statuses[fx.buffSelf.id] = (e.statuses[fx.buffSelf.id] || 0) + fx.buffSelf.n;
      if (fx.buffAll) c.enemies.filter(x => x.hp > 0).forEach(x => { x.statuses[fx.buffAll.id] = (x.statuses[fx.buffAll.id] || 0) + fx.buffAll.n; });
      if (fx.addCard) addCardsToPile(run, fx.addCard.id, fx.addCard.n, fx.addCard.where, true);
      if (fx.stealPC) { const s = Math.min(run.pc, fx.stealPC); run.pc -= s; if (s) log(run, `${e.name} siphons ${s} Political Capital.`); }
      if (fx.repDmg) changeRep(run, -fx.repDmg, true);
      if (fx.heal) e.hp = Math.min(e.maxHp, e.hp + fx.heal);
      if (fx.summon && c.enemies.filter(x => x.hp > 0).length < 4) {
        fx.summon.forEach(id => { if (c.enemies.filter(x => x.hp > 0).length < 4) {
          const m = mkEnemy(id, run.rng, run.act); c.enemies.push(m); chooseIntentFor(run, m);
          log(run, `${m.name} joins the meeting. Of course they do.`);
        }});
      }
      if (fx.shuffleHand) {
        const n = c.hand.length;
        c.draw.push(...c.hand); c.hand = [];
        shuffle(c.draw, run.rng);
        drawCards(run, n);
        log(run, 'The org chart is redrawn. Your hand is scrambled.');
      }
      if (fx.growPerInvite) {
        const n = c.hand.filter(x => x.id === 'meeting_invite').length;
        if (n) {
          e.statuses.eLeverage = (e.statuses.eLeverage || 0) + n * fx.growPerInvite;
          log(run, `${e.name} feeds on the ${n} Meeting Invite(s) in your hand. +${n * fx.growPerInvite} Momentum.`);
        }
      }
      if (fx.voteCheck) {
        if (run.rep >= fx.voteCheck.rep) {
          e.hp -= fx.voteCheck.win;
          log(run, `THE VOTE: your Reputation (${run.rep}) carries the room. ${e.name} loses ${fx.voteCheck.win} Resolve.`);
          if (e.hp <= 0) { onEnemyDefeated(run, e); return; }
        } else {
          log(run, `THE VOTE: the room turns on you (Reputation ${run.rep} < ${fx.voteCheck.rep}). +${fx.voteCheck.lose} Stress.`);
          gainStress(run, fx.voteCheck.lose, false);
          if (run.over) return;
        }
      }
    }
    e.scriptIdx++;
  }

  /* ---------------- Combat end / rewards ---------------- */
  function checkCombatEnd(run) {
    const c = run.combat;
    if (!c || run.over) return;
    if (c.enemies.every(e => e.hp <= 0)) {
      // revert temporary combat upgrades before recording deck (deck instances were copied at start; nothing to revert on run.deck)
      const wasElite = c.elite, wasBoss = c.boss;
      run.stats.combatsWon++;
      if (wasElite) run.stats.elitesWon++;
      c.enemies.forEach(e => { if (!run.stats.enemiesSeen) run.stats.enemiesSeen = []; });
      const debts = [...c.draw, ...c.discard, ...c.hand].filter(x => x.id === 'corporate_debt').length;
      if (debts) { changeRep(run, -2 * debts, false); log(run, `Corporate Debt comes due: -${2 * debts} Reputation.`); }
      const execVis = c.statuses.execVisibility || 0;
      if (execVis) changeRep(run, execVis, false);
      const cringe = c.statuses.cringe || 0;
      if (cringe) changeRep(run, -cringe, false);
      if (wasBoss) {
        const bossName = STH.ENEMIES[run.bossPool[run.act][0]].name;
        run.stats.bossesDefeated.push(bossName);
        if (perkHas(run, 'exit_interview')) {
          const i = run.deck.findIndex(x => isBurnoutCard(x.id));
          if (i >= 0) run.deck.splice(i, 1);
        }
      }
      // after-combat perks/company
      if (perkHas(run, 'sacred_lunch')) heal(run, 6);
      if (perkHas(run, 'personal_brand')) changeRep(run, 1, false);
      if (perkHas(run, 'company_card')) run.pc += 1;
      if (run.company.mod.pcBonus) run.pc += run.company.mod.pcBonus;
      if (run.passive === 'personal_brand_boost') changeRep(run, 1, false);
      if (run.passive === 'commission') run.pc += 1;
      if (wasElite) {
        if (perkHas(run, 'golden_badge')) changeRep(run, 3, false);
        if (perkHas(run, 'stock_options')) run.pc += 2;
        if (run.company.mod.eliteRep) changeRep(run, run.company.mod.eliteRep, false);
      }
      buildRewards(run, wasElite, wasBoss);
    }
  }

  function rollCardChoices(run, count, boost) {
    const rng = run.rng;
    const pool = STH.CARDS.filter(cd => !['starter', 'status'].includes(cd.rarity));
    const choices = [];
    const usedIds = new Set();
    while (choices.length < count && usedIds.size < pool.length) {
      const r = rng();
      let rarity = 'common';
      const uc = boost ? 0.45 : 0.32, ra = boost ? 0.18 : 0.08;
      if (r < ra) rarity = 'rare'; else if (r < ra + uc) rarity = 'uncommon';
      const sub = pool.filter(cd => cd.rarity === rarity && !usedIds.has(cd.id));
      if (!sub.length) { usedIds.add('_' + rarity + usedIds.size); continue; }
      const cd = pick(sub, rng);
      usedIds.add(cd.id);
      choices.push(cd.id);
    }
    return choices;
  }

  function buildRewards(run, elite, boss) {
    const pcGain = boss ? 4 : elite ? 3 : 2;
    run.pc += pcGain;
    let nOpts = 3;
    if (perkHas(run, 'rolodex_regret')) nOpts++;
    if (run.company.mod.extraCardReward) nOpts++;
    const reward = {
      pcGain,
      cards: rollCardChoices(run, nOpts, elite || boss),
      perkChoice: null,
      bossHeal: boss ? 25 : 0
    };
    if (elite || boss) {
      const owned = new Set(run.perks);
      const avail = STH.PERKS.filter(p => !owned.has(p.id));
      if (avail.length) {
        const opts = shuffle(avail.slice(), run.rng).slice(0, 2);
        reward.perkChoice = opts.map(p => p.id);
      }
    }
    run.reward = reward;
    run.phase = 'reward';
    run.combat = null;
  }

  STH.takeCardReward = function (run, cardId) {
    if (!run.reward) return;
    if (cardId) { run.deck.push(mkCard(cardId)); run.stats.cardsAdded++; }
    run.reward.cards = null;
  };
  STH.takePerkReward = function (run, perkId) {
    if (!run.reward || !run.reward.perkChoice) return;
    if (perkId) acquirePerk(run, perkId);
    run.reward.perkChoice = null;
  };
  STH.finishReward = function (run) {
    const heal25 = run.reward && run.reward.bossHeal;
    run.reward = null;
    const rows = run.map[run.act];
    if (run.row >= rows.length - 1) {
      // boss defeated → next act or victory
      if (heal25) heal(run, heal25);
      if (run.act === 3) return winRun(run);
      run.act++; run.row = 0; run.col = -1;
      changeRep(run, 3, false);
      run.phase = 'promotion';
    } else {
      run.phase = 'map';
    }
  };

  /* ---------------- Events ---------------- */
  function fillText(run, s) {
    return s.replace(/\{company\}/g, run.company.name)
            .replace(/\{ceo\}/g, run.company.ceoName + ' (' + run.company.ceoStyle + ')')
            .replace(/\{industry\}/g, run.company.industry)
            .replace(/\{crisis\}/g, run.company.crisis)
            .replace(/\{player\}/g, (STH.loadProfile() || { name: 'you' }).name);
  }
  STH.fillText = fillText;

  function startEvent(run, flavor) {
    const unseen = STH.EVENTS.filter(e => !run.seenEvents.includes(e.id));
    const evDef = pick(unseen.length ? unseen : STH.EVENTS, run.rng);
    run.seenEvents.push(evDef.id);
    run.event = { id: evDef.id, flavor, resolved: false, result: null };
    run.phase = 'event';
  }

  STH.eventChoiceAvailable = function (run, choice) {
    if (!choice.req) return true;
    if (choice.req.pc && run.pc < choice.req.pc) return false;
    if (choice.req.rep && run.rep < choice.req.rep) return false;
    return true;
  };

  function applyEventFx(run, fx) {
    if (!fx) return;
    if (fx.stress) {
      if (fx.stress > 0) gainStress(run, fx.stress, false); else heal(run, -fx.stress);
    }
    if (fx.rep) changeRep(run, fx.rep, false);
    if (fx.pc) run.pc = Math.max(0, run.pc + fx.pc);
    if (fx.maxStress) run.maxStress += fx.maxStress;
    if (fx.luck) run.luck += fx.luck;
    if (fx.addCard) addCardsToPile(run, fx.addCard.id, fx.addCard.n || 1, 'deck', false);
    if (fx.removeRandomCard) {
      const idx = run.deck.length ? Math.floor(run.rng() * run.deck.length) : -1;
      if (idx >= 0) run.deck.splice(idx, 1);
    }
    if (fx.removeBurnouts) run.deck = run.deck.filter(x => !isBurnoutCard(x.id));
    if (fx.upgradeRandom) {
      for (let k = 0; k < fx.upgradeRandom; k++) {
        const cands = run.deck.filter(x => !x.up && STH.CARD[x.id].up);
        if (cands.length) pick(cands, run.rng).up = true;
      }
    }
    if (fx.perkRandom) {
      const owned = new Set(run.perks);
      const avail = STH.PERKS.filter(p => !owned.has(p.id));
      if (avail.length) {
        const p = pick(avail, run.rng);
        acquirePerk(run, p.id);
        run._lastPerkGained = p.name;
      }
    }
    if (fx.gainCardRandom) {
      const cands = STH.CARDS.filter(cd => cd.rarity === fx.gainCardRandom.rarity);
      if (cands.length) { run.deck.push(mkCard(pick(cands, run.rng).id)); run.stats.cardsAdded++; }
    }
  }

  STH.chooseEventOption = function (run, choiceIdx) {
    const evDef = STH.EVENTS.find(e => e.id === run.event.id);
    const choice = evDef.choices[choiceIdx];
    if (!STH.eventChoiceAvailable(run, choice)) return;
    let text;
    if (choice.random) {
      const chance = clamp(choice.random.chance + run.luck * 0.05, 0.05, 0.95);
      const good = run.rng() < chance;
      const branch = good ? choice.random.good : choice.random.bad;
      applyEventFx(run, branch.fx);
      text = branch.text;
    } else {
      applyEventFx(run, choice.fx);
      text = choice.result;
    }
    if (choice.moral === 'good') run.stats.moralGood++;
    if (choice.moral === 'bad') run.stats.moralBad++;
    if (choice.incident) run.stats.incidents.push(fillText(run, choice.incident));
    // LinkedIn Aura downside
    if (perkHas(run, 'linkedin_aura') && run.rng() < 0.25) {
      addCardsToPile(run, 'cringe_card', 1, 'deck', false);
      text += ' (LinkedIn Aura: a Cringe card slips into your deck.)';
    }
    run.event.resolved = true;
    run.event.result = fillText(run, text);
    return run.event.result;
  };
  STH.finishEvent = function (run) { run.event = null; if (!run.over) run.phase = 'map'; };

  /* ---------------- Rest / upgrade / review / reorg ---------------- */
  STH.restHeal = function (run) {
    let n = 30;
    if (perkHas(run, 'printer_whisperer')) n += 10;
    if (run.company.mod.restBonus) n += run.company.mod.restBonus;
    heal(run, n);
    run.phase = 'map';
    return n;
  };
  STH.upgradeCard = function (run, deckIdx) {
    const inst = run.deck[deckIdx];
    if (inst && !inst.up && STH.CARD[inst.id].up) { inst.up = true; run.phase = 'map'; return true; }
    return false;
  };
  STH.skipNode = function (run) { run.phase = 'map'; };

  function startReview(run) {
    let tier, text, options;
    if (run.rep >= 60) {
      tier = 'exceeds';
      text = 'Your review: “Exceeds Expectations.” Your manager takes partial credit, but the rating stands. Choose your reward.';
      options = [
        { label: 'Expanded scope (+10 max Stress capacity)', fx: { maxStress: 10 } },
        { label: 'A spot bonus in favors (+3 Political Capital)', fx: { pc: 3 } },
        { label: 'Training budget (upgrade 2 random cards)', fx: { upgradeRandom: 2 } } ];
    } else if (run.rep >= 40) {
      tier = 'meets';
      text = 'Your review: “Meets Expectations.” The rating that means everything and nothing. Choose your consolation.';
      options = [
        { label: 'Solid feedback (+3 Reputation)', fx: { rep: 3 } },
        { label: 'A quiet week (heal 10 Stress)', fx: { stress: -10 } } ];
    } else {
      tier = 'below';
      text = 'Your review: “Needs Development.” A Performance Plan folder materializes. It has your name in a font you’ve never seen.';
      options = [
        { label: 'Fight the rating (+4 Reputation, +6 Stress)', fx: { rep: 4, stress: 6 } },
        { label: 'Accept the PIP paperwork (a PIP card enters your deck, +2 PC sympathy)', fx: { addCard: { id: 'pip_paperwork', n: 1 }, pc: 2 } } ];
    }
    run.review = { tier, text, options };
    run.phase = 'review';
  }
  STH.chooseReview = function (run, idx) {
    const opt = run.review.options[idx];
    applyEventFx(run, opt.fx);
    run.review = null;
    if (!run.over) run.phase = 'map';
  };

  STH.reorgOptions = function (run) {
    return [
      { id: 'remove', label: 'Call in a favor: remove a card from your deck', cost: 3, needsCard: true },
      { id: 'transform', label: 'Embrace chaos: transform a random card into a random card', cost: 0 },
      { id: 'ride', label: 'Keep your head down (+1 Political Capital)', cost: 0 } ];
  };
  STH.doReorg = function (run, optId, deckIdx) {
    if (optId === 'remove') {
      if (run.pc < 3 || deckIdx === undefined || !run.deck[deckIdx]) return false;
      run.pc -= 3;
      run.deck.splice(deckIdx, 1);
    } else if (optId === 'transform') {
      if (!run.deck.length) return false;
      const idx = Math.floor(run.rng() * run.deck.length);
      const pool = STH.CARDS.filter(cd => !['status'].includes(cd.rarity) && cd.id !== run.deck[idx].id);
      run.deck[idx] = mkCard(pick(pool, run.rng).id);
    } else if (optId === 'ride') {
      run.pc += 1;
    }
    run.phase = 'map';
    return true;
  };

  /* ---------------- Win / lose / summary ---------------- */
  function mostUsedCard(run) {
    let best = null, n = 0;
    for (const [id, k] of Object.entries(run.stats.cardsPlayed)) {
      if (k > n) { n = k; best = id; }
    }
    return best ? { id: best, name: STH.CARD[best].name, n } : null;
  }

  function legacySentence(run, ending) {
    const mu = mostUsedCard(run);
    const bits = [
      `${ending} at ${run.company.name}`,
      mu ? `armed mostly with “${mu.name}”` : 'armed with nothing but vibes',
      run.stats.moralBad > run.stats.moralGood ? 'and a flexible moral compass' :
      run.stats.moralGood > run.stats.moralBad ? 'and a suspiciously intact soul' : 'and perfect moral ambiguity'
    ];
    return bits.join(', ') + '.';
  }

  function endingFor(run, won) {
    if (!won) {
      if (run.rep >= 60) return 'Laid Off With Excellent References';
      const cringes = run.deck.filter(x => x.id === 'cringe_card').length;
      if (cringes >= 2) return 'Became LinkedIn Famous for the Wrong Reason';
      return 'Burned Out';
    }
    if (run.stats.moralBad >= 4 && run.stats.moralBad > run.stats.moralGood && run.rep < 45) return 'Became the Villain';
    if (run.stats.moralGood >= 4 && run.rep >= 60) return 'Beloved Team Protector';
    if (run.rep >= 75) return 'Stayed the Hire';
    if (run.pc >= 12) return 'Founded a Startup';
    if (run.stress <= run.maxStress * 0.25) return 'Quietly Became Essential';
    if (run.rep < 40) return 'Escaped to a Competitor';
    return 'Survived the Reorg';
  }

  function buildSummary(run, won) {
    const ending = endingFor(run, won);
    const mu = mostUsedCard(run);
    const incident = run.stats.incidents.length ? pick(run.stats.incidents, run.rng) : 'kept a suspiciously low profile';
    let moral = 'Stayed neutral in every war that mattered.';
    if (run.stats.moralGood > run.stats.moralBad) moral = 'Protected people when it cost you something.';
    if (run.stats.moralBad > run.stats.moralGood) moral = 'Chose the ladder over the people on it. Repeatedly.';
    return {
      ending, won,
      role: run.roleName, company: run.company.name, culture: run.company.culture,
      rep: run.rep, stress: run.stress, maxStress: run.maxStress, pc: run.pc,
      combatsWon: run.stats.combatsWon, bosses: run.stats.bossesDefeated.slice(),
      mostUsed: mu, moral, incident,
      legacy: legacySentence(run, ending),
      act: run.act
    };
  }

  function updateMeta(run, summary) {
    const p = STH.loadProfile();
    if (!p) return;
    p.runs++;
    if (summary.won) p.wins++; else if (summary.ending === 'Burned Out') p.burnouts++;
    p.roles[run.roleName] = (p.roles[run.roleName] || 0) + 1;
    summary.bosses.forEach(b => { if (!p.bossesDefeated.includes(b)) p.bossesDefeated.push(b); });
    if (summary.incident && summary.incident !== 'kept a suspiciously low profile') {
      p.incidents.push(summary.incident);
      if (p.incidents.length > 20) p.incidents.shift();
    }
    p.endings.push(summary.ending);
    if (summary.mostUsed) p.favoriteCards[summary.mostUsed.name] = (p.favoriteCards[summary.mostUsed.name] || 0) + summary.mostUsed.n;
    p.legacy.push(summary.legacy);
    if (p.legacy.length > 10) p.legacy.shift();
    // discovery + best-run memory (guard for profiles saved by older versions)
    p.cardsDiscovered = p.cardsDiscovered || [];
    p.perksDiscovered = p.perksDiscovered || [];
    new Set([...run.deck.map(x => x.id), ...Object.keys(run.stats.cardsPlayed)]).forEach(id => {
      if (!p.cardsDiscovered.includes(id)) p.cardsDiscovered.push(id);
    });
    run.perks.forEach(id => { if (!p.perksDiscovered.includes(id)) p.perksDiscovered.push(id); });
    const score = r => (r.won ? 1000 : 0) + r.act * 100 + r.row;
    const thisRun = { won: summary.won, act: run.act, row: run.row, ending: summary.ending, role: run.roleName };
    if (!p.bestRun || score(thisRun) > score(p.bestRun)) p.bestRun = thisRun;
    // titles
    const grant = t => { if (!p.titles.includes(t)) p.titles.push(t); };
    if (p.wins >= 1) grant('Survivor');
    if (p.burnouts >= 1) grant('Cautionary Tale');
    if (summary.won && run.role === 'intern') grant('The Anomaly');
    if (summary.bosses.some(b => b.includes('Board'))) grant('Boardroom Slayer');
    if (p.runs >= 5) grant('Serial Careerist');
    if (summary.ending === 'Became the Villain') grant('The Villain Arc');
    if (summary.ending === 'Beloved Team Protector') grant('Union Rep (Honorary)');
    if (p.wins >= 3) grant('C-Suite Material');
    STH.saveProfile(p);
  }

  function winRun(run) {
    run.over = true; run.victory = true;
    run.summary = buildSummary(run, true);
    updateMeta(run, run.summary);
    run.phase = 'summary';
    return run.summary;
  }
  function burnOut(run) {
    run.stress = run.maxStress;
    run.over = true; run.victory = false;
    run.summary = buildSummary(run, false);
    updateMeta(run, run.summary);
    run.phase = 'summary';
    return run.summary;
  }

  STH.continueFromPromotion = function (run) { run.phase = 'map'; };
  STH._internals = { startCombat, startPlayerTurn, applyFxList, enemyAct, gainStress, mulberry32, genActMap };
})(typeof window !== 'undefined' ? window : globalThis);
