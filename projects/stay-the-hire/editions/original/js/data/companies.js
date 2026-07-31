/* Stay the Hire — procedural company generation. Each run gets a company profile
   that flavors events and applies one real gameplay modifier. */
(function (g) {
  g.STH = g.STH || {};
  const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];

  const NAME_A = ['Synerg','Opti','Quant','Nimb','Vertex','Strato','Lumen','Cascad','Flux','Merid','Apex','Bold','Grid','Loop','Pivot','Zenith','Nexa','Formi','Clar','Velo'];
  const NAME_B = ['ify','Core', 'Logic','Scale','Works','ly','Labs', 'Sphere','Path','Sync','Metrics','Flow','Base','Stack','Reach','Mind','Forge','Line','Point','Loop'];
  const SUFFIX = ['', ' Inc.', ' Group', ' Global', ' Technologies', ' Partners', ' Holdings', ' & Co.', ' Solutions', ' (formerly a food app)'];

  const INDUSTRIES = ['B2B SaaS','insurance','consulting','fintech','logistics','health tech','ad tech','enterprise middleware','gaming','gov-tech','HR software','supply chain analytics','"the future of work"'];
  const SIZES = ['a 40-person startup','a 400-person scale-up','a 4,000-person enterprise','a 40,000-person megacorp'];

  const CULTURES = [
    { text:'a hypergrowth startup pretending not to be on fire', mod:{ stressCombat:1 }, modText:'Chaos tax: enemies deal +1 Stress.' },
    { text:'an old-school insurance company with 17 approval layers', mod:{ hrDiscount:true }, modText:'Process mastery: HR/Compliance cards cost 1 less.' },
    { text:'an investment bank where nobody has slept since Tuesday', mod:{ pcBonus:1 }, modText:'Deal culture: +1 Political Capital after combats.' },
    { text:'a consulting firm that sells slides about transformation', mod:{ eliteRep:2 }, modText:'Up-or-out: +2 Reputation after elite fights.' },
    { text:'a tech unicorn pivoting to AI because the CEO heard a podcast', mod:{ luck:-1 }, modText:'Whiplash: events lean slightly harsher.' },
    { text:'a government agency where the printer has more tenure than the interns', mod:{ restBonus:5 }, modText:'Union rules: Coffee Breaks heal +5.' },
    { text:'a game studio with passion, crunch, and no roadmap', mod:{ extraCardReward:true }, modText:'Scrappy: card rewards offer 1 extra option.' },
    { text:'a family business where “family” is doing heavy lifting', mod:{ startTrust:3 }, modText:'Loyalty: start combats with 3 Trust.' }
  ];

  const CEO_STYLES = ['founder-mode evangelist','spreadsheet mystic','ex-consultant with a framework for feelings','absentee visionary (lives on a boat)','LinkedIn thought leader (verified)','turnaround artist on their fourth turnaround','podcast-influenced serial pivoter'];
  const HEALTH = ['profitable but paranoid','burning cash cinematically','flat growth, soaring vibes','one bad quarter from a “strategic review”','accidentally profitable, investigating why'];
  const LEVELS = ['low','medium','high','weaponized'];
  const REMOTE = ['remote-first (mandatory office Tuesdays)','hybrid (definition varies by VP)','office-first (the beanbags are surveillance)','fully remote (the office is a tax fiction)'];
  const CRISES = ['a botched rebrand','a leaked salary spreadsheet','an AI pivot nobody scoped','a reorg that reorganized the reorg','a viral ex-employee thread','a billing outage in Belgium','an activist investor letter','a merger of equals (it is not)'];

  g.STH.generateCompany = function (rng) {
    rng = rng || Math.random;
    const culture = pick(CULTURES, rng);
    return {
      name: pick(NAME_A, rng) + pick(NAME_B, rng) + pick(SUFFIX, rng),
      industry: pick(INDUSTRIES, rng),
      size: pick(SIZES, rng),
      culture: culture.text,
      mod: culture.mod, modText: culture.modText,
      ceoStyle: pick(CEO_STYLES, rng),
      ceoName: pick(['Blake','Sterling','Marlowe','Harlan','Devon','Ainsley','Rex','Juniper'], rng) + ' ' + pick(['Vance','Croft','Whitmore','Ashford','Bellweather','Stone','Marsh','Kessler'], rng),
      health: pick(HEALTH, rng),
      bureaucracy: pick(LEVELS, rng),
      politics: pick(LEVELS, rng),
      innovation: pick(LEVELS, rng),
      remote: pick(REMOTE, rng),
      crisis: pick(CRISES, rng)
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
