/* Stay the Hire — art layer. Pure presentation: card icons, hand-drawn SVG characters.
   No game logic here. Players are cute; enemies are original workplace meme caricatures. */
(function (g) {
  g.STH = g.STH || {};

  /* =============== CARD ICONS (every card gets one) =============== */
  g.STH.CARD_ICONS = {
    status_update:'📝', set_boundaries:'🚧', eager_volunteer:'🙋', dumb_question:'❓',
    weaponized_spreadsheet:'📊', requirements_doc:'📄', ship_it:'🚢', refactor:'🧹',
    deescalate:'🧯', ticket_triage:'🎫', hype_cycle:'📈', rebrand:'🎨',
    always_be_closing:'🤝', charm_offensive:'😊', stakeholder_sync:'🔄', prioritize:'✂️',
    query_everything:'🔍', correlation:'📉',
    reply_all:'💥', circle_back:'🔁', take_offline:'🔌', great_question:'✨',
    coffee_chat:'☕', schedule_followup:'📅', ask_for_data:'📊', take_notes:'⌨️',
    escalate_politely:'📮', camera_off:'🙈', mute_notifications:'🔕', pre_read:'📎',
    dashboard:'🖥️', blame_vendor:'📦', deflect:'🪞', quiet_quit:'🪑',
    mentor_intern:'🌱', calendar_tetris_card:'🧩', follow_process:'📋', document_everything:'🧾',
    small_talk:'🌤️', status_theater:'🎭', thread_derail:'🧵', snack_run:'🍿',
    inbox_sweep:'📥', nod_thoughtfully:'🙂', rubber_duck:'🦆', pae:'👍',
    build_alignment:'🧲', skip_level:'🪜', exec_summary:'⭐', strategic_ambiguity:'🌫️',
    task_force:'📣', reframe:'🖼️', take_credit:'🏆', blamestorm:'⛈️',
    leak_deck:'💧', decline_guilt:'🙅', do_not_book:'🧱', deep_work_sprint:'🎧',
    soft_launch:'🤫', hard_pivot:'🌀', protect_team:'🛡️', under_bus:'🚌',
    legal_review:'⚖️', compliance_training:'📺', review_prep:'📑', coffee_badge:'🪪',
    managers_manager:'👔', weekend_warrior:'🌙', touch_grass:'🌿', meeting_cost:'💸',
    align_alignment:'♾️', grind_mindset:'😤',
    quiet_influence:'🕴️', golden_rolodex:'📇', restructure_narrative:'📖', burn_it_down:'🔥',
    zen_not_caring:'🧘', delegate:'📤', the_favor:'🤝', unlimited_pto:'🏖️',
    founder_mode:'🚀', whisper_network:'🕸️', martyr_complex:'😇', imposter_no_more:'💪',
    own_the_room:'🎤', severance:'✂️', copy_paste_culture:'🖨️', offsite_epiphany:'🧗',
    escalation_chain:'🪜', all_day_dnd:'🔴',
    leftover_cake:'🍰',
    burnout:'🕯️', doomscroll:'📱', cynicism:'🙄', bad_sleep:'😵',
    eod_request:'⏰', pip_paperwork:'📁', cringe_card:'😬'
  };

  /* =============== HAND-DRAWN SVG CHARACTERS =============== */
  /* Wobbly path helpers give everything a handmade look. */
  const INK = '#4a4038';

  function wobblyBlob(cx, cy, rx, ry, seed) {
    // approximate circle with 8 bezier points, each nudged pseudo-randomly
    let pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8;
      const w = 1 + 0.06 * Math.sin(seed * 7.13 + i * 2.9);
      pts.push([cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w]);
    }
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i <= 8; i++) {
      const p = pts[i % 8], prev = pts[i - 1];
      const mx = (prev[0] + p[0]) / 2, my = (prev[1] + p[1]) / 2;
      d += ` Q ${prev[0].toFixed(1)} ${prev[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    return d + ' Z';
  }

  /* ---- enemy face parts (meme caricature kit) ---- */
  const EYES = {
    dead:    `<circle cx="44" cy="52" r="3" fill="${INK}"/><circle cx="76" cy="52" r="3" fill="${INK}"/>
              <path d="M36 62 Q44 66 52 62 M68 62 Q76 66 84 62" stroke="${INK}" stroke-width="2" fill="none" opacity=".45"/>`,
    wide:    `<circle cx="44" cy="50" r="8" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="76" cy="50" r="8" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
              <circle cx="44" cy="50" r="2.6" fill="${INK}"/><circle cx="76" cy="50" r="2.6" fill="${INK}"/>`,
    angry:   `<path d="M32 42 L54 50 M88 42 L66 50" stroke="${INK}" stroke-width="3.5" fill="none"/>
              <circle cx="45" cy="55" r="3.4" fill="${INK}"/><circle cx="75" cy="55" r="3.4" fill="${INK}"/>`,
    smug:    `<path d="M36 50 Q44 44 52 50 M68 50 Q76 44 84 50" stroke="${INK}" stroke-width="3" fill="none"/>`,
    tiny:    `<circle cx="45" cy="52" r="2" fill="${INK}"/><circle cx="75" cy="52" r="2" fill="${INK}"/>`,
    sparkle: `<circle cx="44" cy="50" r="7" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="76" cy="50" r="7" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
              <circle cx="46" cy="48" r="2.6" fill="${INK}"/><circle cx="78" cy="48" r="2.6" fill="${INK}"/>
              <circle cx="42" cy="46" r="1" fill="#fff" stroke="none"/><circle cx="74" cy="46" r="1" fill="#fff" stroke="none"/>`,
    spiral:  `<path d="M40 50 q6 -6 9 0 q3 6 -4 6 q-6 0 -3 -6 M72 50 q6 -6 9 0 q3 6 -4 6 q-6 0 -3 -6" stroke="${INK}" stroke-width="2.2" fill="none"/>`
  };
  const MOUTHS = {
    openScream:`<ellipse cx="60" cy="82" rx="14" ry="17" fill="#7a4a44" stroke="${INK}" stroke-width="2.5"/>
                <path d="M48 76 Q60 72 72 76" stroke="#fff" stroke-width="4" fill="none"/>`,
    flat:    `<path d="M46 84 L74 84" stroke="${INK}" stroke-width="3"/>`,
    frown:   `<path d="M46 88 Q60 78 74 88" stroke="${INK}" stroke-width="3" fill="none"/>`,
    grinBig: `<path d="M42 78 Q60 96 78 78 Q60 86 42 78 Z" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`,
    smirk:   `<path d="M48 84 Q64 90 76 80" stroke="${INK}" stroke-width="3" fill="none"/>`,
    smallO:  `<circle cx="60" cy="84" r="5" fill="#7a4a44" stroke="${INK}" stroke-width="2"/>`,
    fixed:   `<path d="M44 82 Q60 90 76 82" stroke="${INK}" stroke-width="3" fill="none"/>
              <path d="M48 82 L48 88 M56 84 L56 90 M64 84 L64 90 M72 82 L72 88" stroke="${INK}" stroke-width="1.6"/>`
  };
  const EXTRAS = {
    hoodie:  `<path d="M14 118 Q16 78 34 66 Q30 96 40 118 Z M106 118 Q104 78 86 66 Q90 96 80 118 Z" fill="#8b93a3" stroke="${INK}" stroke-width="2.5"/>
              <path d="M40 116 Q60 108 80 116" stroke="${INK}" stroke-width="2" fill="none"/>`,
    tie:     `<path d="M56 106 L64 106 L62 118 L58 118 Z" fill="#c86b6b" stroke="${INK}" stroke-width="2"/>`,
    glasses: `<rect x="32" y="42" width="24" height="16" rx="4" fill="none" stroke="${INK}" stroke-width="2.5"/>
              <rect x="64" y="42" width="24" height="16" rx="4" fill="none" stroke="${INK}" stroke-width="2.5"/>
              <path d="M56 50 L64 50" stroke="${INK}" stroke-width="2.5"/>`,
    stubble: `<g fill="${INK}" opacity=".5"><circle cx="46" cy="96" r="1"/><circle cx="54" cy="99" r="1"/><circle cx="62" cy="100" r="1"/><circle cx="70" cy="98" r="1"/><circle cx="76" cy="94" r="1"/><circle cx="50" cy="93" r="1"/><circle cx="68" cy="93" r="1"/></g>`,
    bun:     `<circle cx="60" cy="12" r="9" fill="#8a6d4f" stroke="${INK}" stroke-width="2.5"/>`,
    phone:   `<rect x="88" y="84" width="16" height="26" rx="3" fill="#dfe6ef" stroke="${INK}" stroke-width="2.5" transform="rotate(12 96 97)"/>`,
    coffee:  `<rect x="14" y="88" width="16" height="20" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M30 92 q8 2 0 10" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M19 84 q2 -5 0 -8 M25 84 q2 -5 0 -8" stroke="${INK}" stroke-width="1.6" fill="none" opacity=".6"/>`,
    halo:    `<ellipse cx="60" cy="8" rx="20" ry="5" fill="none" stroke="#e8c454" stroke-width="3"/>`,
    point:   `<path d="M96 66 L114 58" stroke="${INK}" stroke-width="4" fill="none"/><circle cx="114" cy="58" r="4" fill="#f1c8a8" stroke="${INK}" stroke-width="2"/>`,
    sweat:   `<path d="M88 34 q4 8 0 10 q-4 -2 0 -10" fill="#9cc8e8" stroke="${INK}" stroke-width="1.5"/>`,
    crown:   `<path d="M42 14 L48 4 L56 12 L64 2 L72 12 L80 4 L84 14 Z" fill="#e8c454" stroke="${INK}" stroke-width="2"/>`,
    fangs:   `<path d="M50 80 L53 88 L56 80 M64 80 L67 88 L70 80" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`,
    badge:   `<rect x="18" y="92" width="20" height="14" rx="2" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M21 96 h14 M21 100 h9" stroke="${INK}" stroke-width="1.4"/>`
  };
  const HEADS = {
    round:   s => wobblyBlob(60, 62, 44, 46, s),
    long:    s => wobblyBlob(60, 66, 38, 52, s),
    bigbrain:s => `M 22 84 Q 14 30 40 14 Q 60 2 80 14 Q 106 30 98 84 Q 96 108 60 110 Q 24 108 22 84 Z`,
    square:  s => `M 24 30 Q 22 24 30 24 L 90 24 Q 98 24 96 32 L 94 96 Q 94 106 82 106 L 38 106 Q 26 106 26 96 Z`
  };

  function memeFace(cfg, seed) {
    const skin = cfg.skin || '#f6dcc0';
    const head = HEADS[cfg.head || 'round'](seed || 1);
    const brain = cfg.head === 'bigbrain' ? `<path d="M30 44 Q40 30 52 40 M52 30 Q64 20 74 32 M70 44 Q82 34 90 46" stroke="${INK}" stroke-width="1.6" fill="none" opacity=".35"/>` : '';
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="charsvg">
      <path d="${head}" fill="${skin}" stroke="${INK}" stroke-width="3"/>
      ${brain}
      ${(cfg.extras || []).filter(e => e === 'hoodie').map(e => EXTRAS[e]).join('')}
      ${EYES[cfg.eyes || 'dead']}
      ${MOUTHS[cfg.mouth || 'flat']}
      ${(cfg.extras || []).filter(e => e !== 'hoodie').map(e => EXTRAS[e]).join('')}
    </svg>`;
  }

  /* ---- cute player kit ---- */
  const CUTE_ACC = {
    badge:   `<rect x="46" y="96" width="28" height="18" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.2" transform="rotate(-4 60 105)"/><circle cx="53" cy="103" r="3.5" fill="#f8c8d4"/><path d="M60 100 h10 M60 106 h7" stroke="${INK}" stroke-width="1.5"/>`,
    binders: `<rect x="8" y="82" width="26" height="8" rx="2" fill="#f8c8d4" stroke="${INK}" stroke-width="2"/><rect x="8" y="92" width="26" height="8" rx="2" fill="#c8e4f8" stroke="${INK}" stroke-width="2"/><rect x="8" y="102" width="26" height="8" rx="2" fill="#d4ecc8" stroke="${INK}" stroke-width="2"/>`,
    coffee:  EXTRAS.coffee,
    headset: `<path d="M28 52 Q28 18 60 18 Q92 18 92 52" fill="none" stroke="${INK}" stroke-width="4"/><rect x="22" y="48" width="10" height="16" rx="4" fill="#b8a8d8" stroke="${INK}" stroke-width="2"/><rect x="88" y="48" width="10" height="16" rx="4" fill="#b8a8d8" stroke="${INK}" stroke-width="2"/><path d="M92 62 Q92 76 74 78" stroke="${INK}" stroke-width="2.5" fill="none"/><circle cx="72" cy="78" r="3" fill="#b8a8d8" stroke="${INK}" stroke-width="1.5"/>`,
    megaphone:`<path d="M86 88 L108 78 L108 104 L86 96 Z" fill="#f8d8a8" stroke="${INK}" stroke-width="2.2"/><path d="M108 84 q6 4 0 12" stroke="${INK}" stroke-width="2" fill="none"/>`,
    dogear:  `<path d="M28 20 Q20 2 36 8 Q42 12 40 22 M92 20 Q100 2 84 8 Q78 12 80 22" fill="#f6dcc0" stroke="${INK}" stroke-width="2.5"/>`,
    sticky:  `<rect x="84" y="90" width="22" height="22" fill="#fdf3a8" stroke="${INK}" stroke-width="2" transform="rotate(8 95 101)"/><path d="M88 98 h12 M88 103 h8" stroke="${INK}" stroke-width="1.4" transform="rotate(8 95 101)"/>`,
    chart:   `<rect x="82" y="86" width="26" height="20" rx="2" fill="#fff" stroke="${INK}" stroke-width="2" transform="rotate(6 95 96)"/><path d="M86 100 L92 94 L97 98 L104 90" stroke="#8bb88b" stroke-width="2.5" fill="none" transform="rotate(6 95 96)"/>`,
    cardigan:`<path d="M30 118 Q32 96 44 92 L48 118 Z M90 118 Q88 96 76 92 L72 118 Z" fill="#d8c8b8" stroke="${INK}" stroke-width="2.2"/>`
  };

  function cutie(cfg) {
    const skin = cfg.skin || '#fbe8d8';
    const blushC = cfg.blush || '#f8c8d4';
    const hair = cfg.hair !== false ? `<path d="M22 46 Q18 12 60 12 Q102 12 98 46 Q88 28 60 28 Q32 28 22 46 Z" fill="${cfg.hairColor || '#8a6d4f'}" stroke="${INK}" stroke-width="2.5"/>` : '';
    const mouth = cfg.mouth === 'worried'
      ? `<path d="M52 86 Q60 82 68 86" stroke="${INK}" stroke-width="2.5" fill="none"/>`
      : cfg.mouth === 'bigsmile'
      ? `<path d="M48 82 Q60 94 72 82" stroke="${INK}" stroke-width="2.5" fill="none"/>`
      : `<path d="M54 85 Q60 90 66 85" stroke="${INK}" stroke-width="2.5" fill="none"/>`;
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="charsvg cute">
      <path d="${wobblyBlob(60, 62, 42, 44, cfg.seed || 2)}" fill="${skin}" stroke="${INK}" stroke-width="3"/>
      ${hair}
      <circle cx="44" cy="58" r="8.5" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
      <circle cx="76" cy="58" r="8.5" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
      <circle cx="45.5" cy="59" r="4" fill="${INK}"/><circle cx="77.5" cy="59" r="4" fill="${INK}"/>
      <circle cx="47" cy="57" r="1.4" fill="#fff"/><circle cx="79" cy="57" r="1.4" fill="#fff"/>
      <circle cx="36" cy="74" r="5" fill="${blushC}" opacity=".7"/><circle cx="84" cy="74" r="5" fill="${blushC}" opacity=".7"/>
      ${mouth}
      ${(cfg.acc || []).map(a => CUTE_ACC[a]).join('')}
    </svg>`;
  }

  g.STH.memeFace = memeFace;
  g.STH.cutie = cutie;

  /* =============== THE PIXEL HERO ===============
     Tiny 8-bit business-suit survivor: black side-swept hair, black suit,
     white shirt, small blue tie, pink cheeks, vertical eyes, chunky outline.
     Rendered as a 16x22 pixel grid (SVG rects, crisp edges). */
  const PX = {
    H: '#26221f',  // hair / outline / shoes
    S: '#f6d3ac',  // skin
    E: '#26221f',  // eyes
    C: '#f2a9b4',  // pink cheeks
    J: '#33303b',  // suit jacket
    W: '#ffffff',  // shirt
    T: '#4a7fd4',  // tie (blue)
    P: '#26221f',  // pants
    A: '#f6d3ac',  // hands
    M: '#8a5c50'   // mouth
  };
  const HERO_POSES = {
    idle: [
      '....HHHHHHH.....',
      '..HHHHHHHHHH....',
      '.HHHHHHHHHHH....',
      '.HHHSSSSSSHH....',
      '.HHSSSSSSSSH....',
      '.HSSESSSSESS....',
      '.HSSESSSSESS....',
      '..SCSSSSSSCS....',
      '..SSSSMMSSSS....',
      '...SSSSSSSS.....',
      '..JJJJWWJJJJ....',
      '.JJJJWTTWJJJJ...',
      '.JAJJWTTWJJAJ...',
      '.JAJJWTTWJJAJ...',
      '.JJJJWWWWJJJJ...',
      '..JJJJJJJJJJ....',
      '..JJJJJJJJJJ....',
      '....PPPPPP......',
      '....PP..PP......',
      '....PP..PP......',
      '...PPP..PPP.....'
    ],
    cheer: [
      '....HHHHHHH.....',
      '..HHHHHHHHHH....',
      '.HHHHHHHHHHH....',
      '.HHHSSSSSSHH....',
      '.HHSSSSSSSSH....',
      '.HSSESSSSESS....',
      '.HSSESSSSESS....',
      '.ASCSSSSSSCSA...',
      '.ASSSSMMSSSSA...',
      '.A.SSSSSSSS.A...',
      '.AJJJJWWJJJJA...',
      '..JJJWTTWJJJ....',
      '..JJJWTTWJJJ....',
      '..JJJWTTWJJJ....',
      '..JJJWWWWJJJ....',
      '..JJJJJJJJJJ....',
      '..JJJJJJJJJJ....',
      '....PPPPPP......',
      '...PP....PP.....',
      '..PP......PP....',
      '.PPP......PPP...'
    ],
    ko: [
      '....HHHHHHH.....',
      '..HHHHHHHHHH....',
      '.HHHHHHHHHHH....',
      '.HHHSSSSSSHH....',
      '.HHSSSSSSSSH....',
      '.HSSSSSSSSSS....',
      '.HSEESSSSEES....',
      '..SCSSSSSSCS....',
      '..SSSMSSMSSS....',
      '...SSSMMSSS.....',
      '..JJJJWWJJJJ....',
      '.JJJJWTTWJJJJ...',
      '.JJAJWTTWJAJJ...',
      '.JJAJWTTWJAJJ...',
      '.JJJJWWWWJJJJ...',
      '..JJJJJJJJJJ....',
      '..JJJJJJJJJJ....',
      '....PPPPPP......',
      '....PP..PP......',
      '...PP....PP.....',
      '..PPP....PPP....'
    ]
  };
  g.STH.pixelHero = function (pose, tie) {
    const rows = HERO_POSES[pose] || HERO_POSES.idle;
    let rects = '';
    rows.forEach((row, y) => {
      row.padEnd(16, '.').slice(0, 16).split('').forEach((ch, x) => {
        if (ch === '.') return;
        const color = ch === 'T' && tie ? tie : PX[ch];
        if (color) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
      });
    });
    return `<svg viewBox="0 0 16 21" xmlns="http://www.w3.org/2000/svg" class="pixelhero ${pose}" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">${rects}</svg>`;
  };
  /* per-role tie colors, so your role shows on the hero */
  g.STH.ROLE_TIE = {
    intern: '#4a7fd4', analyst: '#3f9b6e', developer: '#7a6ab8', support: '#d4784a',
    marketing: '#d44a8c', sales: '#c8a02c', coordinator: '#4ab0b8', data: '#5c5c78'
  };
  g.STH.hero = function (pose, roleId) {
    return g.STH.pixelHero(pose, roleId ? g.STH.ROLE_TIE[roleId] : undefined);
  };

  /* =============== PER-ROLE CUTE AVATARS =============== */
  g.STH.ROLE_ART = {
    intern:      { mouth: 'worried',  acc: ['badge'],            hairColor: '#c98a4b', seed: 3 },
    analyst:     { mouth: 'smile',    acc: ['binders'],          hairColor: '#5a4632', seed: 4 },
    developer:   { mouth: 'smile',    acc: ['coffee', 'cardigan'], hairColor: '#3f3a36', seed: 5 },
    support:     { mouth: 'bigsmile', acc: ['headset'],          hairColor: '#8a5d3b', seed: 6 },
    marketing:   { mouth: 'bigsmile', acc: ['megaphone'],        hairColor: '#b0703c', seed: 7 },
    sales:       { mouth: 'bigsmile', acc: ['dogear', 'badge'],  hairColor: '#d9a05b', seed: 8 },
    coordinator: { mouth: 'worried',  acc: ['sticky'],           hairColor: '#6b5847', seed: 9 },
    data:        { mouth: 'smile',    acc: ['chart'],            hairColor: '#413d4d', seed: 10 }
  };

  /* =============== PER-ENEMY MEME CARICATURES =============== */
  g.STH.ENEMY_ART = {
    micromanager:      { head:'round',   eyes:'wide',   mouth:'fixed',     extras:['tie','sweat'],        skin:'#f6dcc0' },
    meeting_hoarder:   { head:'round',   eyes:'sparkle',mouth:'grinBig',   extras:['tie'],                skin:'#f0d8c8' },
    onboarding_buddy:  { head:'round',   eyes:'tiny',   mouth:'smirk',     extras:['badge','sweat'],      skin:'#f6dcc0' },
    printer:           { head:'square',  eyes:'dead',   mouth:'flat',      extras:[],                     skin:'#d8dde6' },
    replyall_goblin:   { head:'round',   eyes:'spiral', mouth:'openScream',extras:['sweat'],              skin:'#eed6c4' },
    thoughts_guy:      { head:'round',   eyes:'smug',   mouth:'smallO',    extras:['glasses'],            skin:'#f6dcc0' },
    calendar_tyrant:   { head:'long',    eyes:'angry',  mouth:'flat',      extras:['fangs','tie'],        skin:'#e6d4e8' },
    morale_committee:  { head:'round',   eyes:'sparkle',mouth:'grinBig',   extras:['halo'],               skin:'#f8e2cc' },
    agile_coach:       { head:'round',   eyes:'sparkle',mouth:'openScream',extras:['badge'],              skin:'#f0d8c8' },
    deck_perfectionist:{ head:'long',    eyes:'smug',   mouth:'flat',      extras:['glasses','bun'],      skin:'#f6dcc0' },
    credit_stealer:    { head:'round',   eyes:'smug',   mouth:'grinBig',   extras:['tie'],                skin:'#f0d0b8' },
    pa_director:       { head:'long',    eyes:'smug',   mouth:'fixed',     extras:['bun'],                skin:'#f6dcc0' },
    burned_engineer:   { head:'round',   eyes:'dead',   mouth:'frown',     extras:['hoodie','stubble','coffee'], skin:'#e8d0c0' },
    thought_leader:    { head:'round',   eyes:'sparkle',mouth:'grinBig',   extras:['point'],              skin:'#f2d8b8' },
    consultant:        { head:'round',   eyes:'tiny',   mouth:'smirk',     extras:['tie','glasses'],      skin:'#f6dcc0' },
    procurement:       { head:'square',  eyes:'angry',  mouth:'frown',     extras:['glasses'],            skin:'#f0cdb8' },
    legal_reviewer:    { head:'long',    eyes:'tiny',   mouth:'flat',      extras:['glasses'],            skin:'#ead8c8' },
    finance_partner:   { head:'square',  eyes:'angry',  mouth:'flat',      extras:['tie','glasses'],      skin:'#f6dcc0' },
    hrbp:              { head:'round',   eyes:'smug',   mouth:'fixed',     extras:['bun','badge'],        skin:'#f2dcc8' },
    vp_vague:          { head:'bigbrain',eyes:'tiny',   mouth:'smallO',    extras:['tie'],                skin:'#e8dce8' },
    cfo_cuts:          { head:'square',  eyes:'angry',  mouth:'frown',     extras:['tie','glasses'],      skin:'#e8d4c4' },
    founder_vision:    { head:'round',   eyes:'sparkle',mouth:'openScream',extras:['point'],              skin:'#f6dcc0' },
    ai_exec:           { head:'round',   eyes:'wide',   mouth:'openScream',extras:['point','tie'],        skin:'#f0d8c0' },
    board_observer:    { head:'long',    eyes:'tiny',   mouth:'flat',      extras:['glasses','tie'],      skin:'#ddd4cc' },
    activist_analyst:  { head:'bigbrain',eyes:'angry',  mouth:'smirk',     extras:['glasses'],            skin:'#e8d8c8' },
    pr_crisis:         { head:'round',   eyes:'sparkle',mouth:'fixed',     extras:['bun','halo'],         skin:'#f8e0d0' },
    vendor_lockin:     { head:'round',   eyes:'smug',   mouth:'grinBig',   extras:['tie','badge'],        skin:'#f0d4bc' },
    consulting_partner:{ head:'bigbrain',eyes:'smug',   mouth:'smirk',     extras:['tie','glasses'],      skin:'#eedcc8' },
    layoff_list:       { head:'square',  eyes:'dead',   mouth:'flat',      extras:[],                     skin:'#dfe4dc' },
    boss_eod:          { head:'round',   eyes:'wide',   mouth:'openScream',extras:['tie','sweat','phone'],skin:'#f4c8b0' },
    boss_portal:       { head:'square',  eyes:'spiral', mouth:'fixed',     extras:[],                     skin:'#ccd8e8' },
    boss_reorg:        { head:'bigbrain',eyes:'spiral', mouth:'openScream',extras:['tie'],                skin:'#e0d0e0' },
    boss_alignment:    { head:'bigbrain',eyes:'smug',   mouth:'smallO',    extras:['tie','crown'],        skin:'#e4d8c8' },
    boss_board:        { head:'square',  eyes:'angry',  mouth:'frown',     extras:['tie','crown','glasses'], skin:'#d8ccc0' },
    boss_ai_mandate:   { head:'bigbrain',eyes:'wide',   mouth:'openScream',extras:['point','crown'],      skin:'#d0dce8' }
  };

  g.STH.enemyArt = function (id, seed) {
    const cfg = g.STH.ENEMY_ART[id];
    return cfg ? memeFace(cfg, seed || (id.length * 3.7)) : memeFace({ eyes: 'dead', mouth: 'flat' }, 1);
  };
  g.STH.roleArt = function (id) {
    const cfg = g.STH.ROLE_ART[id];
    return cfg ? cutie(cfg) : cutie({ seed: 1 });
  };
})(typeof window !== 'undefined' ? window : globalThis);
