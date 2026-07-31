/* Stay the Hire — card definitions.
   Effects (fx) are executed in order by engine.applyCardFx. Text is written to match fx exactly.
   Effect vocabulary:
     p / pAll / pPerEnemy / pPerBurnout   – Pressure damage
     t / tStress                          – Trust gain
     heal / stress / healToP              – Stress changes
     draw / discardRandom / inf / pc / rep
     eStatus / eStatusAll / status / cleanse
     addCard / removeBurnout / copyRandomHand / upgradeHand
     execute / luck / if / onKill
   Card flags: exhaust, retain, innate, unplayable, pcCost, endTurnInHand, onDrawStress
   `up` contains overrides that define the upgraded version (name gets a +). */
(function (g) {
  g.STH = g.STH || {};
  const C = [];
  const card = (o) => C.push(o);

  /* =============== STARTERS (basic) =============== */
  card({ id:'status_update', name:'Status Update', cost:1, cat:'Productivity', rarity:'starter', target:'enemy',
    fx:[{p:5}], text:'Deal 5 Pressure.', flavor:'“It’s technically progress.”',
    up:{ fx:[{p:8}], text:'Deal 8 Pressure.' } });
  card({ id:'set_boundaries', name:'Set Boundaries', cost:1, cat:'Recovery', rarity:'starter', target:'none',
    fx:[{t:5}], text:'Gain 5 Trust.', flavor:'“No” is a complete sentence. Legally.',
    up:{ fx:[{t:8}], text:'Gain 8 Trust.' } });

  /* =============== ROLE STARTERS =============== */
  card({ id:'eager_volunteer', name:'Eager Volunteer', cost:0, cat:'Social', rarity:'starter', target:'enemy',
    fx:[{p:3},{stress:1}], text:'Deal 3 Pressure. Gain 1 Stress.', flavor:'Your hand was up before the question ended.',
    up:{ fx:[{p:6},{stress:1}], text:'Deal 6 Pressure. Gain 1 Stress.' } });
  card({ id:'dumb_question', name:'Ask the Dumb Question', cost:1, cat:'Social', rarity:'starter', target:'none',
    fx:[{draw:2}], text:'Draw 2 cards.', flavor:'Everyone else was also wondering. Cowards.',
    up:{ fx:[{draw:3}], text:'Draw 3 cards.' } });
  card({ id:'weaponized_spreadsheet', name:'Weaponized Spreadsheet', cost:2, cat:'Productivity', rarity:'starter', target:'enemy',
    fx:[{p:8},{eStatus:{id:'onRecord',n:1}}], text:'Deal 8 Pressure. Apply 1 On the Record.', flavor:'Tab 7 contains the truth. Nobody survives Tab 7.',
    up:{ fx:[{p:11},{eStatus:{id:'onRecord',n:2}}], text:'Deal 11 Pressure. Apply 2 On the Record.' } });
  card({ id:'requirements_doc', name:'Requirements Doc', cost:1, cat:'Productivity', rarity:'starter', target:'none',
    fx:[{t:4},{draw:1}], text:'Gain 4 Trust. Draw 1 card.', flavor:'Version 14_final_FINAL_v2 (use this one).',
    up:{ fx:[{t:6},{draw:1}], text:'Gain 6 Trust. Draw 1 card.' } });
  card({ id:'ship_it', name:'Ship It', cost:2, cat:'Productivity', rarity:'starter', target:'enemy',
    fx:[{p:10},{stress:2}], text:'Deal 10 Pressure. Gain 2 Stress.', flavor:'Works on your machine. Your machine is now production.',
    up:{ fx:[{p:14},{stress:2}], text:'Deal 14 Pressure. Gain 2 Stress.' } });
  card({ id:'refactor', name:'Refactor', cost:1, cat:'Recovery', rarity:'starter', target:'none',
    fx:[{removeBurnout:1},{t:3}], text:'Exhaust a Burnout card from your hand or piles. Gain 3 Trust.', flavor:'The code is cleaner. You are not.',
    up:{ fx:[{removeBurnout:1},{t:6}], text:'Exhaust a Burnout card from your hand or piles. Gain 6 Trust.' } });
  card({ id:'deescalate', name:'De-escalate', cost:1, cat:'Social', rarity:'starter', target:'enemy',
    fx:[{t:6},{eStatus:{id:'flustered',n:1}}], text:'Gain 6 Trust. Apply 1 Flustered.', flavor:'“I hear you” — a sentence that has never once meant that.',
    up:{ fx:[{t:8},{eStatus:{id:'flustered',n:2}}], text:'Gain 8 Trust. Apply 2 Flustered.' } });
  card({ id:'ticket_triage', name:'Ticket Triage', cost:1, cat:'Productivity', rarity:'starter', target:'enemy',
    fx:[{p:4},{draw:1}], text:'Deal 4 Pressure. Draw 1 card.', flavor:'Priority: URGENT. Filed: 2019.',
    up:{ fx:[{p:7},{draw:1}], text:'Deal 7 Pressure. Draw 1 card.' } });
  card({ id:'hype_cycle', name:'Hype Cycle', cost:1, cat:'Social', rarity:'starter', target:'enemy',
    fx:[{p:5},{if:{cond:'repHigh', then:[{p:3}]}}], text:'Deal 5 Pressure. If your Reputation is 60+, deal 3 more.', flavor:'Momentum is a strategy if you say it confidently.',
    up:{ fx:[{p:7},{if:{cond:'repHigh', then:[{p:4}]}}], text:'Deal 7 Pressure. If your Reputation is 60+, deal 4 more.' } });
  card({ id:'rebrand', name:'Rebrand', cost:1, cat:'Politics', rarity:'starter', target:'none',
    fx:[{t:4},{rep:1}], text:'Gain 4 Trust and 1 Reputation.', flavor:'Same product. New font. Applause.',
    up:{ fx:[{t:6},{rep:2}], text:'Gain 6 Trust and 2 Reputation.' } });
  card({ id:'always_be_closing', name:'Always Be Closing', cost:1, cat:'Politics', rarity:'starter', target:'enemy',
    fx:[{p:6},{onKill:{pc:1}}], text:'Deal 6 Pressure. If this defeats an enemy, gain 1 Political Capital.', flavor:'Coffee is for people who update the CRM.',
    up:{ fx:[{p:9},{onKill:{pc:1}}], text:'Deal 9 Pressure. If this defeats an enemy, gain 1 Political Capital.' } });
  card({ id:'charm_offensive', name:'Charm Offensive', cost:1, cat:'Social', rarity:'starter', target:'none',
    fx:[{t:4}], text:'Gain 4 Trust.', flavor:'Remembers everyone’s kids’ names. Files them under LEVERAGE.',
    up:{ fx:[{t:6},{pc:1}], text:'Gain 6 Trust and 1 Political Capital.' } });
  card({ id:'stakeholder_sync', name:'Stakeholder Sync', cost:1, cat:'Politics', rarity:'starter', target:'enemy',
    fx:[{p:3},{t:3}], text:'Deal 3 Pressure. Gain 3 Trust.', flavor:'Thirty minutes to agree we agree.',
    up:{ fx:[{p:5},{t:5}], text:'Deal 5 Pressure. Gain 5 Trust.' } });
  card({ id:'prioritize', name:'Prioritize Ruthlessly', cost:1, cat:'Productivity', rarity:'starter', target:'none',
    fx:[{draw:2},{discardRandom:1}], text:'Draw 2 cards, then discard 1 at random.', flavor:'Everything is P0, which is how nothing is.',
    up:{ fx:[{draw:2}], text:'Draw 2 cards.' } });
  card({ id:'query_everything', name:'Query Everything', cost:1, cat:'Productivity', rarity:'starter', target:'enemy',
    fx:[{p:5},{if:{cond:'enemyDebuffed', then:[{p:3}]}}], text:'Deal 5 Pressure. If the target has a debuff, deal 3 more.', flavor:'SELECT excuse FROM management WHERE valid = TRUE; — 0 rows.',
    up:{ fx:[{p:7},{if:{cond:'enemyDebuffed', then:[{p:4}]}}], text:'Deal 7 Pressure. If the target has a debuff, deal 4 more.' } });
  card({ id:'correlation', name:'Correlation ≠ Causation', cost:1, cat:'Politics', rarity:'starter', target:'enemy',
    fx:[{eStatus:{id:'flustered',n:2}},{draw:1}], text:'Apply 2 Flustered. Draw 1 card.', flavor:'The chart proves nothing, beautifully.',
    up:{ fx:[{eStatus:{id:'flustered',n:3}},{draw:1}], text:'Apply 3 Flustered. Draw 1 card.' } });

  /* =============== COMMON =============== */
  card({ id:'reply_all', name:'Reply All', cost:1, cat:'Social', rarity:'common', target:'none',
    fx:[{pAll:4},{stress:1}], text:'Deal 4 Pressure to ALL enemies. Gain 1 Stress.', flavor:'Now everyone knows. Everyone.',
    up:{ fx:[{pAll:6},{stress:1}], text:'Deal 6 Pressure to ALL enemies. Gain 1 Stress.' } });
  card({ id:'circle_back', name:'Circle Back', cost:1, cat:'Politics', rarity:'common', target:'none',
    fx:[{t:4},{draw:1}], text:'Gain 4 Trust. Draw 1 card.', flavor:'The future: where this becomes someone else’s problem.',
    up:{ fx:[{t:6},{draw:1}], text:'Gain 6 Trust. Draw 1 card.' } });
  card({ id:'take_offline', name:'Take This Offline', cost:1, cat:'Politics', rarity:'common', target:'enemy',
    fx:[{p:6},{eStatus:{id:'flustered',n:1}}], text:'Deal 6 Pressure. Apply 1 Flustered.', flavor:'“Offline” meaning: never, anywhere, to anyone.',
    up:{ fx:[{p:8},{eStatus:{id:'flustered',n:2}}], text:'Deal 8 Pressure. Apply 2 Flustered.' } });
  card({ id:'great_question', name:'Say “Great Question”', cost:0, cat:'Social', rarity:'common', target:'none',
    fx:[{t:3}], text:'Gain 3 Trust.', flavor:'You have no idea. Neither do they. Harmony.',
    up:{ fx:[{t:5}], text:'Gain 5 Trust.' } });
  card({ id:'coffee_chat', name:'Coffee Chat', cost:0, cat:'Social', rarity:'common', target:'none', exhaust:true,
    fx:[{heal:2},{draw:1}], text:'Heal 2 Stress. Draw 1 card. Exhaust.', flavor:'Officially casual. Unofficially reconnaissance.',
    up:{ fx:[{heal:4},{draw:1}], text:'Heal 4 Stress. Draw 1 card. Exhaust.' } });
  card({ id:'schedule_followup', name:'Schedule Follow-Up', cost:1, cat:'Productivity', rarity:'common', target:'enemy', retain:true,
    fx:[{p:5}], text:'Deal 5 Pressure. Retain.', flavor:'The meeting that outlives us all.',
    up:{ fx:[{p:7}], text:'Deal 7 Pressure. Retain.' } });
  card({ id:'ask_for_data', name:'Ask for Data', cost:1, cat:'Productivity', rarity:'common', target:'none',
    fx:[{draw:2}], text:'Draw 2 cards.', flavor:'A polite way to say “prove it, coward.”',
    up:{ fx:[{draw:3}], text:'Draw 3 cards.' } });
  card({ id:'take_notes', name:'Take Notes Aggressively', cost:1, cat:'Productivity', rarity:'common', target:'none',
    fx:[{t:4},{status:{id:'inTheLoop',n:1}}], text:'Gain 4 Trust. Gain 1 In the Loop.', flavor:'The typing sounds are a threat.',
    up:{ fx:[{t:6},{status:{id:'inTheLoop',n:1}}], text:'Gain 6 Trust. Gain 1 In the Loop.' } });
  card({ id:'escalate_politely', name:'Escalate Politely', cost:2, cat:'Politics', rarity:'common', target:'enemy',
    fx:[{p:9},{if:{cond:'enemyBlocked', then:[{p:4}]}}], text:'Deal 9 Pressure. If the target has Deniability, deal 4 more.', flavor:'“Per my last email” — a declaration of war.',
    up:{ fx:[{p:12},{if:{cond:'enemyBlocked', then:[{p:5}]}}], text:'Deal 12 Pressure. If the target has Deniability, deal 5 more.' } });
  card({ id:'camera_off', name:'Turn Camera Off', cost:1, cat:'Recovery', rarity:'common', target:'none',
    fx:[{t:5},{heal:2}], text:'Gain 5 Trust. Heal 2 Stress.', flavor:'You are a black rectangle now. Black rectangles feel nothing.',
    up:{ fx:[{t:7},{heal:3}], text:'Gain 7 Trust. Heal 3 Stress.' } });
  card({ id:'mute_notifications', name:'Mute Notifications', cost:1, cat:'Recovery', rarity:'common', target:'none', exhaust:true,
    fx:[{heal:4}], text:'Heal 4 Stress. Exhaust.', flavor:'The badge count is a lie you can silence.',
    up:{ fx:[{heal:7}], text:'Heal 7 Stress. Exhaust.' } });
  card({ id:'pre_read', name:'Pre-Read Nobody Opens', cost:0, cat:'Productivity', rarity:'common', target:'enemy',
    fx:[{eStatus:{id:'onRecord',n:1}}], text:'Apply 1 On the Record.', flavor:'Attached is context nobody will have.',
    up:{ fx:[{eStatus:{id:'onRecord',n:2}}], text:'Apply 2 On the Record.' } });
  card({ id:'dashboard', name:'Dashboard Nobody Reads', cost:2, cat:'Productivity', rarity:'common', target:'enemy',
    fx:[{t:6},{eStatus:{id:'paperTrail',n:3}}], text:'Gain 6 Trust. Apply 3 Paper Trail.', flavor:'The metrics quietly document their failures.',
    up:{ fx:[{t:8},{eStatus:{id:'paperTrail',n:4}}], text:'Gain 8 Trust. Apply 4 Paper Trail.' } });
  card({ id:'blame_vendor', name:'Blame the Vendor', cost:1, cat:'Sabotage', rarity:'common', target:'enemy',
    fx:[{p:7},{rep:-1}], text:'Deal 7 Pressure. Lose 1 Reputation.', flavor:'The vendor, conveniently, is not in this meeting.',
    up:{ fx:[{p:10},{rep:-1}], text:'Deal 10 Pressure. Lose 1 Reputation.' } });
  card({ id:'deflect', name:'Deflect', cost:1, cat:'Sabotage', rarity:'common', target:'none',
    fx:[{t:5},{if:{cond:'repLow', then:[{t:3}]}}], text:'Gain 5 Trust. If your Reputation is below 40, gain 3 more.', flavor:'Nothing sticks to someone nobody expects anything from.',
    up:{ fx:[{t:7},{if:{cond:'repLow', then:[{t:4}]}}], text:'Gain 7 Trust. If your Reputation is below 40, gain 4 more.' } });
  card({ id:'quiet_quit', name:'Quiet Quit', cost:1, cat:'Recovery', rarity:'common', target:'none',
    fx:[{heal:3},{t:3},{rep:-1}], text:'Heal 3 Stress. Gain 3 Trust. Lose 1 Reputation.', flavor:'Doing exactly your job is considered an act of rebellion.',
    up:{ fx:[{heal:5},{t:5},{rep:-1}], text:'Heal 5 Stress. Gain 5 Trust. Lose 1 Reputation.' } });
  card({ id:'mentor_intern', name:'Mentor the Intern', cost:1, cat:'Social', rarity:'common', target:'none', exhaust:true,
    fx:[{rep:2},{t:4}], text:'Gain 2 Reputation and 4 Trust. Exhaust.', flavor:'Someday they will remember this. At your deposition.',
    up:{ fx:[{rep:3},{t:6}], text:'Gain 3 Reputation and 6 Trust. Exhaust.' } });
  card({ id:'calendar_tetris_card', name:'Calendar Tetris', cost:0, cat:'Productivity', rarity:'common', target:'none', retain:true,
    fx:[{draw:1}], text:'Draw 1 card. Retain.', flavor:'There is a 7-minute slot on Thursday. It is yours now.',
    up:{ fx:[{draw:2}], text:'Draw 2 cards. Retain.' } });
  card({ id:'follow_process', name:'Follow the Process', cost:1, cat:'HR', rarity:'common', target:'none',
    fx:[{t:5},{pc:1}], text:'Gain 5 Trust and 1 Political Capital.', flavor:'The form to request the form has been approved.',
    up:{ fx:[{t:7},{pc:1}], text:'Gain 7 Trust and 1 Political Capital.' } });
  card({ id:'document_everything', name:'Document Everything', cost:1, cat:'HR', rarity:'common', target:'enemy',
    fx:[{eStatus:{id:'paperTrail',n:4}}], text:'Apply 4 Paper Trail.', flavor:'HR loves receipts.',
    up:{ fx:[{eStatus:{id:'paperTrail',n:6}}], text:'Apply 6 Paper Trail.' } });
  card({ id:'small_talk', name:'Small Talk', cost:0, cat:'Social', rarity:'common', target:'none',
    fx:[{t:2},{heal:1}], text:'Gain 2 Trust. Heal 1 Stress.', flavor:'“Busy week?” The weather of offices.',
    up:{ fx:[{t:3},{heal:2}], text:'Gain 3 Trust. Heal 2 Stress.' } });
  card({ id:'status_theater', name:'Status Theater', cost:1, cat:'Politics', rarity:'common', target:'enemy',
    fx:[{p:5},{rep:1}], text:'Deal 5 Pressure. Gain 1 Reputation.', flavor:'The work is invisible. The update about the work is legendary.',
    up:{ fx:[{p:7},{rep:1}], text:'Deal 7 Pressure. Gain 1 Reputation.' } });
  card({ id:'thread_derail', name:'Slack Thread Derail', cost:1, cat:'Sabotage', rarity:'common', target:'none',
    fx:[{pAll:3},{eStatusAll:{id:'flustered',n:1}}], text:'Deal 3 Pressure to ALL enemies. Apply 1 Flustered to ALL.', flavor:'One well-placed “should this be a doc?” and chaos reigns.',
    up:{ fx:[{pAll:5},{eStatusAll:{id:'flustered',n:1}}], text:'Deal 5 Pressure to ALL enemies. Apply 1 Flustered to ALL.' } });
  card({ id:'snack_run', name:'Snack Run', cost:0, cat:'Recovery', rarity:'common', target:'none', exhaust:true,
    fx:[{heal:3}], text:'Heal 3 Stress. Exhaust.', flavor:'The vending machine accepts your sadness. Exact change only.',
    up:{ fx:[{heal:5}], text:'Heal 5 Stress. Exhaust.' } });
  card({ id:'inbox_sweep', name:'Inbox Sweep', cost:1, cat:'Recovery', rarity:'common', target:'none',
    fx:[{removeBurnout:1},{t:4}], text:'Exhaust a Burnout card from your hand or piles. Gain 4 Trust.', flavor:'Select all. Mark as read. Feel god-like for nine seconds.',
    up:{ fx:[{removeBurnout:2},{t:6}], text:'Exhaust up to 2 Burnout cards from your hand or piles. Gain 6 Trust.' } });
  card({ id:'nod_thoughtfully', name:'Nod Thoughtfully', cost:0, cat:'Social', rarity:'common', target:'enemy',
    fx:[{p:1},{t:1}], text:'Deal 1 Pressure. Gain 1 Trust.', flavor:'Contributes nothing. Signals everything.',
    up:{ fx:[{p:3},{t:2}], text:'Deal 3 Pressure. Gain 2 Trust.' } });
  card({ id:'rubber_duck', name:'Rubber Duck Debug', cost:1, cat:'Productivity', rarity:'common', target:'enemy',
    fx:[{p:4,times:2}], text:'Deal 4 Pressure twice.', flavor:'The duck already knew. The duck always knows.',
    up:{ fx:[{p:4,times:3}], text:'Deal 4 Pressure three times.' } });
  card({ id:'pae', name:'Passive-Aggressive Emoji', cost:0, cat:'Sabotage', rarity:'common', target:'enemy',
    fx:[{p:3},{eStatus:{id:'flustered',n:1}}], text:'Deal 3 Pressure. Apply 1 Flustered.', flavor:'👍',
    up:{ fx:[{p:5},{eStatus:{id:'flustered',n:1}}], text:'Deal 5 Pressure. Apply 1 Flustered.' } });

  /* =============== UNCOMMON =============== */
  card({ id:'build_alignment', name:'Build Alignment', cost:2, cat:'Politics', rarity:'uncommon', target:'none',
    fx:[{t:8},{pc:1}], text:'Gain 8 Trust and 1 Political Capital.', flavor:'Alignment: when everyone is equally unhappy in the same direction.',
    up:{ fx:[{t:11},{pc:2}], text:'Gain 11 Trust and 2 Political Capital.' } });
  card({ id:'skip_level', name:'Skip-Level Meeting', cost:2, cat:'Politics', rarity:'uncommon', target:'enemy',
    fx:[{p:10},{rep:2},{stress:2}], text:'Deal 10 Pressure. Gain 2 Reputation and 2 Stress.', flavor:'Your manager will hear about this. That’s the point.',
    up:{ fx:[{p:13},{rep:2},{stress:2}], text:'Deal 13 Pressure. Gain 2 Reputation and 2 Stress.' } });
  card({ id:'exec_summary', name:'Executive Summary', cost:1, cat:'Executive', rarity:'uncommon', target:'none',
    fx:[{draw:2},{pc:1}], text:'Draw 2 cards. Gain 1 Political Capital.', flavor:'Three bullet points. Two are the same bullet point.',
    up:{ fx:[{draw:3},{pc:1}], text:'Draw 3 cards. Gain 1 Political Capital.' } });
  card({ id:'strategic_ambiguity', name:'Strategic Ambiguity', cost:1, cat:'Politics', rarity:'uncommon', target:'none',
    fx:[{t:6},{eStatusAll:{id:'flustered',n:1}}], text:'Gain 6 Trust. Apply 1 Flustered to ALL enemies.', flavor:'Nobody can attack a position you never took.',
    up:{ fx:[{t:9},{eStatusAll:{id:'flustered',n:1}}], text:'Gain 9 Trust. Apply 1 Flustered to ALL enemies.' } });
  card({ id:'task_force', name:'Announce a Task Force', cost:2, cat:'Politics', rarity:'uncommon', target:'none',
    fx:[{t:5},{status:{id:'inTheLoop',n:2}}], text:'Gain 5 Trust. Gain 2 In the Loop.', flavor:'Nothing will happen, visibly.',
    up:{ fx:[{t:8},{status:{id:'inTheLoop',n:2}}], text:'Gain 8 Trust. Gain 2 In the Loop.' } });
  card({ id:'reframe', name:'Reframe the Problem', cost:1, cat:'Politics', rarity:'uncommon', target:'enemy',
    fx:[{healToP:4}], text:'Heal up to 4 Stress. Deal Pressure equal to the amount healed.', flavor:'It’s not a bug. It’s an insight funnel.',
    up:{ fx:[{healToP:6}], text:'Heal up to 6 Stress. Deal Pressure equal to the amount healed.' } });
  card({ id:'take_credit', name:'Take Credit', cost:1, cat:'Sabotage', rarity:'uncommon', target:'enemy',
    fx:[{p:6},{rep:2},{addCard:{id:'burnout',n:1,where:'discard'}}], text:'Deal 6 Pressure. Gain 2 Reputation. Shuffle a Burnout into your discard pile.', flavor:'“We” did it. “We” meaning you. “You” meaning them.',
    up:{ fx:[{p:9},{rep:3},{addCard:{id:'burnout',n:1,where:'discard'}}], text:'Deal 9 Pressure. Gain 3 Reputation. Shuffle a Burnout into your discard pile.' } });
  card({ id:'blamestorm', name:'Blamestorm', cost:2, cat:'Sabotage', rarity:'uncommon', target:'none',
    fx:[{pAll:6},{rep:-1}], text:'Deal 6 Pressure to ALL enemies. Lose 1 Reputation.', flavor:'Like brainstorming, but the ideas are people.',
    up:{ fx:[{pAll:9},{rep:-1}], text:'Deal 9 Pressure to ALL enemies. Lose 1 Reputation.' } });
  card({ id:'leak_deck', name:'Leak the Deck', cost:1, cat:'Sabotage', rarity:'uncommon', target:'none', exhaust:true,
    fx:[{eStatusAll:{id:'onRecord',n:2}},{rep:-2}], text:'Apply 2 On the Record to ALL enemies. Lose 2 Reputation. Exhaust.', flavor:'Slide 12 was never meant for daylight.',
    up:{ fx:[{eStatusAll:{id:'onRecord',n:3}},{rep:-2}], text:'Apply 3 On the Record to ALL enemies. Lose 2 Reputation. Exhaust.' } });
  card({ id:'decline_guilt', name:'Decline Without Guilt', cost:0, cat:'Recovery', rarity:'uncommon', target:'none', exhaust:true,
    fx:[{t:4}], text:'Gain 4 Trust. Exhaust.', flavor:'“Declined” with no comment. Devastating. Iconic.',
    up:{ fx:[{t:6}], text:'Gain 6 Trust. Exhaust.', exhaust:true } });
  card({ id:'do_not_book', name:'Do-Not-Book Block', cost:1, cat:'Recovery', rarity:'uncommon', target:'none',
    fx:[{heal:5},{status:{id:'psychSafety',n:1}}], text:'Heal 5 Stress. Gain 1 Psychological Safety.', flavor:'A calendar event titled “BUSY”. Contents: staring.',
    up:{ fx:[{heal:7},{status:{id:'psychSafety',n:2}}], text:'Heal 7 Stress. Gain 2 Psychological Safety.' } });
  card({ id:'deep_work_sprint', name:'Deep Work Sprint', cost:2, cat:'Productivity', rarity:'uncommon', target:'none',
    fx:[{status:{id:'deepWork',n:3}},{draw:1}], text:'Gain 3 Deep Work. Draw 1 card.', flavor:'Slack status: away. Soul status: present.',
    up:{ fx:[{status:{id:'deepWork',n:5}},{draw:1}], text:'Gain 5 Deep Work. Draw 1 card.' } });
  card({ id:'soft_launch', name:'Soft Launch', cost:1, cat:'Politics', rarity:'uncommon', target:'enemy', exhaust:true,
    fx:[{p:4},{luck:1}], text:'Deal 4 Pressure. Future events lean friendlier. Exhaust.', flavor:'Announce quietly, so failure is also quiet.',
    up:{ fx:[{p:6},{luck:1}], text:'Deal 6 Pressure. Future events lean friendlier. Exhaust.' } });
  card({ id:'hard_pivot', name:'Hard Pivot', cost:2, cat:'Executive', rarity:'uncommon', target:'none',
    fx:[{pAll:8},{addCard:{id:'burnout',n:1,where:'discard'}}], text:'Deal 8 Pressure to ALL enemies. Shuffle a Burnout into your discard pile.', flavor:'We were a food app. We are now a defense contractor.',
    up:{ fx:[{pAll:11},{addCard:{id:'burnout',n:1,where:'discard'}}], text:'Deal 11 Pressure to ALL enemies. Shuffle a Burnout into your discard pile.' } });
  card({ id:'protect_team', name:'Protect the Team', cost:2, cat:'Social', rarity:'uncommon', target:'none', moral:'good',
    fx:[{t:10},{rep:2}], text:'Gain 10 Trust and 2 Reputation.', flavor:'You took the meeting so they didn’t have to. A hero.',
    up:{ fx:[{t:13},{rep:3}], text:'Gain 13 Trust and 3 Reputation.' } });
  card({ id:'under_bus', name:'Throw Under the Bus', cost:0, cat:'Sabotage', rarity:'uncommon', target:'enemy', exhaust:true, moral:'bad',
    fx:[{p:8},{rep:-3}], text:'Deal 8 Pressure. Lose 3 Reputation. Exhaust.', flavor:'The bus was already coming. You merely provided coordinates.',
    up:{ fx:[{p:12},{rep:-3}], text:'Deal 12 Pressure. Lose 3 Reputation. Exhaust.' } });
  card({ id:'legal_review', name:'Legal Review', cost:2, cat:'HR', rarity:'uncommon', target:'enemy', exhaust:true,
    fx:[{eStatus:{id:'buried',n:1}}], text:'The target skips its next turn. Exhaust.', flavor:'Estimated review time: 6–8 business eternities.',
    up:{ cost:1, fx:[{eStatus:{id:'buried',n:1}}], text:'The target skips its next turn. Exhaust.' } });
  card({ id:'compliance_training', name:'Compliance Training', cost:1, cat:'HR', rarity:'uncommon', target:'none',
    fx:[{t:5},{eStatusAll:{id:'paperTrail',n:2}}], text:'Gain 5 Trust. Apply 2 Paper Trail to ALL enemies.', flavor:'45 minutes. Unskippable. The video buffers on purpose.',
    up:{ fx:[{t:7},{eStatusAll:{id:'paperTrail',n:3}}], text:'Gain 7 Trust. Apply 3 Paper Trail to ALL enemies.' } });
  card({ id:'review_prep', name:'Performance Review Prep', cost:1, cat:'Productivity', rarity:'uncommon', target:'none',
    fx:[{t:5},{rep:1},{draw:1}], text:'Gain 5 Trust and 1 Reputation. Draw 1 card.', flavor:'A document listing your achievements, i.e., fan fiction with receipts.',
    up:{ fx:[{t:7},{rep:1},{draw:1}], text:'Gain 7 Trust and 1 Reputation. Draw 1 card.' } });
  card({ id:'coffee_badge', name:'Coffee Badging', cost:0, cat:'Social', rarity:'uncommon', target:'none', exhaust:true,
    fx:[{heal:2},{pc:1}], text:'Heal 2 Stress. Gain 1 Political Capital. Exhaust.', flavor:'Badge in. Be seen. Vanish like office folklore.',
    up:{ fx:[{heal:4},{pc:1}], text:'Heal 4 Stress. Gain 1 Political Capital. Exhaust.' } });
  card({ id:'managers_manager', name:'Manager’s Manager Meeting', cost:2, cat:'Politics', rarity:'uncommon', target:'enemy',
    fx:[{p:12},{stress:2}], text:'Deal 12 Pressure. Gain 2 Stress.', flavor:'Going over someone’s head requires excellent posture.',
    up:{ fx:[{p:15},{stress:2}], text:'Deal 15 Pressure. Gain 2 Stress.' } });
  card({ id:'weekend_warrior', name:'Weekend Warrior', cost:0, cat:'Productivity', rarity:'uncommon', target:'enemy',
    fx:[{p:6},{stress:3},{addCard:{id:'bad_sleep',n:1,where:'draw'}}], text:'Deal 6 Pressure. Gain 3 Stress. Shuffle a Bad Sleep into your draw pile.', flavor:'You answered at 11pm once. It is now a covenant.',
    up:{ fx:[{p:9},{stress:3},{addCard:{id:'bad_sleep',n:1,where:'draw'}}], text:'Deal 9 Pressure. Gain 3 Stress. Shuffle a Bad Sleep into your draw pile.' } });
  card({ id:'touch_grass', name:'Touch Grass', cost:1, cat:'Recovery', rarity:'uncommon', target:'none', exhaust:true,
    fx:[{heal:6}], text:'Heal 6 Stress. Exhaust.', flavor:'Grass: the original open floor plan.',
    up:{ fx:[{heal:6},{removeBurnout:1}], text:'Heal 6 Stress. Exhaust a Burnout card from your hand or piles. Exhaust.' } });
  card({ id:'meeting_cost', name:'Meeting Cost Calculator', cost:1, cat:'Productivity', rarity:'uncommon', target:'enemy',
    fx:[{pPerEnemy:4}], text:'Deal 4 Pressure for each enemy in this encounter.', flavor:'This sync costs $2,400/hour. The agenda is “vibes”.',
    up:{ fx:[{pPerEnemy:6}], text:'Deal 6 Pressure for each enemy in this encounter.' } });
  card({ id:'align_alignment', name:'Align on Alignment', cost:0, cat:'Politics', rarity:'uncommon', target:'none', exhaust:true,
    fx:[{pc:1},{draw:1}], text:'Gain 1 Political Capital. Draw 1 card. Exhaust.', flavor:'A pre-meeting to align on the alignment meeting.',
    up:{ fx:[{pc:2},{draw:1}], text:'Gain 2 Political Capital. Draw 1 card. Exhaust.' } });
  card({ id:'grind_mindset', name:'Grind Mindset', cost:1, cat:'Productivity', rarity:'uncommon', target:'enemy',
    fx:[{pPerBurnout:3},{p:3}], text:'Deal 3 Pressure, plus 3 for each Burnout card you own this combat.', flavor:'Rise and grind. Mostly grind. Exclusively grind.',
    up:{ fx:[{pPerBurnout:4},{p:4}], text:'Deal 4 Pressure, plus 4 for each Burnout card you own this combat.' } });

  /* =============== RARE =============== */
  card({ id:'quiet_influence', name:'Quiet Influence', cost:3, cat:'Executive', rarity:'rare', target:'none',
    fx:[{pc:3},{t:8},{rep:2}], text:'Gain 3 Political Capital, 8 Trust and 2 Reputation.', flavor:'Never in the room. Somehow in every decision.',
    up:{ cost:2, fx:[{pc:3},{t:8},{rep:2}], text:'Gain 3 Political Capital, 8 Trust and 2 Reputation.' } });
  card({ id:'golden_rolodex', name:'Golden Rolodex', cost:1, cat:'Executive', rarity:'rare', target:'none', exhaust:true,
    fx:[{inf:2},{draw:2}], text:'Gain 2 Influence. Draw 2 cards. Exhaust.', flavor:'You know a guy. The guy knows a guy. Recursion.',
    up:{ fx:[{inf:3},{draw:2}], text:'Gain 3 Influence. Draw 2 cards. Exhaust.' } });
  card({ id:'restructure_narrative', name:'Restructure the Narrative', cost:2, cat:'Executive', rarity:'rare', target:'none',
    fx:[{if:{cond:'repHigh', then:[{pAll:12}], else:[{pAll:6}]}}], text:'Deal 6 Pressure to ALL enemies. 12 instead if your Reputation is 60+.', flavor:'The layoffs are now a “talent redistribution journey.”',
    up:{ fx:[{if:{cond:'repHigh', then:[{pAll:16}], else:[{pAll:8}]}}], text:'Deal 8 Pressure to ALL enemies. 16 instead if your Reputation is 60+.' } });
  card({ id:'burn_it_down', name:'Burn It All Down', cost:3, cat:'Sabotage', rarity:'rare', target:'none', exhaust:true, moral:'bad',
    fx:[{pAll:20},{stress:5},{rep:-4}], text:'Deal 20 Pressure to ALL enemies. Gain 5 Stress. Lose 4 Reputation. Exhaust.', flavor:'Reply-all. Attach everything. CC the board. Ascend.',
    up:{ fx:[{pAll:26},{stress:5},{rep:-4}], text:'Deal 26 Pressure to ALL enemies. Gain 5 Stress. Lose 4 Reputation. Exhaust.' } });
  card({ id:'zen_not_caring', name:'The Zen of Not Caring', cost:2, cat:'Recovery', rarity:'rare', target:'none', exhaust:true,
    fx:[{heal:10},{cleanse:true}], text:'Heal 10 Stress. Remove all your debuffs. Exhaust.', flavor:'Detachment, but make it a performance metric.',
    up:{ fx:[{heal:14},{cleanse:true}], text:'Heal 14 Stress. Remove all your debuffs. Exhaust.' } });
  card({ id:'delegate', name:'Delegate Everything', cost:2, cat:'Executive', rarity:'rare', target:'none',
    fx:[{t:6},{status:{id:'delegation',n:3}}], text:'Gain 6 Trust. Gain 3 Delegation.', flavor:'Your only remaining task is forwarding.',
    up:{ fx:[{t:8},{status:{id:'delegation',n:4}}], text:'Gain 8 Trust. Gain 4 Delegation.' } });
  card({ id:'the_favor', name:'The Favor', cost:0, cat:'Politics', rarity:'rare', target:'enemy', exhaust:true, pcCost:2,
    fx:[{p:14}], text:'Costs 2 Political Capital. Deal 14 Pressure. Exhaust.', flavor:'You never talk about the thing in Denver. This is why.',
    up:{ pcCost:1, fx:[{p:14}], text:'Costs 1 Political Capital. Deal 14 Pressure. Exhaust.' } });
  card({ id:'unlimited_pto', name:'Unlimited PTO (Theoretically)', cost:1, cat:'Recovery', rarity:'rare', target:'none',
    fx:[{heal:8},{addCard:{id:'burnout',n:1,where:'draw'}}], text:'Heal 8 Stress. Shuffle a Burnout into your draw pile.', flavor:'Unlimited, the way the horizon is technically reachable.',
    up:{ fx:[{heal:12},{addCard:{id:'burnout',n:1,where:'draw'}}], text:'Heal 12 Stress. Shuffle a Burnout into your draw pile.' } });
  card({ id:'founder_mode', name:'Founder Mode', cost:3, cat:'Executive', rarity:'rare', target:'none', exhaust:true,
    fx:[{inf:2},{draw:2},{stress:2}], text:'Gain 2 Influence. Draw 2 cards. Gain 2 Stress. Exhaust.', flavor:'Sleep is a legacy system.',
    up:{ fx:[{inf:3},{draw:3},{stress:2}], text:'Gain 3 Influence. Draw 3 cards. Gain 2 Stress. Exhaust.' } });
  card({ id:'whisper_network', name:'Whisper Network', cost:1, cat:'Politics', rarity:'rare', target:'none',
    fx:[{eStatusAll:{id:'onRecord',n:1}},{eStatusAll:{id:'paperTrail',n:2}}], text:'Apply 1 On the Record and 2 Paper Trail to ALL enemies.', flavor:'The org chart has an org chart. You drew it.',
    up:{ fx:[{eStatusAll:{id:'onRecord',n:2}},{eStatusAll:{id:'paperTrail',n:3}}], text:'Apply 2 On the Record and 3 Paper Trail to ALL enemies.' } });
  card({ id:'martyr_complex', name:'Martyr Complex', cost:2, cat:'Social', rarity:'rare', target:'none',
    fx:[{tStress:{div:4}},{t:6}], text:'Gain 6 Trust, plus 1 Trust per 4 Stress you have.', flavor:'“I’m fine” — a person who is measurably not fine.',
    up:{ fx:[{tStress:{div:3}},{t:8}], text:'Gain 8 Trust, plus 1 Trust per 3 Stress you have.' } });
  card({ id:'imposter_no_more', name:'Imposter No More', cost:1, cat:'Recovery', rarity:'rare', target:'none', exhaust:true,
    fx:[{cleanse:true},{status:{id:'leverage',n:2}}], text:'Remove all your debuffs. Gain 2 Leverage. Exhaust.', flavor:'Turns out everyone else is also winging it, but slower.',
    up:{ fx:[{cleanse:true},{status:{id:'leverage',n:3}}], text:'Remove all your debuffs. Gain 3 Leverage. Exhaust.' } });
  card({ id:'own_the_room', name:'Own the Room', cost:3, cat:'Executive', rarity:'rare', target:'enemy',
    fx:[{p:10},{rep:3},{eStatus:{id:'onRecord',n:2}}], text:'Deal 10 Pressure. Gain 3 Reputation. Apply 2 On the Record.', flavor:'You stood up during a hybrid meeting. Unheard of. Feared.',
    up:{ cost:2, fx:[{p:10},{rep:3},{eStatus:{id:'onRecord',n:2}}], text:'Deal 10 Pressure. Gain 3 Reputation. Apply 2 On the Record.' } });
  card({ id:'severance', name:'Severance Package', cost:2, cat:'Executive', rarity:'rare', target:'enemy', exhaust:true,
    fx:[{p:6},{execute:0.25}], text:'Deal 6 Pressure. If the target is at or below 25% Resolve, defeat it. Exhaust.', flavor:'Everyone has a number. You brought a calculator.',
    up:{ fx:[{p:6},{execute:0.35}], text:'Deal 6 Pressure. If the target is at or below 35% Resolve, defeat it. Exhaust.' } });
  card({ id:'copy_paste_culture', name:'Copy-Paste Culture', cost:1, cat:'Productivity', rarity:'rare', target:'none', exhaust:true,
    fx:[{copyRandomHand:1}], text:'Add a copy of a random card in your hand to your hand. Exhaust.', flavor:'Best practices: practices someone else already did.',
    up:{ cost:0, fx:[{copyRandomHand:1}], text:'Add a copy of a random card in your hand to your hand. Exhaust.' } });
  card({ id:'offsite_epiphany', name:'Offsite Epiphany', cost:2, cat:'Social', rarity:'rare', target:'none', exhaust:true,
    fx:[{upgradeHand:'all'}], text:'Upgrade all cards in your hand for this combat. Exhaust.', flavor:'Trust falls were involved. We don’t discuss the ropes course.',
    up:{ cost:1, fx:[{upgradeHand:'all'}], text:'Upgrade all cards in your hand for this combat. Exhaust.' } });

  card({ id:'escalation_chain', name:'Escalation Chain', cost:'X', cat:'Politics', rarity:'rare', target:'enemy',
    fx:[{pX:6}], text:'Spend all Influence. Deal 6 Pressure X times.', flavor:'CC your manager. Their manager. The concept of management itself.',
    up:{ fx:[{pX:8}], text:'Spend all Influence. Deal 8 Pressure X times.' } });
  card({ id:'all_day_dnd', name:'All-Day Do Not Disturb', cost:'X', cat:'Recovery', rarity:'rare', target:'none',
    fx:[{tX:5},{heal:2}], text:'Spend all Influence. Gain 5 Trust X times. Heal 2 Stress.', flavor:'Status: 🔴. Location: unknowable. Vibe: fortress.',
    up:{ fx:[{tX:6},{heal:4}], text:'Spend all Influence. Gain 6 Trust X times. Heal 4 Stress.' } });

  /* =============== STATUS / BURNOUT CARDS =============== */
  card({ id:'burnout', name:'Burnout', cost:0, cat:'Status', rarity:'status', target:'none', unplayable:true,
    endTurnInHand:{stress:1},
    fx:[], text:'Unplayable. If in hand at end of turn, gain 1 Stress.', flavor:'You dreamed about the sprint board again.' });
  card({ id:'doomscroll', name:'Doomscroll', cost:0, cat:'Status', rarity:'status', target:'none', unplayable:true,
    endTurnInHand:{stress:2, exhaust:true},
    fx:[], text:'Unplayable. If in hand at end of turn, gain 2 Stress, then exhaust it.', flavor:'Layoff news at 1am hits different. Worse. It hits worse.' });
  card({ id:'cynicism', name:'Cynicism', cost:0, cat:'Status', rarity:'status', target:'none', exhaust:true,
    fx:[{stress:3}], text:'Gain 3 Stress. Exhaust.', flavor:'“It won’t work” — you, correctly, about everything, forever.' });
  card({ id:'bad_sleep', name:'Bad Sleep', cost:0, cat:'Status', rarity:'status', target:'none', unplayable:true,
    onDrawStress:2, exhaustOnDraw:true,
    fx:[], text:'Unplayable. When drawn, gain 2 Stress, then exhaust it.', flavor:'4am: what if you had said something different in 2021?' });
  card({ id:'eod_request', name:'EOD Request', cost:0, cat:'Status', rarity:'status', target:'none', unplayable:true,
    endTurnInHand:{stress:2},
    fx:[], text:'Unplayable. If in hand at end of turn, gain 2 Stress.', flavor:'“Need this by EOD” — sent at 5:47pm.' });
  card({ id:'pip_paperwork', name:'PIP Paperwork', cost:0, cat:'Status', rarity:'status', target:'none', unplayable:true,
    endTurnInHand:{stress:1, rep:-1},
    fx:[], text:'Unplayable. If in hand at end of turn, gain 1 Stress and lose 1 Reputation.', flavor:'A growth plan, if growth means dread.' });
  card({ id:'cringe_card', name:'That Post You Made', cost:0, cat:'Status', rarity:'status', target:'none', exhaust:true,
    fx:[{rep:-1}], text:'Lose 1 Reputation. Exhaust.', flavor:'“Agree?” Nobody agreed. Eleven recruiters reacted 💡.' });

  /* Index by id */
  const byId = {};
  C.forEach(c => { byId[c.id] = c; });
  g.STH.CARDS = C;
  g.STH.CARD = byId;
  g.STH.BURNOUT_IDS = ['burnout','doomscroll','cynicism','bad_sleep','eod_request','pip_paperwork','cringe_card'];
})(typeof window !== 'undefined' ? window : globalThis);
