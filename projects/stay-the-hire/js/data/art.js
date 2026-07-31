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
    per_my_last_email:'📧', calendar_conflict:'🗓️', meeting_invite:'📅', corporate_debt:'📜',
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
    marketing: '#d44a8c', sales: '#c8a02c', coordinator: '#4ab0b8', data: '#5c5c78', witch: '#3f9b6e'
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
    data:        { mouth: 'smile',    acc: ['chart'],            hairColor: '#413d4d', seed: 10 },
    witch:       { mouth: 'smile',    acc: ['chart'],            hairColor: '#2f4f3f', seed: 11 }
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
,
    npc_compliance:    { head:'square',  eyes:'dead',   mouth:'fixed',     extras:['tie','badge'],        skin:'#ddd8ce' },
    password_spirit:   { head:'long',    eyes:'spiral', mouth:'smallO',    extras:[],                     skin:'#cfe0ec' },
    icebreaker_fac:    { head:'round',   eyes:'sparkle',mouth:'grinBig',   extras:['badge','halo'],       skin:'#f8e0cc' },
    calendar_imp:      { head:'round',   eyes:'angry',  mouth:'grinBig',   extras:['fangs'],              skin:'#e8c8ec' },
    roadmap_slime:     { head:'round',   eyes:'tiny',   mouth:'smallO',    extras:[],                     skin:'#c8e4b8' },
    task_slime:        { head:'round',   eyes:'tiny',   mouth:'flat',      extras:[],                     skin:'#d8ecc8' },
    budget_skeleton:   { head:'square',  eyes:'dead',   mouth:'grinBig',   extras:['tie'],                skin:'#eceae2' },
    slack_hydra:       { head:'round',   eyes:'wide',   mouth:'openScream',extras:['phone'],              skin:'#d4e2f4' },
    recurring_meeting: { head:'square',  eyes:'spiral', mouth:'fixed',     extras:['crown'],              skin:'#e8d8f0' },
    chief_vibes:       { head:'round',   eyes:'sparkle',mouth:'grinBig',   extras:['crown','halo'],       skin:'#f8d8d8' }
  };

  /* =============== 8-BIT PIXEL ENEMY SPRITES ===============
     Renders every enemy archetype config as a chunky 16x16 pixel face:
     flat colors, hard outlines, no gradients. Same config vocabulary as
     the hand-drawn kit above (head/eyes/mouth/extras). */
  function pixelFace(cfg) {
    const D = '#26221f', W = '#ffffff', R = '#a83a2e', Y = '#e8c454', GR = '#8b93a3', B = '#9cc8e8', MI = '#7a4a44';
    const skin = cfg.skin || '#f6dcc0';
    const g16 = Array.from({ length: 16 }, () => Array(16).fill(null));
    const put = (x, y, c) => { if (x >= 0 && x < 16 && y >= 0 && y < 16) g16[y][x] = c; };
    const rect = (x0, y0, x1, y1, fill, border) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        put(x, y, (y === y0 || y === y1 || x === x0 || x === x1) ? border : fill);
      }
    };
    // head
    const head = cfg.head || 'round';
    let top = 2, eyeY = 6, mouthY = 10;
    if (head === 'round') { rect(3, 2, 12, 12, skin, D); put(3, 2, null); put(12, 2, null); put(3, 12, null); put(12, 12, null); }
    else if (head === 'square') { rect(2, 2, 13, 12, skin, D); }
    else if (head === 'long') { rect(4, 1, 11, 13, skin, D); top = 1; }
    else if (head === 'bigbrain') {
      rect(2, 0, 13, 7, skin, D); rect(4, 7, 11, 13, skin, D);
      for (let x = 5; x <= 10; x++) put(x, 7, skin); // open the seam
      top = 0; eyeY = 9; mouthY = 12;
      put(4, 3, D); put(6, 2, D); put(9, 3, D); put(11, 2, D); // brain wrinkles
    }
    const ex = 5, ex2 = 10;
    // eyes
    const eyes = cfg.eyes || 'dead';
    if (eyes === 'dead' || eyes === 'tiny') { put(ex, eyeY, D); put(ex2, eyeY, D); }
    if (eyes === 'dead') { put(ex, eyeY + 2, D); put(ex2, eyeY + 2, D); } // eye bags
    if (eyes === 'wide') { put(ex, eyeY - 1, W); put(ex2, eyeY - 1, W); put(ex, eyeY, D); put(ex2, eyeY, D); }
    if (eyes === 'angry') { put(ex - 1, eyeY - 1, D); put(ex, eyeY, D); put(ex2 + 1, eyeY - 1, D); put(ex2, eyeY, D); }
    if (eyes === 'smug') { put(ex, eyeY, D); put(ex + 1, eyeY, D); put(ex2, eyeY, D); put(ex2 - 1, eyeY, D); }
    if (eyes === 'sparkle') { put(ex, eyeY - 1, W); put(ex, eyeY, W); put(ex + 1, eyeY, D); put(ex2, eyeY - 1, W); put(ex2, eyeY, W); put(ex2 - 1, eyeY, D); }
    if (eyes === 'spiral') { put(ex, eyeY - 1, D); put(ex + 1, eyeY, D); put(ex, eyeY + 1, D); put(ex2, eyeY - 1, D); put(ex2 - 1, eyeY, D); put(ex2, eyeY + 1, D); }
    // mouth
    const m = cfg.mouth || 'flat';
    const row = (x0, x1, y, c) => { for (let x = x0; x <= x1; x++) put(x, y, c); };
    if (m === 'flat') row(6, 9, mouthY, D);
    if (m === 'frown') { row(6, 9, mouthY, D); put(5, mouthY + 1, D); put(10, mouthY + 1, D); }
    if (m === 'smirk') { row(6, 9, mouthY, D); put(9, mouthY - 1, D); }
    if (m === 'grinBig') { row(5, 10, mouthY, D); row(6, 9, mouthY + 1, W); put(5, mouthY + 1, D); put(10, mouthY + 1, D); }
    if (m === 'fixed') { row(5, 10, mouthY, D); put(6, mouthY + 1, D); put(8, mouthY + 1, D); put(10, mouthY + 1, D); }
    if (m === 'smallO') { rect(7, mouthY, 8, mouthY + 1, MI, MI); }
    if (m === 'openScream') { rect(6, mouthY - 1, 9, Math.min(mouthY + 2, 13), MI, D); }
    // bust: little shoulders under every face
    row(4, 11, 14, D); row(3, 12, 15, D);
    // extras
    const has = e => (cfg.extras || []).includes(e);
    if (has('tie')) { put(7, 14, '#4a7fd4'); put(8, 14, '#4a7fd4'); put(7, 15, '#4a7fd4'); put(8, 15, '#4a7fd4'); }
    if (has('glasses')) { put(ex - 1, eyeY, W); put(ex + 1, eyeY, W); put(ex2 - 1, eyeY, W); put(ex2 + 1, eyeY, W); put(7, eyeY, D); put(8, eyeY, D); }
    if (has('hoodie')) { for (let y = top + 1; y <= 13; y++) { put(2, y, GR); put(3, y, GR); put(12, y, GR); put(13, y, GR); } row(4, 11, top, GR); }
    if (has('bun')) { rect(7, Math.max(top - 2, 0), 8, Math.max(top - 1, 0), '#8a6d4f', '#8a6d4f'); }
    if (has('crown')) { const cy = Math.max(top - 1, 0); row(5, 10, cy, Y); put(5, cy - 1, Y); put(7, cy - 1, Y); put(9, cy - 1, Y); }
    if (has('halo')) row(5, 10, 0, Y);
    if (has('sweat')) { put(13, top + 2, B); put(13, top + 3, B); }
    if (has('stubble')) { put(5, mouthY + 2, D); put(7, mouthY + 2, D); put(9, mouthY + 2, D); }
    if (has('point')) { put(14, 8, skin); put(15, 7, skin); put(13, 8, D); }
    if (has('fangs')) { put(6, mouthY + 1, W); put(9, mouthY + 1, W); }
    if (has('badge')) { put(4, 14, W); put(5, 14, W); }
    if (has('phone')) { rect(13, 9, 14, 11, '#dfe6ef', D); }
    if (has('coffee')) { rect(1, 11, 2, 12, W, D); }
    // render
    let rects = '';
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if (g16[y][x]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${g16[y][x]}"/>`;
    }
    return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="pixelface" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">${rects}</svg>`;
  }
  g.STH.pixelFace = pixelFace;
  g.STH.pixelEnemy = function (id) {
    const cfg = g.STH.ENEMY_ART[id];
    return pixelFace(cfg || { eyes: 'dead', mouth: 'flat' });
  };

  /* legacy hand-drawn generator kept below (unused by the 8-bit edition UI) */
  g.STH.enemyArt = function (id, seed) {
    const cfg = g.STH.ENEMY_ART[id];
    return cfg ? memeFace(cfg, seed || (id.length * 3.7)) : memeFace({ eyes: 'dead', mouth: 'flat' }, 1);
  };
  g.STH.roleArt = function (id) {
    const cfg = g.STH.ROLE_ART[id];
    return cfg ? cutie(cfg) : cutie({ seed: 1 });
  };

  /* =============== PIXEL CARD ICONS ===============
     Every card gets a hand-mapped 12x12 pixel illustration built from base
     shapes + overlay stamps. Flat colors, dark outlines, zero gradients. */
  (function () {
    const D = '#26221f', W = '#ffffff', RD = '#c05b4e', OR = '#e08a3c', YL = '#e8c454',
          GN = '#4e9e6a', PK = '#e89ab4', SK = '#f6d3ac', GY = '#9a948a', BL = '#4a7fd4';

    function makeGrid() { return Array.from({ length: 12 }, () => Array(12).fill(null)); }
    const mk = (g) => ({
      P: (x, y, c) => { if (x >= 0 && x < 12 && y >= 0 && y < 12) g[y][x] = c; },
      R: (x0, y0, x1, y1, fill, border) => {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          if (x < 0 || x > 11 || y < 0 || y > 11) continue;
          g[y][x] = (border && (y === y0 || y === y1 || x === x0 || x === x1)) ? border : fill;
        }
      },
      row: (x0, x1, y, c) => { for (let x = x0; x <= x1; x++) if (x >= 0 && x < 12 && y >= 0 && y < 12) g[y][x] = c; },
      col: (x, y0, y1, c) => { for (let y = y0; y <= y1; y++) if (x >= 0 && x < 12 && y >= 0 && y < 12) g[y][x] = c; }
    });

    const BASES = {
      envelope: (o, t) => { o.R(1, 3, 10, 9, W, D); [[2,4],[3,5],[4,6],[5,7],[6,7],[7,6],[8,5],[9,4]].forEach(([x,y]) => o.P(x, y, t)); },
      sheet:    (o, t) => { o.R(1, 1, 10, 10, W, D); o.row(2, 9, 3, t); o.col(5, 2, 9, D); o.row(2, 9, 6, D); },
      doc:      (o, t) => { o.R(3, 1, 8, 10, W, D); o.row(4, 7, 3, t); o.row(4, 7, 5, GY); o.row(4, 7, 7, GY); },
      calendar: (o, t) => { o.R(2, 2, 9, 10, W, D); o.R(3, 3, 8, 4, t, t); o.P(4, 1, D); o.P(7, 1, D); o.P(4, 6, GY); o.P(6, 6, GY); o.P(4, 8, GY); },
      bubble:   (o, t) => { o.R(2, 2, 9, 8, t, D); o.P(4, 9, D); o.P(4, 10, D); o.P(5, 9, t); },
      mug:      (o, t) => { o.R(3, 4, 8, 10, t, D); o.P(9, 6, D); o.P(10, 6, D); o.P(10, 7, D); o.P(9, 8, D); o.P(5, 2, GY); o.P(7, 1, GY); },
      mugs:     (o, t) => { o.R(1, 5, 5, 10, t, D); o.R(7, 5, 11, 10, PK, D); o.P(3, 3, GY); o.P(9, 3, GY); },
      shield:   (o, t) => { o.R(3, 1, 8, 6, t, D); o.R(4, 7, 7, 8, t, D); o.row(5, 6, 9, D); o.P(5, 3, W); o.P(6, 4, W); },
      clock:    (o, t) => { o.R(3, 2, 8, 9, W, D); o.P(6, 5, D); o.P(6, 4, t); o.P(6, 3, t); o.P(7, 6, t); o.P(8, 6, t); },
      chart:    (o, t) => { o.col(1, 1, 10, D); o.row(1, 10, 10, D); o.R(3, 7, 4, 9, t, t); o.R(6, 4, 7, 9, t, t); o.R(9, 6, 10, 9, GY, GY); },
      box:      (o, t) => { o.R(2, 4, 9, 10, t, D); o.row(2, 9, 6, D); o.col(5, 4, 6, D); o.col(6, 4, 6, D); },
      duck:     (o, t) => { o.R(3, 6, 9, 9, YL, D); o.R(6, 2, 9, 6, YL, D); o.P(10, 4, OR); o.P(11, 4, OR); o.P(8, 3, D); },
      flame:    (o, t) => { o.P(6, 1, OR); o.row(5, 6, 2, OR); o.row(5, 7, 3, RD); o.row(4, 7, 4, RD); o.row(4, 8, 5, RD); o.row(4, 8, 6, RD); o.row(5, 7, 7, OR); o.row(5, 7, 8, YL); o.P(6, 7, YL); },
      bulb:     (o, t) => { o.R(4, 1, 8, 5, YL, D); o.R(5, 6, 7, 7, GY, D); o.row(5, 7, 8, D); o.P(3, 3, YL); o.P(9, 3, YL); },
      ladder:   (o, t) => { o.col(3, 0, 11, D); o.col(8, 0, 11, D); [2, 4, 6, 8, 10].forEach(y => o.row(4, 7, y, t)); },
      badge:    (o, t) => { o.R(2, 3, 9, 10, W, D); o.R(3, 4, 5, 7, t, t); o.row(6, 8, 5, GY); o.row(6, 8, 7, GY); o.P(5, 1, D); o.P(6, 1, D); o.P(5, 2, D); o.P(6, 2, D); },
      bell:     (o, t) => { o.R(5, 1, 6, 2, t, D); o.R(3, 3, 8, 7, t, D); o.row(2, 9, 8, D); o.P(5, 9, D); o.P(6, 10, D); },
      phone:    (o, t) => { o.R(3, 0, 8, 11, W, D); o.R(4, 1, 7, 8, t, t); o.P(5, 10, D); o.P(6, 10, D); },
      heart:    (o, t) => { o.R(2, 2, 5, 4, PK, D); o.R(6, 2, 9, 4, PK, D); o.row(2, 9, 5, PK); o.row(3, 8, 6, PK); o.row(4, 7, 7, PK); o.row(5, 6, 8, PK); o.P(5, 9, PK); o.P(6, 9, PK); o.P(3, 3, W); },
      cycle:    (o, t) => { o.row(3, 8, 2, t); o.P(8, 1, t); o.P(8, 3, t); o.P(9, 3, t); o.col(9, 3, 6, t); o.row(3, 8, 9, t); o.P(3, 8, t); o.P(3, 10, t); o.P(2, 8, t); o.col(2, 5, 8, t); },
      person:   (o, t) => { o.R(4, 1, 7, 4, SK, D); o.P(5, 2, D); o.P(7, 2, D); o.P(4, 3, PK); o.R(3, 6, 8, 10, t, D); o.row(5, 6, 5, SK); },
      tetris:   (o, t) => { o.R(1, 7, 4, 10, t, D); o.R(5, 7, 8, 10, PK, D); o.R(3, 3, 6, 6, YL, D); o.R(8, 5, 11, 8, GN, D); },
      cake:     (o, t) => { o.R(2, 6, 9, 10, PK, D); o.row(2, 9, 6, W); o.col(6, 3, 5, D); o.P(6, 2, OR); o.P(3, 8, W); o.P(5, 8, W); o.P(7, 8, W); },
      grass:    (o, t) => { o.R(1, 9, 10, 11, GN, D); o.col(3, 6, 8, GN); o.col(5, 5, 8, GN); o.col(7, 6, 8, GN); o.col(9, 7, 8, GN); o.P(4, 4, PK); },
      rocket:   (o, t) => { o.P(6, 0, RD); o.R(5, 1, 7, 6, W, D); o.P(6, 3, t); o.R(4, 6, 5, 8, t, D); o.R(7, 6, 8, 8, t, D); o.P(6, 9, OR); o.P(6, 10, YL); },
      chair:    (o, t) => { o.col(3, 1, 6, D); o.P(4, 1, D); o.R(3, 6, 8, 7, t, D); o.col(5, 8, 9, D); o.row(3, 8, 10, D); o.P(3, 11, D); o.P(8, 11, D); }
    };

    const OVER = {
      angry:   (o) => { o.P(2, 0, D); o.P(3, 1, D); o.P(9, 0, D); o.P(8, 1, D); },
      fire:    (o) => { o.P(10, 0, OR); o.P(11, 1, RD); o.P(10, 1, RD); o.P(11, 2, OR); },
      exclaim: (o) => { o.col(11, 1, 3, RD); o.P(11, 5, RD); },
      question:(o) => { o.P(10, 0, D); o.P(11, 1, D); o.P(10, 2, D); o.P(10, 4, D); },
      sparkle: (o) => { o.P(1, 1, YL); o.P(0, 2, YL); o.P(2, 2, YL); o.P(1, 3, YL); },
      x:       (o) => { o.P(0, 0, RD); o.P(1, 1, RD); o.P(2, 2, RD); o.P(2, 0, RD); o.P(0, 2, RD); },
      lock:    (o) => { o.R(9, 8, 11, 10, GY, D); o.P(10, 7, D); },
      zzz:     (o) => { o.P(9, 0, D); o.P(10, 1, D); o.P(11, 2, D); },
      check:   (o) => { o.P(0, 9, GN); o.P(1, 10, GN); o.P(2, 9, GN); o.P(3, 8, GN); },
      up:      (o) => { o.P(10, 3, GN); o.P(9, 4, GN); o.P(10, 4, GN); o.P(11, 4, GN); o.col(10, 5, 7, GN); },
      crown:   (o) => { o.row(4, 8, 0, YL); o.P(4, 1, YL); o.P(6, 1, YL); o.P(8, 1, YL); },
      redcell: (o) => { o.R(7, 7, 8, 8, RD, RD); },
      stamp:   (o) => { o.R(7, 7, 10, 10, RD, RD); o.P(8, 8, W); o.P(9, 9, W); },
      heartsm: (o) => { o.P(9, 8, PK); o.P(11, 8, PK); o.P(10, 9, PK); o.P(9, 9, PK); o.P(11, 9, PK); o.P(10, 10, PK); }
    };

    const CAT_TINT = { Productivity: GN, Politics: BL, Social: PK, HR: YL, Sabotage: RD, Recovery: '#5aa08c', Executive: '#8a6ab8', Status: GY };

    /* one spec per card: base shape + overlay stamps */
    const PIX = {
      status_update:{b:'doc',o:['up']}, quick_sync:{b:'bubble',o:['check']}, deck_alignment:{b:'tetris',o:['sparkle']}, set_boundaries:{b:'shield'}, eager_volunteer:{b:'person',o:['up']},
      dumb_question:{b:'bubble',o:['question']}, weaponized_spreadsheet:{b:'sheet',o:['redcell','angry']},
      requirements_doc:{b:'doc',o:['check']}, ship_it:{b:'box',o:['up']}, refactor:{b:'duck',o:['sparkle']},
      deescalate:{b:'flame',o:['x']}, ticket_triage:{b:'doc',o:['exclaim']}, hype_cycle:{b:'chart',o:['up','sparkle']},
      rebrand:{b:'bulb',o:['cycleish' in OVER ? 'sparkle' : 'sparkle']}, always_be_closing:{b:'badge',o:['heartsm']},
      charm_offensive:{b:'heart',o:['sparkle']}, stakeholder_sync:{b:'cycle'}, prioritize:{b:'doc',o:['x']},
      query_everything:{b:'sheet',o:['question']}, correlation:{b:'chart',o:['x']},
      reply_all:{b:'envelope',o:['fire']}, circle_back:{b:'cycle',o:['zzz']}, take_offline:{b:'bubble',o:['x']},
      great_question:{b:'bubble',o:['question','sparkle']}, coffee_chat:{b:'mugs'}, schedule_followup:{b:'calendar',o:['exclaim']},
      ask_for_data:{b:'chart',o:['question']}, take_notes:{b:'doc',o:['sparkle']}, escalate_politely:{b:'envelope',o:['up']},
      camera_off:{b:'phone',o:['x']}, mute_notifications:{b:'bell',o:['x']}, pre_read:{b:'doc',o:['zzz']},
      dashboard:{b:'chart',o:['zzz']}, blame_vendor:{b:'box',o:['fire']}, deflect:{b:'shield',o:['sparkle']},
      quiet_quit:{b:'chair',o:['zzz']}, mentor_intern:{b:'person',o:['heartsm']}, calendar_tetris_card:{b:'tetris'},
      follow_process:{b:'doc',o:['lock']}, document_everything:{b:'sheet',o:['check']}, small_talk:{b:'bubble',o:['heartsm']},
      status_theater:{b:'person',o:['crown']}, thread_derail:{b:'bubble',o:['fire']}, snack_run:{b:'cake'},
      inbox_sweep:{b:'envelope',o:['check']}, nod_thoughtfully:{b:'person',o:['check']}, rubber_duck:{b:'duck'},
      pae:{b:'bubble',o:['up']},
      build_alignment:{b:'cycle',o:['heartsm']}, skip_level:{b:'ladder',o:['up']}, exec_summary:{b:'doc',o:['crown']},
      strategic_ambiguity:{b:'bubble',o:['zzz']}, task_force:{b:'bell',o:['exclaim']}, reframe:{b:'chart',o:['sparkle']},
      take_credit:{b:'badge',o:['crown','angry']}, blamestorm:{b:'flame',o:['exclaim']}, leak_deck:{b:'doc',o:['fire']},
      decline_guilt:{b:'calendar',o:['x']}, do_not_book:{b:'calendar',o:['lock']}, deep_work_sprint:{b:'bulb',o:['zzz']},
      soft_launch:{b:'rocket',o:['zzz']}, hard_pivot:{b:'cycle',o:['fire']}, protect_team:{b:'shield',o:['heartsm']},
      under_bus:{b:'box',o:['x','angry']}, legal_review:{b:'doc',o:['stamp']}, compliance_training:{b:'phone',o:['zzz']},
      review_prep:{b:'sheet',o:['sparkle']}, coffee_badge:{b:'mug',o:['check']}, managers_manager:{b:'person',o:['crown','angry']},
      weekend_warrior:{b:'clock',o:['fire']}, touch_grass:{b:'grass'}, meeting_cost:{b:'clock',o:['exclaim']},
      align_alignment:{b:'cycle',o:['question']}, grind_mindset:{b:'flame',o:['up']},
      quiet_influence:{b:'person',o:['zzz','crown']}, golden_rolodex:{b:'box',o:['crown']},
      restructure_narrative:{b:'doc',o:['angry','sparkle']}, burn_it_down:{b:'flame',o:['fire','exclaim']},
      zen_not_caring:{b:'grass',o:['sparkle']}, delegate:{b:'envelope',o:['up','crown']}, the_favor:{b:'heart',o:['lock']},
      unlimited_pto:{b:'calendar',o:['sparkle','zzz']}, founder_mode:{b:'rocket',o:['fire']},
      whisper_network:{b:'bubble',o:['lock']}, martyr_complex:{b:'heart',o:['fire']}, imposter_no_more:{b:'badge',o:['sparkle']},
      own_the_room:{b:'person',o:['sparkle','crown']}, severance:{b:'box',o:['lock']}, copy_paste_culture:{b:'sheet',o:['zzz']},
      offsite_epiphany:{b:'bulb',o:['sparkle']}, escalation_chain:{b:'ladder',o:['fire']}, all_day_dnd:{b:'clock',o:['lock']},
      leftover_cake:{b:'cake',o:['sparkle']}, per_my_last_email:{b:'envelope',o:['angry']},
      calendar_conflict:{b:'calendar',o:['zzz']},
      burnout:{b:'flame',o:['zzz']}, doomscroll:{b:'phone',o:['fire']}, cynicism:{b:'bubble',o:['angry']},
      bad_sleep:{b:'clock',o:['zzz']}, eod_request:{b:'clock',o:['angry','exclaim']}, pip_paperwork:{b:'doc',o:['angry','stamp']},
      cringe_card:{b:'person',o:['x']}, meeting_invite:{b:'calendar',o:['exclaim']}, corporate_debt:{b:'doc',o:['stamp','lock']}
    };
    g.STH.CARD_PIX = PIX;

    g.STH.cardPixelIcon = function (id) {
      const def = g.STH.CARD && g.STH.CARD[id];
      const tint = def ? (CAT_TINT[def.cat] || GY) : GY;
      const spec = PIX[id] || { b: 'box', o: ['question'] };
      const grid = makeGrid();
      const o = mk(grid);
      (BASES[spec.b] || BASES.box)(o, tint);
      (spec.o || []).forEach(k => { if (OVER[k]) OVER[k](o); });
      if (def && def.rarity === 'rare' && !(spec.o || []).includes('sparkle')) OVER.sparkle(o);
      let rects = '';
      for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
        if (grid[y][x]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${grid[y][x]}"/>`;
      }
      return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" class="pixicon" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">${rects}</svg>`;
    };
  })();


  /* =============== DESIGN-BOOK SPRITES ===============
     The character concept PNGs from the design book, shipped in assets/characters.
     Enemies/roles with a design-book portrait use it; everyone else keeps
     their procedural pixel sprite as a cohesive fallback. */
  (function () {
    const A = 'assets/characters/';
    const ENEMY_SPRITES = {
      npc_compliance: 'npc-compliance-manager', thoughts_guy: 'reply-guy', calendar_imp: 'calendar-imp',
      password_spirit: 'password-reset-spirit', onboarding_buddy: 'welcome-buddy', procurement: 'procurement-gatekeeper',
      slack_hydra: 'slack-thread-hydra', icebreaker_fac: 'icebreaker-facilitator', burned_engineer: 'doomer-senior-engineer',
      hrbp: 'hr-survey-wisp', budget_skeleton: 'budget-skeleton', roadmap_slime: 'roadmap-slime', task_slime: 'roadmap-slime',
      consulting_partner: 'big-brain-consultant', legal_reviewer: 'legal-review-gargoyle', calendar_tyrant: 'calendar-vampire',
      deck_perfectionist: 'the-deck-that-explains-nothing', thought_leader: 'linkedin-visionary',
      boss_reorg: 'reorg-hydra', recurring_meeting: 'the-recurring-meeting-with-no-end-date', chief_vibes: 'chief-vibes-officer'
    };
    const ROLE_SPRITES = {
      intern: 'new-hire', witch: 'spreadsheet-witch', developer: 'meeting-dodger', sales: 'office-diplomat',
      support: 'compliance-paladin', coordinator: 'product-goblin', marketing: 'burnout-prophet', analyst: 'intern-of-destiny'
    };
    const NPC_SPRITES = {
      handbook: 'haunted-handbook', oracle: 'office-supply-oracle', printer_elder: 'printer-elder',
      alfred: 'alfred', goblin: 'break-room-goblin', mimic: 'swag-box-mimic'
    };
    const img = (file, cls) => `<img class="booksprite ${cls || ''}" src="${A}${file}.png" alt="">`;
    g.STH.enemySprite = function (id) {
      return ENEMY_SPRITES[id] ? img(ENEMY_SPRITES[id], id === 'task_slime' ? 'small' : '') : g.STH.pixelEnemy(id);
    };
    g.STH.roleSprite = function (roleId, pose) {
      if (ROLE_SPRITES[roleId]) return img(ROLE_SPRITES[roleId], pose === 'ko' ? 'ko' : pose === 'cheer' ? 'cheer' : '');
      return g.STH.hero(pose || 'idle', roleId);
    };
    g.STH.npcSprite = function (key) { return NPC_SPRITES[key] ? img(NPC_SPRITES[key], 'npc') : ''; };
    g.STH.ENEMY_SPRITES = ENEMY_SPRITES; g.STH.ROLE_SPRITES = ROLE_SPRITES; g.STH.NPC_SPRITES = NPC_SPRITES;
  })();

})(typeof window !== 'undefined' ? window : globalThis);
