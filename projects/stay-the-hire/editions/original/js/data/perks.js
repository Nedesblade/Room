/* Stay the Hire — corporate perks (relics). Declarative where possible; ids with
   bespoke behavior are implemented in engine hooks (see engine.perkHas / perk logic). */
(function (g) {
  g.STH = g.STH || {};
  g.STH.PERKS = [
    { id:'exec_sponsor', name:'Executive Sponsor', icon:'🦸', desc:'Start boss encounters with +3 Political Capital.' },
    { id:'inbox_zero', name:'Inbox Zero Myth', icon:'📥', desc:'After you play 3 Productivity cards in a combat, draw 1 card (once per turn).' },
    { id:'old_manager', name:'Old Manager Owes You', icon:'☎️', desc:'The first Reputation damage you take each combat is negated.' },
    { id:'golden_badge', name:'Golden Badge', icon:'🥇', desc:'Gain 3 Reputation after each elite encounter.' },
    { id:'calendar_tetris_perk', name:'Calendar Grandmaster', icon:'🧩', desc:'The first card you play each turn costs 1 less.' },
    { id:'linkedin_aura', name:'LinkedIn Aura', icon:'✨', desc:'Your Social cards deal +2 Pressure and grant +2 Trust, but events sometimes add a Cringe card (25%).' },
    { id:'headphones', name:'Noise-Canceling Headphones', icon:'🎧', desc:'The first Stress you would gain each combat is reduced by 4.' },
    { id:'sacred_lunch', name:'Sacred Lunch Block', icon:'🥪', desc:'Heal 6 Stress after every combat.' },
    { id:'legacy_spreadsheet', name:'Legacy Spreadsheet', icon:'📈', desc:'At combat start, upgrade a random card in your hand for this combat.' },
    { id:'mentor_network', name:'Mentor Network', icon:'🕸️', desc:'Events lean noticeably friendlier (+2 event luck).' },
    { id:'corporate_amnesia', name:'Corporate Amnesia', icon:'🫧', desc:'Once per act, when a Burnout card would be added to your deck, it isn’t.' },
    { id:'standing_desk', name:'Standing Desk', icon:'🧍', desc:'+10 maximum Stress capacity.' },
    { id:'ergo_chair', name:'Ergonomic Chair (Stolen)', icon:'🪑', desc:'Heal 2 Stress at the start of each combat.' },
    { id:'company_card', name:'The Company Card', icon:'💳', desc:'Gain +1 Political Capital after every combat.' },
    { id:'slack_ghost', name:'Slack Ghost Mode', icon:'👻', desc:'Start each combat with 5 Trust.' },
    { id:'overemployed', name:'Suspiciously Good Time Management', icon:'⏱️', desc:'+1 Influence on your first turn each combat.' },
    { id:'cloud_secrets', name:'The Drive Folder of Secrets', icon:'🗄️', desc:'At combat start, apply 2 Paper Trail to a random enemy.' },
    { id:'rejected_promo', name:'Rejected Promo Packet', icon:'🗿', desc:'While your Reputation is below 40, your Pressure attacks deal +2.' },
    { id:'meeting_declined', name:'Decline All (Series)', icon:'🚫', desc:'The first enemy attack each combat deals 3 less Stress.' },
    { id:'personal_brand', name:'Personal Brand', icon:'🏷️', desc:'Gain 1 Reputation after every combat.' },
    { id:'rolodex_regret', name:'Rolodex of Regret', icon:'📇', desc:'Card rewards offer 4 options instead of 3.' },
    { id:'standup_comedian', name:'Standup Comedian', icon:'🎙️', desc:'At the start of your turn, deal 1 Pressure to ALL enemies.' },
    { id:'burnout_insurance', name:'Burnout Insurance', icon:'🧯', desc:'Burnout cards in your hand at end of turn no longer cause Stress.' },
    { id:'dual_monitors', name:'Dual Monitors', icon:'🖥️', desc:'Draw +1 card on your first turn each combat.' },
    { id:'hr_vocab', name:'HR-Approved Vocabulary', icon:'📖', desc:'Your HR/Compliance cards cost 1 less (minimum 0).' },
    { id:'whiteboard', name:'Whiteboard Warrior', icon:'🖊️', desc:'Every 3rd turn, gain +1 Influence.' },
    { id:'espresso', name:'Emergency Espresso', icon:'☕', desc:'Once per combat, when your Stress rises above 75%, heal 8 Stress.' },
    { id:'head_of_vibes', name:'Head of Vibes', icon:'🕺', desc:'At combat start, apply 1 Flustered to ALL enemies.' },
    { id:'tenure', name:'Tenure', icon:'🏛️', desc:'Bosses deal 15% less Stress to you.' },
    { id:'fire_drill', name:'Fire Drill Veteran', icon:'🚨', desc:'The first Burnout card you draw each combat is exhausted immediately.' },
    { id:'printer_whisperer', name:'The Printer Whisperer', icon:'🖨️', desc:'Coffee Breaks heal +10 extra Stress.' },
    { id:'two_pizza', name:'Two-Pizza Team', icon:'🍕', desc:'When a combat starts against 3+ enemies, gain 6 Trust.' },
    { id:'exit_interview', name:'Exit Interview Notes', icon:'📝', desc:'After each boss fight, remove one Burnout card from your deck.' },
    { id:'stock_options', name:'Stock Options (Underwater)', icon:'🌊', desc:'Gain +2 Political Capital after elite encounters. Worthless, yet motivating.' }
  ];
  const byId = {}; g.STH.PERKS.forEach(p => byId[p.id] = p);
  g.STH.PERK = byId;
})(typeof window !== 'undefined' ? window : globalThis);
