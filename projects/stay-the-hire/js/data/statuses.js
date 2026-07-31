/* Stay the Hire — status effect definitions (buffs/debuffs)
   Each status: id, name, icon, buff (bool), desc (tooltip, {n} = stacks), decay:
   'turn' = -1 stack at owner's turn end, 'endTurn' = expires fully at turn end, null = persistent for combat. */
(function (g) {
  g.STH = g.STH || {};
  g.STH.STATUSES = {
    /* ---- player buffs ---- */
    leverage:      { name: 'Leverage',              icon: '📈', buff: true,  decay: null,     desc: 'Your Pressure attacks deal +{n}.' },
    boundaries:    { name: 'Boundaries',            icon: '🧱', buff: true,  decay: null,     desc: 'Whenever a card grants Trust, gain +{n} extra.' },
    deepWork:      { name: 'Deep Work',             icon: '🎧', buff: true,  decay: 'endTurn',desc: 'This turn, Pressure attacks deal +{n}. Expires at end of turn.' },
    psychSafety:   { name: 'Psychological Safety',  icon: '🛡️', buff: true,  decay: 'turn',   desc: 'Trust is not lost at the start of your turn. {n} turn(s) left.' },
    inTheLoop:     { name: 'In the Loop',           icon: '🔄', buff: true,  decay: 'turn',   desc: 'Draw +1 card at turn start. {n} turn(s) left.' },
    execVisibility:{ name: 'Executive Visibility',  icon: '👁️', buff: true,  decay: null,     desc: 'Gain +{n} Reputation when this encounter ends.' },
    sponsored:     { name: 'Protected by Sponsor',  icon: '🤝', buff: true,  decay: null,     desc: 'Negate the next {n} debuff(s) applied to you.' },
    delegation:    { name: 'Delegation',            icon: '📤', buff: true,  decay: null,     desc: 'Gain {n} Trust at the start of each turn.' },
    aligned:       { name: 'Aligned',               icon: '📐', buff: true,  decay: null,     desc: 'At turn start, if you played 3+ cards last turn, gain {n} In the Loop.' },

    /* ---- player debuffs ---- */
    imposter:      { name: 'Imposter Syndrome',     icon: '🫥', buff: false, decay: 'turn',   desc: 'Your Pressure attacks deal 25% less. {n} turn(s) left.' },
    legalRisk:     { name: 'Legal Risk',            icon: '⚖️', buff: false, decay: 'turn',   desc: 'You take 50% more Stress from attacks. {n} turn(s) left.' },
    calendarFlood: { name: 'Calendar Flood',        icon: '📅', buff: false, decay: 'turn',   desc: 'Draw 1 fewer card at turn start. {n} turn(s) left.' },
    meetingFatigue:{ name: 'Meeting Fatigue',       icon: '🥱', buff: false, decay: 'turn',   desc: 'Gain {n} Stress at the end of your turn.' },
    perfPlan:      { name: 'Performance Plan',      icon: '📋', buff: false, decay: 'turn',   desc: '-1 Influence at turn start. {n} turn(s) left.' },
    paralysis:     { name: 'Decision Paralysis',    icon: '🌀', buff: false, decay: 'turn',   desc: 'The first card you play each turn costs 1 more. {n} turn(s) left.' },
    cringe:        { name: 'Cringe',                icon: '😬', buff: false, decay: null,     desc: 'Lose {n} Reputation when this encounter ends.' },
    reorgRumor:    { name: 'Reorg Rumor',           icon: '📉', buff: false, decay: 'turn',   desc: 'Whenever you draw a Burnout card, gain 2 Stress. {n} turn(s) left.' },
    overloaded:    { name: 'Overloaded',             icon: '📚', buff: false, decay: 'turn',   desc: 'You gain 25% less Trust. {n} turn(s) left.' },

    /* ---- enemy statuses ---- */
    onRecord:      { name: 'On the Record',         icon: '🎙️', buff: false, decay: 'turn',   desc: 'Takes 50% more Pressure. {n} turn(s) left.' },
    flustered:     { name: 'Flustered',             icon: '😰', buff: false, decay: 'turn',   desc: 'Deals 25% less Stress. {n} turn(s) left.' },
    paperTrail:    { name: 'Paper Trail',           icon: '🧾', buff: false, decay: 'turn',   desc: 'Loses {n} Resolve at the start of its turn, then the trail fades by 1.' },
    buried:        { name: 'Buried in Review',      icon: '📚', buff: false, decay: 'turn',   desc: 'Skips its next {n} turn(s). Legal is looking into it.' },
    eLeverage:     { name: 'Momentum',              icon: '📈', buff: true,  decay: null,     desc: 'Its attacks deal +{n} Stress.' }
  };

  /* Tooltip text for core resources */
  g.STH.RESOURCE_HELP = {
    stress:  'Stress — your danger meter. If it reaches maximum, you burn out and the run ends. Reduced by Recovery cards and Coffee Breaks.',
    trust:   'Trust — temporary defense. Incoming Stress is absorbed by Trust first. Resets at the start of your turn unless an effect says otherwise.',
    influence:'Influence — energy spent to play cards. Refreshes every turn.',
    rep:     'Reputation — how the company sees you (0–100). Affects events, reviews, rewards and your ending.',
    pc:      'Political Capital — rare strategic currency. Spent on powerful cards, event choices, and Reorg favors.',
    resolve: 'Resolve — the enemy’s agenda strength. Reduce it to 0 with Pressure to end the encounter.'
  };
})(typeof window !== 'undefined' ? window : globalThis);
