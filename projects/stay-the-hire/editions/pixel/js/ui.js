/* Stay the Hire — UI layer. Renders engine state, wires mouse input. */
(function (g) {
  const STH = g.STH;
  if (typeof document === 'undefined') return; // headless (tests)

  const $ = sel => document.querySelector(sel);
  const app = () => $('#app');
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const S = { screen: 'menu', run: null, targeting: null, upgradeCtx: null, removeCtx: null, shopRemove: false, busy: false,
    mode: (STH.loadProfile() && STH.loadProfile().visualMode) || 'pony' };
  document.body.dataset.theme = S.mode;

  function setMode(mode) {
    S.mode = mode;
    document.body.dataset.theme = mode;
    STH.setVisualMode(mode);
  }

  /* keyword highlighting in card text */
  const KEYWORDS = ['Political Capital', 'Psychological Safety', 'On the Record', 'Paper Trail', 'In the Loop',
    'Deep Work', 'Deniability', 'Exhaust', 'Retain', 'Pressure', 'Trust', 'Stress', 'Influence',
    'Reputation', 'Burnout', 'Flustered', 'Leverage', 'Resolve', 'Unplayable'];
  const KW_RE = new RegExp('(' + KEYWORDS.join('|') + ')', 'g');
  const hl = s => esc(s).replace(KW_RE, '<b class="kw">$1</b>');

  /* ---------- tooltips ---------- */
  const tipEl = document.createElement('div');
  tipEl.id = 'tooltip'; tipEl.style.display = 'none';
  document.body.appendChild(tipEl);
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-tip]');
    if (!t) { tipEl.style.display = 'none'; return; }
    tipEl.innerHTML = t.dataset.tip;
    tipEl.style.display = 'block';
    const r = t.getBoundingClientRect();
    tipEl.style.left = Math.min(window.innerWidth - 280, Math.max(8, r.left)) + 'px';
    tipEl.style.top = (r.bottom + 8 + tipEl.offsetHeight > window.innerHeight ? r.top - tipEl.offsetHeight - 8 : r.bottom + 8) + 'px';
  });

  const statusTip = (id, n) => {
    const d = STH.STATUSES[id];
    return `<b>${d.icon} ${esc(d.name)}</b><br>${esc(d.desc.replace(/\{n\}/g, n))}`;
  };

  /* ---------- resource bar ---------- */
  function resourceBar(run) {
    const H = STH.RESOURCE_HELP;
    const pct = Math.round(100 * run.stress / run.maxStress);
    return `<div class="resbar">
      <div class="res stress" data-tip="${esc(H.stress)}">
        <span class="lbl">🔥 Stress</span>
        <div class="meter"><div class="fill ${pct > 70 ? 'danger' : pct > 45 ? 'warn' : ''}" style="width:${pct}%"></div></div>
        <span class="val">${run.stress}/${run.maxStress}</span>
      </div>
      <div class="res" data-tip="${esc(H.rep)}">⭐ <b>${run.rep}</b> Rep</div>
      <div class="res" data-tip="${esc(H.pc)}">🎩 <b>${run.pc}</b> PC</div>
      <div class="res comp" data-tip="Company: ${esc(run.company.culture)}. ${esc(run.company.modText)}">🏢 ${esc(run.company.name)}</div>
      <div class="res act">Act ${run.act}/3 · ${['', 'Entry-Level Chaos', 'Middle Management Politics', 'Executive Survival'][run.act]}</div>
    </div>`;
  }

  /* ---------- card rendering ---------- */
  const CAT_CLASS = { Productivity: 'cat-prod', Politics: 'cat-pol', Social: 'cat-soc', HR: 'cat-hr', Sabotage: 'cat-sab', Recovery: 'cat-rec', Executive: 'cat-exec', Status: 'cat-status' };
  const CAT_CHROME = {
    Productivity: '📊 spreadsheet scrap', Politics: '✉️ RE: RE: FWD:', Social: '💬 #random',
    HR: '📋 form HR-7.4.2', Sabotage: '🗒️ do not forward', Recovery: '🧸 self care™', Executive: '📽️ CONFIDENTIAL slide', Status: '⚠️ this is fine'
  };
  function cardHTML(run, inst, opts = {}) {
    const v = STH.cardView(inst);
    const cost = run && run.combat && !v.unplayable ? STH.getCost(run, inst) : v.cost;
    const playable = opts.inHand && run.combat && STH.canPlay(run, inst);
    const flags = [v.pcCost ? `${v.pcCost} PC` : ''].filter(Boolean).join(' · ');
    const icon = STH.CARD_ICONS[v.id] || '🗂️';
    const kind = STH.cardKind(v);
    return `<div class="card kind-${kind.toLowerCase()} rarity-${v.rarity} ${CAT_CLASS[v.cat] || ''} ${v.up ? 'upgraded' : ''} ${opts.inHand ? (playable ? 'playable' : 'unplayable') : ''} ${opts.small ? 'small' : ''}"
        ${opts.inHand ? `data-play="${v.uid}"` : ''} ${opts.pick !== undefined ? `data-pick="${opts.pick}"` : ''}>
      <div class="chrome">${CAT_CHROME[v.cat] || ''}</div>
      <span class="ccost" data-tip="${esc(STH.RESOURCE_HELP.influence)}">${v.unplayable ? '✕' : cost}</span>
      <div class="cname">${esc(v.name)}</div>
      <div class="cart"><span class="cicon">${icon}</span></div>
      <div class="ctypeline">${kind} · ${esc(v.cat)}${v.rarity === 'rare' ? ' · ✦' : v.rarity === 'uncommon' ? ' · ◆' : ''}</div>
      <div class="ctext">${hl(v.text)}</div>
      ${flags ? `<div class="cflags">${esc(flags)}</div>` : ''}
      ${v.flavor ? `<div class="cflavor">${esc(v.flavor)}</div>` : ''}
    </div>`;
  }

  function statusChips(statuses) {
    return Object.entries(statuses).map(([id, n]) => {
      const d = STH.STATUSES[id];
      return d ? `<span class="chip ${d.buff ? 'buff' : 'debuff'}" data-tip="${esc(statusTip(id, n))}">${d.icon}${n}</span>` : '';
    }).join('');
  }

  /* ---------- screens ---------- */
  function render() {
    const run = S.run;
    let html = '';
    if (S.screen === 'menu') html = menuScreen();
    else if (S.screen === 'name') html = nameScreen();
    else if (S.screen === 'file') html = fileScreen();
    else if (S.screen === 'credits') html = creditsScreen();
    else if (S.screen === 'roles') html = roleScreen();
    else if (run) {
      const inner =
        run.phase === 'map' ? mapScreen(run) :
        run.phase === 'combat' ? combatScreen(run) :
        run.phase === 'reward' ? rewardScreen(run) :
        run.phase === 'event' ? eventScreen(run) :
        run.phase === 'rest' ? restScreen(run) :
        run.phase === 'upgrade' ? upgradeScreen(run, 'Pick a card to upgrade', 'upgrade') :
        run.phase === 'review' ? reviewScreen(run) :
        run.phase === 'shop' ? shopScreen(run) :
        run.phase === 'mystery' ? mysteryScreen(run) :
        run.phase === 'reorg' ? reorgScreen(run) :
        run.phase === 'promotion' ? promotionScreen(run) :
        run.phase === 'summary' ? summaryScreen(run) : '';
      html = `${resourceBar(run)}<div class="stage">${inner}</div>`;
    }
    app().innerHTML = html;
    const logBox = $('#combatlog');
    if (logBox) logBox.scrollTop = logBox.scrollHeight;
  }

  function menuScreen() {
    const p = STH.loadProfile();
    const hello = p ? `<p class="greet">Welcome back, <b>${esc(p.name)}</b>. ${p.legacy.length ? 'Last time: ' + esc(p.legacy[p.legacy.length - 1]) : 'Your personnel file is regrettably empty.'}</p>` : '';
    const titles = p && p.titles.length ? `<p class="titles">🏅 ${p.titles.map(esc).join(' · ')}</p>` : '';
    return `<div class="menu">
      <div class="deco-sticky s1">to do:<br>□ survive<br>□ snacks</div>
      <div class="deco-sticky s2">“quick sync”<br>☠️ 19 ppl</div>
      <div class="heroholder menuhero">${STH.hero('idle')}</div>
      <div class="logo"><span class="stamp">STAY</span><span class="the">the</span><span class="stamp s">HIRE</span></div>
      <p class="subtitle">✂️ a reorguelike deck-builder ✂️</p>
      <p class="author">Author: nedesblade</p>
      ${hello}${titles}
      <div class="menu-btns">
        <button class="btn primary" data-act="newrun">🪪 ${p ? 'Start a New Career' : 'Begin Your First Career'}</button>
        ${p ? '<button class="btn" data-act="file">📁 Personnel File</button>' : ''}
        <button class="btn" data-act="credits">ℹ️ Credits / About</button>
        ${p ? '<button class="btn danger small" data-act="wipe">🗑️ Shred Personnel File</button>' : ''}
      </div>
      <div class="modeswitch">
        <span class="fineprint">Visual mode:</span>
        <button class="btn small ${S.mode === 'pony' ? 'primary' : ''}" data-act="mode-pony">🧸 Office Pony</button>
        <button class="btn small ${S.mode === 'spire' ? 'primary' : ''}" data-act="mode-spire">🗼 Spire Satire</button>
      </div>
      <p class="menu-foot">Survive meetings. Dodge reorgs. Adopt a career like it’s a small doomed pet. Do not, under any circumstances, burn out.</p>
    </div>`;
  }

  function nameScreen() {
    return `<div class="menu">
      <div class="logo small"><span class="stamp">STAY</span><span class="the">the</span><span class="stamp s">HIRE</span></div>
      <div class="panel name-panel">
        <h2>📋 New Hire Paperwork</h2>
        <p>HR requires exactly one field. The rest of the form was lost in a migration.</p>
        <label for="playername">Legal-ish name</label>
        <input id="playername" maxlength="24" placeholder="e.g. Alex the Unbreakable" autocomplete="off">
        <button class="btn primary" data-act="savename">Sign & Accept Fate</button>
        <p class="fineprint">Stored only in your browser (localStorage). We are legally a game, not HR.</p>
      </div>
    </div>`;
  }

  function fileScreen() {
    const p = STH.loadProfile();
    if (!p) return menuScreen();
    const fav = Object.entries(p.favoriteCards).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const roles = Object.entries(p.roles).map(([r, n]) => `${esc(r)} ×${n}`).join(', ') || 'None yet';
    return `<div class="menu wide">
      <div class="panel file-panel">
        <div class="heroholder filehero">${STH.hero('idle')}</div>
        <h2>📁 Personnel File: ${esc(p.name)}</h2>
        <div class="file-grid">
          <div><b>Careers attempted</b><span>${p.runs}</span></div>
          <div><b>Careers survived</b><span>${p.wins}</span></div>
          <div><b>Burnouts</b><span>${p.burnouts}</span></div>
          <div><b>Roles played</b><span>${roles}</span></div>
        </div>
        ${p.bestRun ? `<p><b>Best run:</b> ${p.bestRun.won ? 'WON' : 'reached Act ' + p.bestRun.act + ', step ' + (p.bestRun.row + 1)} as ${esc(p.bestRun.role)} — “${esc(p.bestRun.ending)}”</p>` : ''}
        <p><b>Discovered:</b> ${(p.cardsDiscovered || []).length} cards · ${(p.perksDiscovered || []).length} perks</p>
        <h3>🏅 Career Titles</h3>
        <p>${p.titles.length ? p.titles.map(esc).join(' · ') : 'None. HR describes you as “new”.'}</p>
        <h3>👑 Bosses Defeated</h3>
        <p>${p.bossesDefeated.length ? p.bossesDefeated.map(esc).join(' · ') : 'The org chart remains undefeated.'}</p>
        <h3>🃏 Most-Trusted Cards</h3>
        <p>${fav.length ? fav.map(([n, k]) => `${esc(n)} (${k} plays)`).join(' · ') : 'No signature move yet.'}</p>
        <h3>📰 Incident Reports</h3>
        <ul class="incidents">${p.incidents.length ? p.incidents.slice(-8).map(i => `<li>You once ${esc(i)}.</li>`).join('') : '<li>Nothing on record. Suspicious in itself.</li>'}</ul>
        <h3>🪦 Career Endings</h3>
        <p>${p.endings.length ? p.endings.slice(-8).map(esc).join(' · ') : '—'}</p>
        <h3>📜 Legacy Notes</h3>
        <ul class="incidents">${p.legacy.length ? p.legacy.map(l => `<li>${esc(l)}</li>`).join('') : '<li>—</li>'}</ul>
        <button class="btn" data-act="menu">← Back</button>
      </div>
    </div>`;
  }

  function creditsScreen() {
    return `<div class="menu">
      <div class="panel">
        <h2>Stay the Hire</h2>
        <p class="subtitle">A Reorguelike Deck-Builder</p>
        <p><b>Author: nedesblade</b></p>
        <p>All companies, characters, incidents and Slack threads in this game are fictional.
           Any resemblance to your actual workplace is a coincidence, a tragedy, or both.</p>
        <p>Built as a browser game: HTML, CSS and JavaScript. Your career memory lives in your browser’s localStorage — no accounts, no servers, no telemetry.</p>
        <p class="fineprint">Inspired by the structure of roguelike deck-builders and the emotional texture of quarterly planning.</p>
        <button class="btn" data-act="menu">← Back</button>
      </div>
    </div>`;
  }

  function roleScreen() {
    const co = S.pendingCompany;
    return `<div class="menu wide">
      <div class="panel company-panel">
        <h2>🏢 Your New Employer: ${esc(co.name)}</h2>
        <p>${esc(co.size)} in <b>${esc(co.industry)}</b> — ${esc(co.culture)}.</p>
        <p>CEO: <b>${esc(co.ceoName)}</b>, ${esc(co.ceoStyle)}. Health: ${esc(co.health)}.
           Bureaucracy: ${esc(co.bureaucracy)} · Politics: ${esc(co.politics)} · Innovation: ${esc(co.innovation)}.</p>
        <p>Remote policy: ${esc(co.remote)}. Current crisis: <b>${esc(co.crisis)}</b>.</p>
        <p class="mod">Company modifier: ${esc(co.modText)}</p>
        <button class="btn small" data-act="reroll">🎲 Interview Elsewhere (reroll company)</button>
      </div>
      <div class="heroholder rolehero">${STH.hero('idle')}</div>
      <h2 class="pickrole">Choose your starting role</h2>
      <div class="roles">
        ${STH.ROLES.map(r => `<div class="role" data-role="${r.id}">
          <div class="rportrait">${STH.roleArt(r.id)}</div>
          <div class="rname">${r.icon} ${esc(r.name)}</div>
          <div class="rpass">${esc(r.passiveText)}</div>
          <div class="rblurb">${esc(r.blurb)}</div>
        </div>`).join('')}
      </div>
      <button class="btn" data-act="menu">← Back</button>
    </div>`;
  }

  function mapScreen(run) {
    const rows = run.map[run.act];
    const avail = STH.availableNodes(run);
    const rowsHtml = rows.map((row, r) => {
      const cells = row.map((node, cIdx) => {
        const info = STH.NODE_INFO[node.type];
        const isCurrent = r === run.row && cIdx === run.col;
        const isAvail = (run.col === -1 ? r === 0 : r === run.row + 1) && avail.includes(cIdx);
        const done = node.done && !isCurrent;
        return `<div class="mapnode ${isAvail ? 'avail' : ''} ${isCurrent ? 'current' : ''} ${done ? 'done' : ''} ${node.type}"
            ${isAvail ? `data-node="${cIdx}"` : ''} data-tip="<b>${info.icon} ${esc(info.label)}</b>">
          <span class="nicon">${info.icon}</span><span class="nlabel">${esc(info.label)}</span>
        </div>`;
      }).join('');
      return `<div class="maprow">${cells}</div>`;
    }).join('');
    return `<div class="mapwrap">
      <h2 class="acttitle">📈 Career Ladder — Act ${run.act}: ${['', 'Entry-Level Chaos', 'Middle Management Politics', 'Executive Survival'][run.act]}</h2>
      <p class="maphint">Click a wiggling step to proceed. The ladder only goes up. The ladder is lying.</p>
      <div class="orgmap">${rowsHtml}</div>
      <div class="mapside">
        <button class="btn small" data-act="viewdeck">🗂️ View Deck (${run.deck.length})</button>
        <span class="perkrow">${run.perks.map(id => { const p = STH.PERK[id]; return `<span class="chip perk" data-tip="<b>${p.icon} ${esc(p.name)}</b><br>${esc(p.desc)}">${p.icon}</span>`; }).join('') || '<span class="fineprint">No perks yet.</span>'}</span>
        <button class="btn small danger" data-act="abandon">Resign (abandon run)</button>
      </div>
      <div id="deckmodal"></div>
    </div>`;
  }

  function enemyHTML(run, e, idx) {
    const intent = STH.intentFor(run, e);
    const hpPct = Math.round(100 * e.hp / e.maxHp);
    const targetable = S.targeting && e.hp > 0;
    return `<div class="enemy ${e.hp <= 0 ? 'dead' : ''} ${targetable ? 'targetable' : ''}" data-enemy="${idx}">
      ${e.hp > 0 && intent ? `<div class="intent" data-tip="<b>Intent: ${esc(intent.label)}</b>">${intent.parts.map(p => `<span>${p.icon} ${esc(p.text)}</span>`).join('')}</div>` : '<div class="intent gone">📦 desk packed</div>'}
      <div class="eportrait">${STH.enemyArt(e.id)}</div>
      <div class="ename">${esc(e.name)}</div>
      <div class="ehp"><div class="meter"><div class="fill" style="width:${hpPct}%"></div></div>
        <span data-tip="${esc(STH.RESOURCE_HELP.resolve)}">${e.hp}/${e.maxHp}${e.block ? ` 🛡️${e.block}` : ''}</span></div>
      <div class="chips">${statusChips(e.statuses)}</div>
    </div>`;
  }

  function combatScreen(run) {
    const c = run.combat;
    if (c.boss && !c._introShown) {
      const boss = c.enemies[0];
      return `<div class="bossintro">
        <div class="panel bosspanel">
          <div class="bossport">${STH.enemyArt(boss.id)}</div>
          <h2>${esc(boss.name)}</h2>
          ${c.intro.map(i => `<p class="bossline">${esc(i.text)}</p>`).join('')}
          <button class="btn primary" data-act="bossgo">Enter the Meeting ▸</button>
        </div>
      </div>`;
    }
    const hp = run.maxStress - run.stress;
    const hpPct = Math.round(100 * hp / run.maxStress);
    return `<div class="combat">
      <div class="arena">
        <div class="playerpane heroside">
          <div class="heroholder">${STH.hero(hp <= 0 ? 'ko' : 'idle', run.role)}</div>
          <div class="pname">${esc(run.roleName)}</div>
          <div class="hpbar" data-tip="${esc(STH.RESOURCE_HELP.stress)}">
            <div class="meter"><div class="fill ${hpPct < 30 ? 'danger' : hpPct < 55 ? 'warn' : ''}" style="width:${hpPct}%"></div></div>
            <span class="hpnum">❤️ ${hp}/${run.maxStress}</span>
          </div>
          <div class="pstat" data-tip="${esc(STH.RESOURCE_HELP.trust)}">🛡️ <b>${c.trust}</b> Block (Trust)</div>
          <div class="pstat" data-tip="${esc(STH.RESOURCE_HELP.influence)}">⚡ <b>${c.influence}</b> Energy (Influence)</div>
          <div class="chips">${statusChips(c.statuses)}</div>
        </div>
        <div class="vs">⚔️</div>
        <div class="enemies">${c.enemies.map((e, i) => enemyHTML(run, e, i)).join('')}</div>
      </div>
      ${S.targeting ? `<div class="targethint">Choose a target for <b>${esc(STH.cardView(c.hand.find(h => h.uid === S.targeting)).name)}</b> — or click the card again to cancel.</div>` : ''}
      <div class="battlerow">
        <div class="controlpane">
          <div class="piles">
            <span data-tip="Draw pile — reshuffles from discard when empty.">📚 ${c.draw.length}</span>
            <span data-tip="Discard pile.">🗑️ ${c.discard.length}</span>
            <span data-tip="Exhaust pile — cards removed for this combat.">🕳️ ${c.exhaust.length}</span>
            <span data-tip="Turn number.">⏱️ T${c.turn}</span>
          </div>
          <button class="btn primary" data-act="endturn">End Turn ▸</button>
        </div>
        <div id="combatlog" class="log">${c.log.slice(-40).map(l => `<div>${esc(l)}</div>`).join('')}</div>
      </div>
      <div class="hand">${c.hand.map(h => cardHTML(run, h, { inHand: true })).join('') || '<div class="fineprint">Hand empty. The silence of an achieved inbox.</div>'}</div>
    </div>`;
  }

  function rewardScreen(run) {
    const r = run.reward;
    return `<div class="panel reward">
      <h2>🏆 Encounter Survived</h2>
      <p>+${r.pcGain} Political Capital banked.${r.bossHeal ? ' Boss defeated — you will recover 25 Stress on promotion.' : ''}</p>
      ${r.perkChoice ? `<h3>Choose a perk</h3><div class="perkopts">
        ${r.perkChoice.map(id => { const p = STH.PERK[id]; return `<div class="perkopt" data-perk="${id}"><span class="picon">${p.icon}</span><b>${esc(p.name)}</b><p>${esc(p.desc)}</p></div>`; }).join('')}
        <button class="btn small" data-act="skipperk">Skip perk</button></div>` : ''}
      ${r.cards ? `<h3>Add a card to your deck</h3><div class="cardopts">
        ${r.cards.map(id => cardHTML(run, { id, up: false, uid: 'reward' + id }, { pick: id })).join('')}</div>
        <button class="btn small" data-act="skipcard">Skip card</button>` : ''}
      ${!r.cards && !r.perkChoice ? `<button class="btn primary" data-act="continue">Continue ▸</button>` : ''}
    </div>`;
  }

  function eventScreen(run) {
    const evDef = STH.EVENTS.find(e => e.id === run.event.id);
    if (run.event.resolved) {
      return `<div class="panel event">
        <h2>${esc(evDef.title)}</h2>
        <p class="result">${esc(run.event.result)}</p>
        <button class="btn primary" data-act="eventdone">Continue ▸</button>
      </div>`;
    }
    return `<div class="panel event">
      <div class="evtag">${STH.NODE_INFO[run.event.flavor] ? STH.NODE_INFO[run.event.flavor].icon + ' ' + STH.NODE_INFO[run.event.flavor].label : '❓ Event'}</div>
      <h2>${esc(evDef.title)}</h2>
      <p>${esc(STH.fillText(run, evDef.text))}</p>
      <div class="choices">
        ${evDef.choices.map((ch, i) => {
          const ok = STH.eventChoiceAvailable(run, ch);
          return `<button class="btn choice ${ok ? '' : 'locked'}" ${ok ? `data-choice="${i}"` : 'disabled'}>
            ${esc(ch.label)}${ch.req && ch.req.pc ? ` <span class="reqtag">needs ${ch.req.pc} PC</span>` : ''}${ch.random ? ' <span class="reqtag">🎲 risky</span>' : ''}
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }

  function restScreen(run) {
    let n = 30;
    if (STH.perkHas(run, 'printer_whisperer')) n += 10;
    if (run.company.mod.restBonus) n += run.company.mod.restBonus;
    return `<div class="panel">
      <h2>☕ Coffee Break</h2>
      <p>The break room hums. The good mug is available. For fifteen sacred minutes, nobody knows where you are.</p>
      <div class="choices">
        <button class="btn choice" data-act="resthelp">😮‍💨 Actually rest (heal ${n} Stress)</button>
        <button class="btn choice" data-act="restupgrade">📚 Skill up over coffee (upgrade a card)</button>
      </div>
    </div>`;
  }

  function upgradeScreen(run, title, mode) {
    const upgradable = run.deck.map((inst, i) => ({ inst, i })).filter(x => !x.inst.up && STH.CARD[x.inst.id].up);
    return `<div class="panel wide">
      <h2>${esc(title)}</h2>
      ${upgradable.length ? `<div class="cardopts">
        ${upgradable.map(x => cardHTML(run, x.inst, { pick: x.i, small: true })).join('')}
      </div>` : '<p>Nothing left to upgrade. You are, worryingly, fully optimized.</p>'}
      <button class="btn small" data-act="skipnode">Skip</button>
    </div>`;
  }

  function reviewScreen(run) {
    return `<div class="panel">
      <h2>📊 Performance Review</h2>
      <p>${esc(run.review.text)}</p>
      <div class="choices">
        ${run.review.options.map((o, i) => `<button class="btn choice" data-review="${i}">${esc(o.label)}</button>`).join('')}
      </div>
    </div>`;
  }

  function reorgScreen(run) {
    if (S.removeCtx) {
      return `<div class="panel wide">
        <h2>🌪️ Reorg — choose a card to remove (3 PC)</h2>
        <div class="cardopts">${run.deck.map((inst, i) => cardHTML(run, inst, { pick: i, small: true })).join('')}</div>
        <button class="btn small" data-act="cancelremove">Cancel</button>
      </div>`;
    }
    return `<div class="panel">
      <h2>🌪️ Reorg</h2>
      <p>The org chart trembles. Boxes move. Dotted lines solidify and dissolve. In chaos, there is opportunity — and paperwork.</p>
      <div class="choices">
        ${STH.reorgOptions(run).map(o => `<button class="btn choice ${o.id === 'remove' && run.pc < 3 ? 'locked' : ''}"
          ${o.id === 'remove' && run.pc < 3 ? 'disabled' : ''} data-reorg="${o.id}">
          ${esc(o.label)}${o.cost ? ` <span class="reqtag">${o.cost} PC</span>` : ''}</button>`).join('')}
      </div>
    </div>`;
  }

  function promotionScreen(run) {
    return `<div class="panel">
      <h2>🎉 PROMOTED</h2>
      <p>You survived Act ${run.act - 1}. A new title, a new floor, the same coffee machine.
         You recover 25 Stress and gain 3 Reputation. The stakes, of course, are now worse.</p>
      <p><b>Act ${run.act}: ${['', 'Entry-Level Chaos', 'Middle Management Politics', 'Executive Survival'][run.act]}</b></p>
      <button class="btn primary" data-act="continue">Onward ▸</button>
    </div>`;
  }

  function summaryScreen(run) {
    const s = run.summary;
    const p = STH.loadProfile();
    return `<div class="panel summary">
      <h2>${s.won ? '🏁' : '🪦'} Career Retrospective</h2>
      <div class="heroholder sumhero">${STH.hero(s.won ? 'cheer' : 'ko', run.role)}</div>
      ${!s.won ? '<div class="burnoutstamp">BURNED OUT</div>' : ''}
      <div class="ending">${esc(s.ending)}</div>
      <div class="file-grid">
        <div><b>Role</b><span>${esc(s.role)}</span></div>
        <div><b>Company</b><span>${esc(s.company)}</span></div>
        <div><b>Final Reputation</b><span>${s.rep}/100</span></div>
        <div><b>Final Stress</b><span>${s.stress}/${s.maxStress}</span></div>
        <div><b>Encounters won</b><span>${s.combatsWon}</span></div>
        <div><b>Political Capital</b><span>${s.pc}</span></div>
      </div>
      <p><b>Bosses defeated:</b> ${s.bosses.length ? s.bosses.map(esc).join(' · ') : 'none — the org chart won'}</p>
      <p><b>Signature move:</b> ${s.mostUsed ? esc(s.mostUsed.name) + ' ×' + s.mostUsed.n : '—'}</p>
      <p><b>Defining choice:</b> ${esc(s.moral)}</p>
      <p><b>Incident of record:</b> You ${esc(s.incident)}.</p>
      <p class="legacy">“${esc(s.legacy)}”</p>
      ${p && p.runs > 1 ? `<p class="fineprint">Career #${p.runs} for ${esc(p.name)} — ${p.wins} survived, ${p.burnouts} burnouts.</p>` : ''}
      <div class="menu-btns row">
        <button class="btn primary" data-act="newrun">🔁 New Run</button>
        <button class="btn" data-act="file">📁 Personnel File</button>
        <button class="btn" data-act="menu">🏠 Main Menu</button>
      </div>
    </div>`;
  }

  function shopScreen(run) {
    const s = run.shop;
    if (S.shopRemove) {
      return `<div class="panel wide">
        <h2>🛒 Shred a card (${s.removal.price} PC)</h2>
        <div class="cardopts">${run.deck.map((inst, i) => cardHTML(run, inst, { pick: i, small: true })).join('')}</div>
        <button class="btn small" data-act="cancelshopremove">Never mind</button>
      </div>`;
    }
    return `<div class="panel wide shop">
      <h2>🛒 Procurement Portal</h2>
      <p>Internal marketplace. Three approvals were required to open this tab; you have ${run.pc} Political Capital and the moral flexibility to spend it.</p>
      <h3>Cards</h3>
      <div class="cardopts">
        ${s.cards.map((it, i) => it.sold
          ? `<div class="soldslot">SOLD<br><span class="fineprint">(to someone with budget)</span></div>`
          : `<div class="shopitem"><div data-buycard="${i}" class="buywrap ${run.pc < it.price ? 'cant' : ''}">${cardHTML(run, { id: it.id, up: false, uid: 'shop' + i }, { small: true })}</div><div class="pricetag ${run.pc < it.price ? 'cant' : ''}">${it.price} PC</div></div>`).join('')}
      </div>
      <h3>Services</h3>
      <div class="services">
        ${s.perk && !s.perk.sold ? (() => { const p = STH.PERK[s.perk.id]; return `<button class="btn choice ${run.pc < s.perk.price ? 'locked' : ''}" ${run.pc < s.perk.price ? 'disabled' : ''} data-act="shopperk">${p.icon} <b>${esc(p.name)}</b> — ${esc(p.desc)} <span class="reqtag">${s.perk.price} PC</span></button>`; })() : ''}
        ${!s.removal.used ? `<button class="btn choice ${run.pc < s.removal.price ? 'locked' : ''}" ${run.pc < s.removal.price ? 'disabled' : ''} data-act="shopremove">🗑️ Shred a card from your deck <span class="reqtag">${s.removal.price} PC</span></button>` : ''}
        ${!s.snack.used ? `<button class="btn choice ${run.pc < s.snack.price ? 'locked' : ''}" ${run.pc < s.snack.price ? 'disabled' : ''} data-act="shopsnack">🍜 Expense a real lunch (heal 12 Stress) <span class="reqtag">${s.snack.price} PC</span></button>` : ''}
      </div>
      <button class="btn primary" data-act="shopleave">Close tab ▸</button>
    </div>`;
  }

  function mysteryScreen(run) {
    return `<div class="panel">
      <h2>❔ Unmarked Calendar Hold</h2>
      <p class="result">${esc(run.mysteryGift || '')}</p>
      <button class="btn primary" data-act="mysterydone">Continue ▸</button>
    </div>`;
  }

  function deckModal(run) {
    return `<div class="modal" data-act="closemodal"><div class="modalbox">
      <h3>Your Deck (${run.deck.length})</h3>
      <div class="cardopts">${run.deck.map(inst => cardHTML(run, inst, { small: true })).join('')}</div>
      <button class="btn small" data-act="closemodal">Close</button>
    </div></div>`;
  }

  /* ---------- combat FX (numbers pop, flashes, shake) ---------- */
  function runFx(run) {
    const c = run && run.combat;
    if (!c || !c.fxq || !c.fxq.length) return;
    const q = c.fxq.splice(0);
    q.forEach((ev, k) => {
      setTimeout(() => {
        let host = null, cls = '', txt = '';
        if (ev.t === 'ehit') { host = $(`.enemy[data-enemy="${ev.i}"]`); cls = 'dmg'; txt = '−' + ev.n; }
        else if (ev.t === 'phit') { host = $('.playerpane'); cls = 'dmg'; txt = '−' + ev.n + ' HP'; }
        else if (ev.t === 'block' || ev.t === 'pblock') { host = $('.playerpane'); cls = 'blk'; txt = '🛡️ ' + ev.n; }
        else if (ev.t === 'heal') { host = $('.playerpane'); cls = 'heal'; txt = '+' + ev.n + ' HP'; }
        if (!host) return;
        if (cls === 'dmg') {
          host.classList.remove('hitflash'); void host.offsetWidth; host.classList.add('hitflash');
          if (ev.n >= 10) { const stage = $('.combat'); if (stage) { stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); } }
        }
        const s = document.createElement('span');
        s.className = 'floatnum ' + cls;
        s.textContent = txt;
        s.style.left = (28 + Math.random() * 44) + '%';
        host.appendChild(s);
        setTimeout(() => s.remove(), 950);
      }, k * 130);
    });
  }

  function playCardAnimated(run, uid, targetIdx, cardEl) {
    if (S.busy) return;
    S.busy = true;
    if (cardEl) cardEl.classList.add('zap');
    setTimeout(() => {
      STH.playCard(run, uid, targetIdx);
      render();
      runFx(run);
      S.busy = false;
    }, cardEl ? 170 : 0);
  }

  /* ---------- actions ---------- */
  function startNewRunFlow() {
    S.pendingCompany = STH.generateCompany(Math.random);
    S.screen = 'roles';
    render();
  }

  document.addEventListener('click', e => {
    const t = e.target;
    const run = S.run;

    const actEl = t.closest('[data-act]');
    if (actEl) {
      const act = actEl.dataset.act;
      if (act === 'newrun') { const p = STH.loadProfile(); if (!p) { S.screen = 'name'; render(); return; } startNewRunFlow(); return; }
      if (act === 'savename') {
        const name = ($('#playername').value || '').trim() || 'Employee #4096';
        STH.saveProfile(STH.newProfile(name));
        startNewRunFlow(); return;
      }
      if (act === 'file') { S.screen = 'file'; S.run = S.run && S.run.over ? null : S.run; render(); return; }
      if (act === 'credits') { S.screen = 'credits'; render(); return; }
      if (act === 'mode-pony') { setMode('pony'); render(); return; }
      if (act === 'mode-spire') { setMode('spire'); render(); return; }
      if (act === 'menu') { S.screen = 'menu'; if (S.run && S.run.over) S.run = null; render(); return; }
      if (act === 'wipe') { if (confirm('Shred your entire personnel file? This forgets everything.')) { STH.resetProfile(); } render(); return; }
      if (act === 'reroll') { S.pendingCompany = STH.generateCompany(Math.random); render(); return; }
      if (act === 'abandon') { if (confirm('Resign and abandon this run?')) { S.run = null; S.screen = 'menu'; } render(); return; }
      if (!run) { /* remaining actions need a run */ }
      else if (act === 'endturn') { if (S.busy) return; S.targeting = null; STH.endTurn(run); render(); runFx(run); return; }
      else if (act === 'bossgo') { run.combat._introShown = true; render(); return; }
      else if (act === 'shopleave') { STH.leaveShop(run); render(); return; }
      else if (act === 'shopsnack') { STH.buyShopSnack(run); render(); return; }
      else if (act === 'shopperk') { STH.buyShopPerk(run); render(); return; }
      else if (act === 'shopremove') { S.shopRemove = true; render(); return; }
      else if (act === 'cancelshopremove') { S.shopRemove = false; render(); return; }
      else if (act === 'mysterydone') { STH.finishMystery(run); render(); return; }
      else if (act === 'continue') { if (run.phase === 'promotion') STH.continueFromPromotion(run); else STH.finishReward(run); S.screen = 'game'; render(); return; }
      else if (act === 'skipcard') { STH.takeCardReward(run, null); maybeFinishReward(run); render(); return; }
      else if (act === 'skipperk') { STH.takePerkReward(run, null); maybeFinishReward(run); render(); return; }
      else if (act === 'eventdone') { STH.finishEvent(run); render(); return; }
      else if (act === 'resthelp') { STH.restHeal(run); render(); return; }
      else if (act === 'restupgrade') { run.phase = 'upgrade'; render(); return; }
      else if (act === 'skipnode') { STH.skipNode(run); render(); return; }
      else if (act === 'viewdeck') { $('#deckmodal').innerHTML = deckModal(run); return; }
      else if (act === 'closemodal') { if (t.closest('.modalbox') && !t.matches('[data-act="closemodal"].btn')) return; const m = $('#deckmodal'); if (m) m.innerHTML = ''; return; }
      else if (act === 'cancelremove') { S.removeCtx = null; render(); return; }
      if (!run) return;
    }

    // role selection happens before a run exists
    const roleEl = t.closest('[data-role]');
    if (roleEl && S.screen === 'roles') {
      S.run = STH.newRun(roleEl.dataset.role);
      S.run.company = S.pendingCompany;                 // use the company the player saw
      S.run.luck = S.run.company.mod.luck || 0;         // recompute luck for that company
      S.screen = 'game';
      render(); return;
    }

    if (!run) return;

    // map node
    const nodeEl = t.closest('[data-node]');
    if (nodeEl && run.phase === 'map') { STH.enterNode(run, +nodeEl.dataset.node); render(); return; }

    // play card (with targeting)
    const cardEl = t.closest('[data-play]');
    if (cardEl && run.phase === 'combat') {
      if (S.busy) return;
      const uid = cardEl.dataset.play;
      if (S.targeting === uid) { S.targeting = null; render(); return; }
      const inst = run.combat.hand.find(h => h.uid === uid);
      if (!inst || !STH.canPlay(run, inst)) return;
      const v = STH.cardView(inst);
      const living = run.combat.enemies.filter(x => x.hp > 0).length;
      if (v.target === 'enemy' && living > 1) { S.targeting = uid; render(); return; }
      S.targeting = null;
      playCardAnimated(run, uid, run.combat.enemies.findIndex(x => x.hp > 0), cardEl);
      return;
    }
    const enemyEl = t.closest('[data-enemy]');
    if (enemyEl && run.phase === 'combat' && S.targeting) {
      const idx = +enemyEl.dataset.enemy;
      if (run.combat.enemies[idx] && run.combat.enemies[idx].hp > 0) {
        const uid = S.targeting; S.targeting = null;
        playCardAnimated(run, uid, idx, null);
        return;
      }
      render(); return;
    }

    // reward picks
    const pickEl = t.closest('[data-pick]');
    if (pickEl) {
      if (run.phase === 'reward' && run.reward && run.reward.cards) {
        STH.takeCardReward(run, pickEl.dataset.pick);
        maybeFinishReward(run); render(); return;
      }
      if (run.phase === 'upgrade') { STH.upgradeCard(run, +pickEl.dataset.pick); render(); return; }
      if (run.phase === 'reorg' && S.removeCtx) { S.removeCtx = null; STH.doReorg(run, 'remove', +pickEl.dataset.pick); render(); return; }
      if (run.phase === 'shop' && S.shopRemove) { S.shopRemove = false; STH.buyShopRemoval(run, +pickEl.dataset.pick); render(); return; }
    }
    const buyEl = t.closest('[data-buycard]');
    if (buyEl && run.phase === 'shop') { STH.buyShopCard(run, +buyEl.dataset.buycard); render(); return; }
    const perkEl = t.closest('[data-perk]');
    if (perkEl && run.phase === 'reward') { STH.takePerkReward(run, perkEl.dataset.perk); maybeFinishReward(run); render(); return; }

    const choiceEl = t.closest('[data-choice]');
    if (choiceEl && run.phase === 'event') { STH.chooseEventOption(run, +choiceEl.dataset.choice); render(); return; }
    const reviewEl = t.closest('[data-review]');
    if (reviewEl && run.phase === 'review') { STH.chooseReview(run, +reviewEl.dataset.review); render(); return; }
    const reorgEl = t.closest('[data-reorg]');
    if (reorgEl && run.phase === 'reorg') {
      const id = reorgEl.dataset.reorg;
      if (id === 'remove') { S.removeCtx = true; render(); return; }
      STH.doReorg(run, id); render(); return;
    }
  });

  function maybeFinishReward(run) {
    const r = run.reward;
    if (r && !r.cards && !r.perkChoice) STH.finishReward(run);
  }

  // keyboard shortcuts: E = end turn, 1-9 play card
  document.addEventListener('keydown', e => {
    const run = S.run;
    if (!run || run.phase !== 'combat') return;
    if (S.busy) return;
    if (e.key === 'e' || e.key === 'E') { S.targeting = null; STH.endTurn(run); render(); runFx(run); }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= run.combat.hand.length) {
      const inst = run.combat.hand[n - 1];
      if (STH.canPlay(run, inst)) {
        const v = STH.cardView(inst);
        const living = run.combat.enemies.filter(x => x.hp > 0).length;
        if (v.target === 'enemy' && living > 1) { S.targeting = inst.uid; render(); }
        else playCardAnimated(run, inst.uid, run.combat.enemies.findIndex(x => x.hp > 0), null);
      }
    }
  });

  render();
})(typeof window !== 'undefined' ? window : globalThis);
