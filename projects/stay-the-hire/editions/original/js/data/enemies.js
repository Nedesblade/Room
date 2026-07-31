/* Stay the Hire — enemy archetypes, encounter pools and bosses.
   Enemy move fx vocabulary (engine.enemyAct):
     atk (times) / blk / debuff / buffSelf / buffAll / addCard / stealPC / repDmg / heal
     shuffleHand / voteCheck / summon
   `script` is a rotation of move ids; bosses may define `phases` [{at, say, script}]. */
(function (g) {
  g.STH = g.STH || {};
  const E = {};
  const enemy = (o) => { E[o.id] = o; };

  /* ============ ACT 1 ============ */
  enemy({ id:'micromanager', name:'Micromanager', icon:'🔍', hp:[26,32],
    intro:'“Quick check-in! Also, why is this cell yellow?”',
    moves:{
      hover:{ label:'Hover', fx:[{atk:5}] },
      checkin:{ label:'Surprise Check-In', fx:[{atk:3},{debuff:{id:'meetingFatigue',n:1}}] },
      cc:{ label:'CC Your Manager', fx:[{repDmg:2},{blk:4}] } },
    script:['hover','checkin','hover','cc'] });
  enemy({ id:'meeting_hoarder', name:'Meeting Hoarder', icon:'📅', hp:[24,30],
    intro:'“Let’s find 30 minutes. Recurring. Forever.”',
    moves:{
      invite:{ label:'Calendar Invite', fx:[{debuff:{id:'calendarFlood',n:1}}] },
      double:{ label:'Double-Book', fx:[{atk:4},{debuff:{id:'meetingFatigue',n:1}}] },
      standup:{ label:'Optional-Mandatory Standup', fx:[{atk:6}] } },
    script:['invite','double','standup'] });
  enemy({ id:'onboarding_buddy', name:'Onboarding Buddy Gone Rogue', icon:'🧭', hp:[20,26],
    intro:'“So the wiki is wrong, the map is old, and the third floor doesn’t exist.”',
    moves:{
      tour:{ label:'Endless Tour', fx:[{atk:4}] },
      lore:{ label:'Terrifying Lore Dump', fx:[{atk:3},{debuff:{id:'imposter',n:1}}] },
      ghost:{ label:'Go Suspiciously Quiet', fx:[{blk:6}] } },
    script:['tour','lore','ghost'] });
  enemy({ id:'printer', name:'The Printer', icon:'🖨️', hp:[18,22],
    intro:'PC LOAD LETTER. It knows you need this by 2pm.',
    moves:{
      jam:{ label:'Paper Jam', fx:[{atk:5}] },
      toner:{ label:'Toner Tantrum', fx:[{atk:2},{addCard:{id:'burnout',n:1,where:'discard'}}] },
      firmware:{ label:'Firmware Update', fx:[{blk:8}] } },
    script:['jam','toner','jam','firmware'] });
  enemy({ id:'replyall_goblin', name:'Reply-All Casualty', icon:'📧', hp:[11,15],
    intro:'“Please remove me from this list.” (sent to the list)',
    moves:{
      plusone:{ label:'“+1”', fx:[{atk:3}] },
      me_too:{ label:'“Me too please”', fx:[{atk:2},{debuff:{id:'meetingFatigue',n:1}}] } },
    script:['plusone','me_too'] });
  enemy({ id:'thoughts_guy', name:'Reply Guy', icon:'💭', hp:[22,28],
    intro:'He wasn’t in the meeting. He wasn’t on the thread. He has, nevertheless, arrived: “just curious — thoughts?”',
    moves:{
      thoughts:{ label:'“Thoughts?”', fx:[{atk:4},{debuff:{id:'paralysis',n:1}}] },
      bump:{ label:'“Bumping this ^”', fx:[{atk:6}] },
      fyi:{ label:'“FYI” (no context)', fx:[{blk:5},{atk:2}] } },
    script:['thoughts','bump','fyi'] });
  enemy({ id:'calendar_tyrant', name:'Calendar Vampire', icon:'🧛', hp:[28,34],
    intro:'It cannot enter your week unless invited. It sent the invite itself. It accepted on your behalf.',
    moves:{
      early:{ label:'7am “Sync”', fx:[{atk:6}] },
      flood:{ label:'Flood the Week', fx:[{debuff:{id:'calendarFlood',n:2}}] },
      lock:{ label:'Lock the Room', fx:[{blk:7}] } },
    script:['early','flood','early','lock'] });
  enemy({ id:'morale_committee', name:'Morale Committee Member', icon:'🎉', hp:[13,17],
    intro:'“Attendance at Mandatory Fun is being tracked.”',
    moves:{
      fun:{ label:'Mandatory Fun', fx:[{atk:3},{debuff:{id:'meetingFatigue',n:1}}] },
      icebreaker:{ label:'Icebreaker Question', fx:[{atk:4}] } },
    script:['fun','icebreaker'] });
  /* Act 1 elites */
  enemy({ id:'agile_coach', name:'Agile Coach With Too Many Ceremonies', icon:'🌀', hp:[48,56], elite:true,
    intro:'“Before the retro, a pre-retro. To align on retro format.”',
    moves:{
      ceremony:{ label:'Add a Ceremony', fx:[{atk:5},{debuff:{id:'meetingFatigue',n:1}}] },
      estimate:{ label:'Story Point Interrogation', fx:[{atk:8}] },
      velocity:{ label:'Question Your Velocity', fx:[{repDmg:2},{debuff:{id:'imposter',n:1}}] },
      sprint:{ label:'Emergency Sprint', fx:[{atk:4,times:2}] } },
    script:['ceremony','estimate','velocity','sprint'] });
  enemy({ id:'deck_perfectionist', name:'Slide Deck Perfectionist', icon:'🎨', hp:[45,52], elite:true,
    intro:'“The kerning on slide 34 is... brave.”',
    moves:{
      font:{ label:'Font Audit', fx:[{atk:6},{debuff:{id:'paralysis',n:1}}] },
      redo:{ label:'“Small Rework” (v29)', fx:[{atk:5},{addCard:{id:'burnout',n:1,where:'draw'}}] },
      polish:{ label:'Polish Own Deck', fx:[{blk:10}] },
      review:{ label:'Live Design Review', fx:[{atk:9}] } },
    script:['font','redo','polish','review'] });

  /* ============ ACT 2 ============ */
  enemy({ id:'credit_stealer', name:'Credit Stealer', icon:'🪞', hp:[42,50],
    intro:'“As I was saying in MY proposal—” (it was your proposal)',
    moves:{
      yoink:{ label:'“Building on that”', fx:[{repDmg:3},{atk:5}] },
      allhands:{ label:'All-Hands Shoutout (to self)', fx:[{repDmg:2},{blk:8}] },
      hustle:{ label:'Visibility Hustle', fx:[{atk:9}] } },
    script:['yoink','allhands','hustle'] });
  enemy({ id:'pa_director', name:'Passive-Aggressive Director', icon:'🙂', hp:[46,54],
    intro:'“No worries if not!” (there are worries. so many.)',
    moves:{
      noted:{ label:'“Noted.”', fx:[{atk:7},{debuff:{id:'imposter',n:1}}] },
      loop:{ label:'“Keeping you in the loop”', fx:[{atk:5},{repDmg:2}] },
      smile:{ label:'Weaponized Smile', fx:[{blk:9},{buffSelf:{id:'eLeverage',n:1}}] } },
    script:['noted','loop','smile'] });
  enemy({ id:'burned_engineer', name:'Doomer Senior Engineer', icon:'🔥', hp:[50,58],
    intro:'Hood up. Coffee cold since Tuesday. “We tried this in 2017. It failed in 2017. I am the only one who remembers 2017.”',
    moves:{
      rant:{ label:'Load-Bearing Rant', fx:[{atk:10}] },
      handoff:{ label:'Toxic Handoff', fx:[{addCard:{id:'doomscroll',n:1,where:'discard'}},{atk:4}] },
      apathy:{ label:'Radical Apathy', fx:[{blk:12}] } },
    script:['rant','handoff','apathy'] });
  enemy({ id:'thought_leader', name:'LinkedIn Visionary', icon:'🧠', hp:[40,48],
    intro:'“I don’t often post about failure. But when my yacht sank, I learned 7 things about B2B sales.”',
    moves:{
      humblebrag:{ label:'Humblebrag Broadcast', fx:[{repDmg:3},{atk:4}] },
      engage:{ label:'“Agree?”', fx:[{addCard:{id:'cringe_card',n:1,where:'discard'}},{atk:3}] },
      virality:{ label:'Go Mildly Viral', fx:[{buffSelf:{id:'eLeverage',n:2}},{blk:6}] } },
    script:['humblebrag','engage','virality'] });
  enemy({ id:'consultant', name:'Consultant', icon:'👔', hp:[16,20],
    intro:'Arrives in identical pairs. Bills in identical hours.',
    moves:{
      framework:{ label:'Deploy Framework', fx:[{atk:5}] },
      synergy:{ label:'Synergy Assessment', fx:[{atk:3},{debuff:{id:'meetingFatigue',n:1}}] },
      invoice:{ label:'Invoice', fx:[{stealPC:1}] } },
    script:['framework','synergy','invoice'] });
  enemy({ id:'procurement', name:'Procurement Gatekeeper', icon:'🚪', hp:[48,56],
    intro:'“This $9 tool requires three approvals and a blood oath.”',
    moves:{
      form:{ label:'Form 77-B', fx:[{atk:6},{debuff:{id:'paralysis',n:1}}] },
      deny:{ label:'Request Denied', fx:[{atk:9}] },
      policy:{ label:'Cite Policy', fx:[{blk:11}] } },
    script:['form','deny','policy'] });
  enemy({ id:'legal_reviewer', name:'NPC Legal Reviewer', icon:'⚖️', hp:[44,52],
    intro:'Blank smile. Recites clause 4(b) from memory, unprompted. “Quick question: what does ‘quickly’ mean, legally?”',
    moves:{
      redline:{ label:'Redline Everything', fx:[{atk:7},{debuff:{id:'legalRisk',n:2}}] },
      hold:{ label:'Place a Hold', fx:[{blk:10},{atk:3}] },
      clause:{ label:'Discover a Clause', fx:[{atk:10}] } },
    script:['redline','hold','clause'] });
  enemy({ id:'finance_partner', name:'Finance Partner (Planning Season)', icon:'🧮', hp:[46,54],
    intro:'“Walk me through this $40 line item. Take your time. We have 6 minutes.”',
    moves:{
      trim:{ label:'Trim the Budget', fx:[{stealPC:1},{atk:5}] },
      variance:{ label:'Variance Inquisition', fx:[{atk:8}] },
      freeze:{ label:'Spending Freeze', fx:[{blk:9},{debuff:{id:'meetingFatigue',n:1}}] } },
    script:['trim','variance','freeze'] });
  /* Act 2 elites */
  enemy({ id:'hrbp', name:'HRBP Who Says “Interesting”', icon:'📁', hp:[70,80], elite:true,
    intro:'“Interesting.” (a folder with your name on it is opened)',
    moves:{
      interesting:{ label:'“Interesting.”', fx:[{atk:8},{debuff:{id:'imposter',n:2}}] },
      survey:{ label:'Anonymous* Survey', fx:[{repDmg:3},{atk:5}] },
      file:{ label:'Update Your File', fx:[{addCard:{id:'pip_paperwork',n:1,where:'draw'}},{blk:8}] },
      escalate:{ label:'Escalate Internally', fx:[{atk:12}] } },
    script:['interesting','survey','file','escalate'] });
  enemy({ id:'vp_vague', name:'Senior VP of Vague Strategy', icon:'🌫️', hp:[72,82], elite:true,
    intro:'“We need to be more strategic. Directionally. At a high level. Going forward.”',
    moves:{
      vision:{ label:'Vague Vision Cast', fx:[{atk:9},{debuff:{id:'paralysis',n:1}}] },
      northstar:{ label:'Invoke North Star', fx:[{buffSelf:{id:'eLeverage',n:2}},{blk:8}] },
      pivot:{ label:'Directional Pivot', fx:[{atk:6,times:2}] },
      offsite:{ label:'Announce Offsite', fx:[{debuff:{id:'meetingFatigue',n:2}},{atk:4}] } },
    script:['vision','northstar','pivot','offsite'] });

  /* ============ ACT 3 ============ */
  enemy({ id:'cfo_cuts', name:'Budget-Cutting CFO', icon:'✂️', hp:[58,66],
    intro:'“I found savings. The savings are your team.”',
    moves:{
      cut:{ label:'Cut Line Items', fx:[{stealPC:2},{atk:8}] },
      audit:{ label:'Surprise Audit', fx:[{atk:12}] },
      runway:{ label:'Runway Sermon', fx:[{blk:12},{debuff:{id:'meetingFatigue',n:2}}] } },
    script:['cut','audit','runway'] });
  enemy({ id:'founder_vision', name:'Founder With Vision', icon:'🚀', hp:[60,68],
    intro:'“What if we did everything, but louder?”',
    moves:{
      vision:{ label:'Midnight Vision Memo', fx:[{atk:10},{addCard:{id:'eod_request',n:1,where:'draw'}}] },
      pivot:{ label:'Passion Pivot', fx:[{atk:7},{debuff:{id:'calendarFlood',n:1}}] },
      belief:{ label:'Reality Distortion', fx:[{blk:14},{buffSelf:{id:'eLeverage',n:2}}] } },
    script:['vision','pivot','belief'] });
  enemy({ id:'ai_exec', name:'AI Evangelist (Mouth Permanently Open)', icon:'🤖', hp:[56,64],
    intro:'Points at a slide that says AI STRATEGY in 96pt font. There are no other slides. “Can we add AI to the stapler? The stapler feels legacy.”',
    moves:{
      mandate:{ label:'AI Mandate', fx:[{atk:9},{debuff:{id:'imposter',n:1}}] },
      demo:{ label:'Demand a Demo', fx:[{atk:13}] },
      hype:{ label:'Quote a Podcast', fx:[{blk:10},{buffSelf:{id:'eLeverage',n:1}}] } },
    script:['mandate','demo','hype'] });
  enemy({ id:'board_observer', name:'Board Observer', icon:'🦅', hp:[30,36],
    intro:'Says nothing. Writes everything.',
    moves:{
      note:{ label:'Take a Note', fx:[{repDmg:3},{atk:4}] },
      question:{ label:'One Pointed Question', fx:[{atk:9}] } },
    script:['note','question'] });
  enemy({ id:'activist_analyst', name:'Activist Investor’s Analyst', icon:'📉', hp:[54,62],
    intro:'“Our 84-page letter suggests you specifically are the inefficiency.”',
    moves:{
      letter:{ label:'Open Letter', fx:[{repDmg:4},{atk:6}] },
      model:{ label:'Hostile Model', fx:[{atk:11}] },
      shortcase:{ label:'Build the Short Case', fx:[{blk:12},{buffSelf:{id:'eLeverage',n:2}}] } },
    script:['letter','model','shortcase'] });
  enemy({ id:'pr_crisis', name:'Aggressively Wholesome Brand Manager', icon:'🎤', hp:[52,60],
    intro:'“We’re not doing layoffs. We’re graduating some of our work-family into the alumni community. 🕊️ Blessed.”',
    moves:{
      spin:{ label:'Spin Cycle', fx:[{atk:8},{debuff:{id:'imposter',n:1}}] },
      statement:{ label:'Draft a Statement', fx:[{blk:13}] },
      leak:{ label:'Controlled Leak', fx:[{repDmg:3},{atk:7}] } },
    script:['spin','statement','leak'] });
  enemy({ id:'vendor_lockin', name:'Vendor Lock-In Rep', icon:'🔒', hp:[50,58],
    intro:'“Migrating away is easy! It only takes 14 years and your firstborn architect.”',
    moves:{
      renewal:{ label:'Auto-Renewal', fx:[{stealPC:1},{atk:7}] },
      upsell:{ label:'Surprise Upsell', fx:[{atk:10}] },
      contract:{ label:'Wave the Contract', fx:[{blk:12},{debuff:{id:'legalRisk',n:1}}] } },
    script:['renewal','upsell','contract'] });
  /* Act 3 elites */
  enemy({ id:'consulting_partner', name:'Big Brain Strategy Consultant', icon:'🏛️', hp:[88,98], elite:true,
    intro:'The forehead enters first. Then the 2x2 matrix, which is unreadable, which is the point. “We interviewed 40 of you to discover your job. Slide 3: your job.”',
    moves:{
      deck90:{ label:'90-Slide Deck', fx:[{atk:9},{debuff:{id:'meetingFatigue',n:2}}] },
      benchmark:{ label:'Benchmark You', fx:[{repDmg:3},{atk:6}] },
      workshop:{ label:'Mandatory Workshop', fx:[{atk:7,times:2}] },
      retainer:{ label:'Extend the Retainer', fx:[{stealPC:2},{blk:12}] } },
    script:['deck90','benchmark','workshop','retainer'] });
  enemy({ id:'layoff_list', name:'The Layoff List', icon:'📃', hp:[85,95], elite:true,
    intro:'A spreadsheet is open somewhere. Column F is names. Column G is blank.',
    moves:{
      rumor:{ label:'Rumor Wave', fx:[{debuff:{id:'reorgRumor',n:2}},{atk:6}] },
      row:{ label:'Highlight a Row', fx:[{atk:13}] },
      recalc:{ label:'Recalculate', fx:[{blk:14},{buffSelf:{id:'eLeverage',n:2}}] },
      sync:{ label:'Closed-Door Sync', fx:[{repDmg:4},{atk:5}] } },
    script:['rumor','row','recalc','sync'] });

  /* ============ BOSSES ============ */
  enemy({ id:'boss_eod', name:'The Manager Who Needs Everything By EOD', icon:'⏳', hp:[85,85], boss:true,
    intro:'“Hey! Tiny ask. Full rebuild of the Q3 narrative. By EOD. Today’s EOD. Which was an hour ago.”',
    moves:{
      urgent:{ label:'“URGENT” Ping', fx:[{atk:7},{addCard:{id:'eod_request',n:1,where:'draw'}}] },
      pile:{ label:'Pile It On', fx:[{addCard:{id:'eod_request',n:2,where:'discard'}}] },
      redefine:{ label:'Redefine EOD', fx:[{atk:10}] },
      breathe:{ label:'Reply “per my last msg”', fx:[{blk:10}] },
      noon:{ label:'“Actually, Noon”', fx:[{atk:6,times:2}] },
      panic:{ label:'Escalation Spiral', fx:[{atk:8},{addCard:{id:'eod_request',n:1,where:'draw'}}] } },
    script:['urgent','pile','redefine','breathe'],
    phases:[{ at:0.5, say:'“Change of plans. Everything is now due at NOON. Yesterday’s noon.”', script:['noon','panic','urgent'] }] });
  enemy({ id:'boss_portal', name:'The Onboarding Portal', icon:'🌀', hp:[80,80], boss:true,
    intro:'WELCOME! Your session has expired. Please complete 47 modules to unlock the module list.',
    moves:{
      module:{ label:'Mandatory Module', fx:[{atk:6},{debuff:{id:'calendarFlood',n:1}}] },
      expire:{ label:'Session Expired', fx:[{blk:14}] },
      quiz:{ label:'Pop Compliance Quiz', fx:[{atk:9}] },
      error:{ label:'Error 500 (Your Fault)', fx:[{atk:5},{addCard:{id:'burnout',n:1,where:'discard'}}] },
      lockout:{ label:'Account Lockout', fx:[{atk:8,times:2}] },
      reset:{ label:'Password Reset Loop', fx:[{blk:10},{debuff:{id:'paralysis',n:1}}] } },
    script:['module','expire','quiz','error'],
    phases:[{ at:0.5, say:'THE PORTAL HAS RECEIVED AN UPDATE. ALL PROGRESS LOST. PLEASE RE-AUTHENTICATE.', script:['lockout','reset','quiz'] }] });
  enemy({ id:'boss_reorg', name:'The Reorg', icon:'🌪️', hp:[110,110], boss:true,
    intro:'A new org chart appears. You are a dotted line now. The dotted line reports to a question mark.',
    moves:{
      redraw:{ label:'Redraw the Org Chart', fx:[{shuffleHand:true},{atk:6}] },
      consultants:{ label:'Bring in Consultants', fx:[{summon:['consultant']}] },
      synergies:{ label:'“Unlock Synergies”', fx:[{stealPC:2},{atk:7}] },
      dotted:{ label:'Dotted-Line You', fx:[{atk:11}] },
      collapse:{ label:'Collapse Two Teams', fx:[{atk:8,times:2}] },
      memo:{ label:'Leak Own Memo', fx:[{blk:16},{debuff:{id:'reorgRumor',n:2}}] } },
    script:['redraw','consultants','synergies','dotted'],
    phases:[{ at:0.5, say:'“Phase 2 of the reorg will reorganize the reorg. Please update your title to TBD.”', script:['collapse','memo','redraw','dotted'] }] });
  enemy({ id:'boss_alignment', name:'The Director of Strategic Alignment', icon:'🧭', hp:[105,105], boss:true,
    intro:'“Before we start: is this aligned? With what? Excellent question. Let’s align on it.”',
    moves:{
      cascade:{ label:'Cascade Objectives', fx:[{atk:8},{debuff:{id:'paralysis',n:1}}] },
      matrix:{ label:'RACI Matrix Attack', fx:[{atk:6},{debuff:{id:'meetingFatigue',n:2}}] },
      charge:{ label:'Gather Alignment', fx:[{buffSelf:{id:'eLeverage',n:2}},{blk:12}] },
      northstar:{ label:'NORTH STAR BEAM', fx:[{atk:16}] } },
    script:['cascade','matrix','charge','northstar'],
    phases:[{ at:0.5, say:'“I’m sensing misalignment.” (the room temperature drops 4 degrees)', script:['charge','northstar','cascade'] }] });
  enemy({ id:'boss_board', name:'The Board Meeting', icon:'🏦', hp:[135,135], boss:true,
    intro:'Twelve rectangles on a screen. One is muted and furious. The agenda: you.',
    minions:['board_observer','board_observer'],
    moves:{
      qpressure:{ label:'Quarterly Pressure', fx:[{buffSelf:{id:'eLeverage',n:1}},{atk:8}] },
      grill:{ label:'Grill the Numbers', fx:[{atk:13}] },
      recess:{ label:'Go Into Closed Session', fx:[{blk:18}] },
      vote:{ label:'CALL THE VOTE', fx:[{voteCheck:{rep:60, win:25, lose:14}}], once:true },
      slash:{ label:'Slash Guidance', fx:[{atk:9,times:2}] } },
    script:['qpressure','grill','recess','vote','slash'],
    phases:[{ at:0.4, say:'“Let’s hear from the activist seat.” (everyone inhales)', script:['slash','qpressure','grill'] }] });
  enemy({ id:'boss_ai_mandate', name:'The AI Transformation Mandate', icon:'🤖', hp:[125,125], boss:true,
    intro:'“Effective immediately, every deliverable must be AI-first. Including birthdays.”',
    moves:{
      mandate:{ label:'Mandate Wave', fx:[{atk:9},{addCard:{id:'doomscroll',n:1,where:'draw'}}] },
      hallucinate:{ label:'Confident Hallucination', fx:[{atk:12},{debuff:{id:'imposter',n:1}}] },
      retrain:{ label:'“Upskill or Else” Session', fx:[{debuff:{id:'meetingFatigue',n:2}},{blk:12}] },
      accelerate:{ label:'ACCELERATE', fx:[{buffSelf:{id:'eLeverage',n:2}},{atk:7}] },
      singularity:{ label:'Pivot the Pivot', fx:[{atk:10,times:2}] } },
    script:['mandate','hallucinate','retrain','accelerate'],
    phases:[{ at:0.5, say:'“The AI has reviewed your role. The AI has... thoughts.”', script:['singularity','accelerate','hallucinate'] }] });

  /* ============ ENCOUNTER POOLS ============ */
  g.STH.ENEMIES = E;
  g.STH.ENCOUNTERS = {
    1: { normal: [ ['micromanager'], ['meeting_hoarder'], ['onboarding_buddy'], ['printer'],
                   ['replyall_goblin','replyall_goblin','replyall_goblin'],
                   ['thoughts_guy'], ['calendar_tyrant'],
                   ['morale_committee','morale_committee'], ['printer','replyall_goblin'] ],
        elite: [ ['agile_coach'], ['deck_perfectionist'] ],
        boss:  [ ['boss_eod'], ['boss_portal'] ] },
    2: { normal: [ ['credit_stealer'], ['pa_director'], ['burned_engineer'], ['thought_leader'],
                   ['consultant','consultant','consultant'],
                   ['procurement'], ['legal_reviewer'], ['finance_partner'],
                   ['consultant','thought_leader'] ],
        elite: [ ['hrbp'], ['vp_vague'] ],
        boss:  [ ['boss_reorg'], ['boss_alignment'] ] },
    3: { normal: [ ['cfo_cuts'], ['founder_vision'], ['ai_exec'], ['activist_analyst'],
                   ['pr_crisis'], ['vendor_lockin'],
                   ['board_observer','board_observer'],
                   ['consultant','consultant','cfo_cuts'] ],
        elite: [ ['consulting_partner'], ['layoff_list'] ],
        boss:  [ ['boss_board'], ['boss_ai_mandate'] ] }
  };
})(typeof window !== 'undefined' ? window : globalThis);
