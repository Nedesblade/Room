/* Stay the Hire — random corporate events.
   Choice fx keys (run-level): stress, rep, pc, maxStress, addCard {id,n}, removeRandomCard,
   removeBurnouts, upgradeRandom, perkRandom, luck, gainCardRandom {rarity}, inf1 (extra influence next combat).
   A choice may instead have random:{chance, good:{fx,text}, bad:{fx,text}}.
   Text placeholders: {company} {ceo} {industry} {crisis} {player}. */
(function (g) {
  g.STH = g.STH || {};
  g.STH.EVENTS = [
    { id:'salary_sheet', title:'The Confidential Spreadsheet',
      text:'A misconfigured drive link reveals “Comp_Bands_FINAL_(do not share).xlsx”. Your salary has a comment on it. The comment says “fine for now”.',
      choices:[
        { label:'Read every tab, memorize everything', fx:{pc:2, stress:6}, result:'Knowledge is power. Power is 2 Political Capital. Sleep is gone.', incident:'memorized the secret comp spreadsheet' },
        { label:'Report the leak to IT', fx:{rep:4}, result:'IT thanks you, revokes the link, and quietly checks what YOU opened.', moral:'good' },
        { label:'Anonymously send it to the group chat', fx:{rep:-5, pc:3, luck:-1}, result:'The chat goes nuclear. Three people update their résumés in real time.', moral:'bad', incident:'leaked the comp sheet to the group chat' } ] },
    { id:'credit_allhands', title:'Your Work, Their Slide',
      text:'At the all-hands, your manager presents your project. Your name appears nowhere. The applause is thunderous and entirely misdirected.',
      choices:[
        { label:'Speak up during Q&A', random:{chance:0.55, good:{fx:{rep:6}, text:'“Actually, that was my analysis.” Silence. Then the CPO nods. Legend status.'}, bad:{fx:{rep:-4, stress:6}, text:'“Let’s take attribution offline,” says your manager, with dead eyes.'}} },
        { label:'Let it slide, collect the favor', fx:{pc:2}, result:'Your manager owes you. They know it. You know they know. Currency acquired.' },
        { label:'Post the original doc timestamp in the thread', fx:{rep:3, stress:3}, result:'Receipts. The thread reacts with 👀 x14.', incident:'won an attribution war with a timestamp' } ] },
    { id:'hr_survey', title:'The Anonymous Survey',
      text:'HR launches an anonymous engagement survey. It requires SSO, your employee ID, your manager’s name, and a short essay about psychological safety. Question 1: “How do you feel about your manager (they will see this)?”',
      choices:[
        { label:'Answer honestly anyway', random:{chance:0.5, good:{fx:{rep:3, stress:-4}, text:'Cathartic. Somehow nothing bad happens. The system may actually be anonymous. Weird.'}, bad:{fx:{rep:-3, stress:5}, text:'Your manager schedules a 1:1 titled “Feedback Culture”. It is not about culture.'}} },
        { label:'Five stars for everything', fx:{stress:3}, result:'You rate the parking situation five stars. There is no parking. Your soul dims slightly.' },
        { label:'“No time to complete survey” (ironic, powerful)', fx:{rep:1, stress:-2}, result:'HR marks you as “engaged but busy”. Statistically, a promotion profile.' } ] },
    { id:'quitting_engineer', title:'The Departing Senior Engineer',
      text:'A senior engineer quits after 9 years. Their farewell email is one line: “The spreadsheet explains everything.” Attached: LEGACY_MASTER_v1.xlsx.',
      choices:[
        { label:'Open the spreadsheet', fx:{gainCardRandom:{rarity:'rare'}, stress:4}, result:'Tab 1: passwords. Tab 2: process. Tab 3: a list titled “WHO TO NEVER TRUST”. You learn much.', incident:'inherited the legendary legacy spreadsheet' },
        { label:'Forward it to your manager unopened', fx:{rep:3}, result:'“Great ownership,” says your manager, who also does not open it. It is now nobody’s problem, forever.' },
        { label:'Delete it. Some doors should stay closed', fx:{stress:-6}, result:'You feel lighter. Somewhere, a production server begins a slow, dignified death.' } ] },
    { id:'recruiter_dm', title:'The Competitor’s Recruiter',
      text:'A recruiter from your competitor DMs: “Love your profile! Open to a quick chat about an exciting opportunity (30% more comp)?”',
      choices:[
        { label:'Take the call from a stairwell', fx:{pc:2, stress:2}, result:'Nothing concrete, but knowing you have options is load-bearing for your personality now.' },
        { label:'Use it to negotiate internally', random:{chance:0.5, good:{fx:{rep:4, pc:2}, text:'“We’d hate to lose you.” A retention adjustment appears. Capitalism, occasionally, works.'}, bad:{fx:{rep:-4, stress:4}, text:'“Good luck out there,” says your manager, updating a spreadsheet you cannot see.'}} },
        { label:'Report it in the team channel as a flex', fx:{rep:-2, stress:-3}, result:'“Recruiters keep bothering me lol.” Two coworkers silently forward their own offers to lawyers.' } ] },
    { id:'ai_pivot', title:'The Podcast Pivot',
      text:'{ceo} heard one (1) podcast. {company} is now “an AI-first company”. There is a mandatory kickoff. The kickoff has a fog machine.',
      choices:[
        { label:'Volunteer for the AI task force', fx:{rep:5, stress:6, addCard:{id:'burnout', n:1}}, result:'You now own “AI strategy”. It is a slide with a brain on it. The brain is clip art.', incident:'became the AI strategy owner via fog-machine kickoff' },
        { label:'Rename your existing project “AI-powered”', fx:{rep:3, pc:1}, result:'Nothing changed except the budget, which doubled. This is called leadership.' },
        { label:'Quietly wait for the next podcast', fx:{luck:1}, result:'Wise. Three weeks later the company is “blockchain-curious” and you were never involved.' } ] },
    { id:'slack_thread', title:'The Politically Radioactive Thread',
      text:'Someone posts “why do we even have middle managers?” in #general. It has 47 replies. Your director is typing…',
      choices:[
        { label:'Reply with a balanced take', random:{chance:0.45, good:{fx:{rep:5}, text:'Your diplomatic essay becomes canon. Two VPs quote it. You are briefly a philosopher.'}, bad:{fx:{rep:-4, stress:5}, text:'Both sides now consider you the enemy. Impressive, structurally.'}} },
        { label:'React with one thoughtful emoji', fx:{pc:1}, result:'The 🤔 is deniable, visible, and eternal. Textbook politics.' },
        { label:'Mute the channel, protect your peace', fx:{stress:-5}, result:'You hear it ended badly. You do not know how. This is what winning feels like.' } ] },
    { id:'no_budget_project', title:'“Just Quickly Own This”',
      text:'A director asks you to “just quickly own” a cross-functional initiative. Budget: none. Team: you. Deadline: aggressive. Upside: “visibility”.',
      choices:[
        { label:'Accept — visibility is currency', fx:{rep:6, stress:8, addCard:{id:'burnout',n:1}}, result:'You now run a program with zero resources. Your status updates are performance art.', incident:'ran an entire initiative with a budget of $0' },
        { label:'Accept, but demand it in writing', fx:{rep:3, pc:2}, result:'The email trail is immaculate. Future-you sends past-you a thank-you card.' },
        { label:'Decline without guilt', fx:{stress:-4, rep:-2}, result:'“Totally understand,” says the director, who does not, and will remember.' } ] },
    { id:'new_rating', title:'The New Performance Rating',
      text:'{company} unveils a new rating scale: “Transforms / Performs / Informs / Explores”. Nobody knows which one is bad. One of them is definitely bad.',
      choices:[
        { label:'Ask which one is bad in the open Q&A', fx:{rep:4, stress:3}, result:'HR laughs nervously for 45 seconds. It’s “Explores”. Everyone owes you.', incident:'exposed which performance rating was secretly bad' },
        { label:'Game the rubric immediately', fx:{pc:2, rep:2}, result:'You reverse-engineer the rubric and start “transforming” loudly near executives.' },
        { label:'Assume you’re fine', fx:{stress:5}, result:'You are rated “Explores”. You explore what that means for several sleepless nights.' } ] },
    { id:'consultant_deck', title:'Your Job, Explained To You',
      text:'A consultant presents a 90-slide deck titled “Reimagining {industry} Operations”. Slide 41 is your job, described wrongly, at $800/hour.',
      choices:[
        { label:'Correct slide 41 in front of everyone', random:{chance:0.6, good:{fx:{rep:6, pc:1}, text:'The partner blinks. “Great insight. We’ll incorporate that.” You are now slide 42.'}, bad:{fx:{rep:-3, stress:4}, text:'“That’s directionally what we said,” the partner replies. The room believes the deck. The deck is truth.'}} },
        { label:'Befriend the junior consultant', fx:{pc:2}, result:'They’re 24, terrified, and have the partner’s calendar. Alliance secured.' },
        { label:'Sit silently and absorb the absurdity', fx:{stress:-3, luck:1}, result:'A consultant says “north star” four times and becomes briefly untouchable. You take notes.' } ] },
    { id:'doomed_project', title:'The Doomed Project Transfer',
      text:'Your favorite teammate is being moved to Project Chimera, which has had 4 leads in 6 months and a burn rate visible from space.',
      choices:[
        { label:'Fight to keep them', random:{chance:0.5, good:{fx:{rep:5, stress:3}, text:'You win the calendar war. They stay. Their gratitude is worth more than headcount.'}, bad:{fx:{rep:-2, stress:6}, text:'You lose, publicly. They’re gone. Chimera consumes another soul.'}}, moral:'good' },
        { label:'Help them negotiate a better title on the way', fx:{pc:1, rep:2}, result:'“Senior Transformation Lead, Chimera Initiative.” The ship sinks; their résumé sails.' },
        { label:'Distance yourself from the blast radius', fx:{stress:-3, rep:-3}, result:'Self-preservation is a skill. It just doesn’t feel like one at 2am.', moral:'bad' } ] },
    { id:'exec_like', title:'The Mysterious Executive Like',
      text:'A C-suite executive you have never met liked your internal post from 3 weeks ago. At 11:47pm. No comment. Just the like.',
      choices:[
        { label:'DM them a thoughtful follow-up', random:{chance:0.5, good:{fx:{pc:3, rep:3}, text:'They reply. You now have an executive pen pal. This is how empires begin.'}, bad:{fx:{stress:4, rep:-1}, text:'Read at 6:02am. No reply, ever. The silence has texture.'}} },
        { label:'Screenshot it for morale', fx:{stress:-3}, result:'It lives in your “evidence I matter” folder, next to two kind emails from 2024.' },
        { label:'Post more content immediately', fx:{rep:2, addCard:{id:'cringe_card',n:1}}, result:'You post daily now. Some posts are good. One includes the word “humbled”. It haunts you.' } ] },
    { id:'quick_sync', title:'“Quick Sync” (19 People)',
      text:'You are invited to a meeting called “Quick Sync”. There are 19 attendees, no agenda, and it conflicts with your only focus block.',
      choices:[
        { label:'Attend and say one smart thing', fx:{rep:3, stress:4}, result:'You deploy “what problem are we solving?” at minute 40. Two directors write it down.' },
        { label:'Decline: “no agenda, no attenda”', fx:{stress:-4, rep:-1}, result:'The meeting has no agenda, which means it has infinite agenda. You dodge all of it.' },
        { label:'Attend, camera off, do real work', fx:{pc:1, stress:1}, result:'You are a black rectangle achieving inbox zero. Someone says your name. You were “on mute”.' } ] },
    { id:'mentor_offer', title:'An Actual Mentor Appears',
      text:'A retiring VP with nothing left to lose offers to mentor you. First advice: “Everything is politics. Even this sentence.”',
      choices:[
        { label:'Accept the mentorship', fx:{perkRandom:true, stress:2}, result:'Weekly coffees. Decades of scar tissue, downloaded. You see the matrix now.', incident:'was mentored by a VP with nothing left to lose' },
        { label:'Ask for one favor instead', fx:{pc:3}, result:'“Smart. Transactional. I respect it.” One golden favor, banked.' },
        { label:'Politely decline — too busy', fx:{stress:-2}, result:'They nod knowingly. “That’s what I said in 1994.” The elevator doors close like a curtain.' } ] },
    { id:'office_move', title:'The Great Desk Reshuffle',
      text:'Facilities announces a new seating plan “optimized for collaboration”. You have been optimized next to the sales gong.',
      choices:[
        { label:'Trade favors for a better desk', fx:{pc:-1, stress:-5, rep:1}, req:{pc:1}, result:'One favor later, you sit by a window. The gong is a distant rumor.' },
        { label:'Embrace the gong life', fx:{stress:5, pc:1}, result:'You learn the sales team’s rhythms. Knowledge accrues. Hearing fades.' },
        { label:'Go permanently “hybrid”', fx:{stress:-3, rep:-1}, result:'Your desk becomes a legend. A jacket on a chair, maintaining the illusion of presence.' } ] },
    { id:'expense_audit', title:'The $14 Expense Investigation',
      text:'Finance flags your $14 lunch from a client visit 4 months ago. The investigation has its own ticket number and, apparently, momentum.',
      choices:[
        { label:'Compile a full evidence dossier', fx:{stress:3, rep:3}, result:'Receipts, map data, witness statements. Finance approves it with a note: “impressive”.' },
        { label:'Just pay the $14', fx:{stress:-2, pc:-1}, req:{pc:1}, result:'You buy back your freedom. The ticket closes. The system wins, but cheaply.' },
        { label:'Expense the time spent disputing it', fx:{rep:-2, stress:-4}, result:'You invoice 3 hours of “compliance labor”. Finance does not laugh. You do. Worth it.', incident:'invoiced Finance for the time spent disputing $14' } ] },
    { id:'meeting_free_week', title:'The Meeting-Free Week Experiment',
      text:'{company} declares next week “meeting-free” to boost deep work. Fourteen “optional working sessions” instantly appear.',
      choices:[
        { label:'Honor the spirit: decline everything', fx:{stress:-8, rep:-1}, result:'You do a week of actual work. It feels illegal. It nearly is.' },
        { label:'Attend the “optional” ones (they’re not)', fx:{rep:3, stress:5}, result:'Correct read. Attendance was tracked. Of course it was tracked.' },
        { label:'Host your own “alignment jam”', fx:{pc:2, rep:1, stress:2}, result:'You gather the confused. You are now, technically, a movement leader.' } ] },
    { id:'printer_funeral', title:'Death of the Printer',
      text:'The 3rd floor printer has died after 14 years of spite. An unofficial memorial forms. Someone brought a candle. IT is “aware”.',
      choices:[
        { label:'Deliver a eulogy', fx:{rep:4, stress:-3}, result:'“It jammed, as it lived: at the worst possible moment.” Standing ovation. Morale +100.', incident:'gave a eulogy for a printer' },
        { label:'Claim its memory for parts', fx:{pc:1}, result:'You salvage the good toner. In the office economy, this is generational wealth.' },
        { label:'Submit a normal IT ticket like a normal person', fx:{rep:1}, result:'Ticket #4,207. Estimated resolution: “eventually”. The candle burns on.' } ] },
    { id:'values_workshop', title:'The Values Workshop',
      text:'A facilitator asks everyone to “embody” the company values. There are seven values. Three are synonyms for “fast”.',
      choices:[
        { label:'Perform enthusiasm flawlessly', fx:{rep:3, stress:4}, result:'Your interpretive rendering of “Bias for Action” brings the facilitator to tears.' },
        { label:'Ask what the values mean in practice', fx:{rep:-1, pc:1, stress:-2}, result:'HR thanks everyone for their vulnerability and disables comments.' },
        { label:'Get “called on” and improvise', random:{chance:0.5, good:{fx:{rep:4}, text:'You say “our value is trust, and trust is built in small moments”. LinkedIn-grade. Applause.'}, bad:{fx:{rep:-2, stress:4}, text:'You say “synergy” unironically. It will be quoted at you for months.'}} } ] },
    { id:'oncall_weekend', title:'The Voluntold Weekend',
      text:'“We need someone senior-ish on call this weekend for the launch. You came to mind! 🙂” The smiley does the heavy lifting.',
      choices:[
        { label:'Take it, bank the goodwill', fx:{pc:2, stress:7, addCard:{id:'bad_sleep',n:1}}, result:'The launch breaks at 3am, as launches must. You fix it. You are owed, heavily.' },
        { label:'Negotiate comp day + lunch budget first', fx:{pc:1, stress:4, rep:1}, result:'You extract terms. The precedent matters more than the pad thai. But also, pad thai.' },
        { label:'“I have a wedding” (there is no wedding)', fx:{stress:-4, rep:-2}, result:'You attend the imaginary wedding. It’s beautiful. The couple, Freedom and Boundaries, are radiant.', incident:'invented a wedding to escape on-call duty' } ] },
    { id:'two_jobs', title:'The Job Description Grows',
      text:'Your departing coworker’s duties have been “redistributed”. The redistribution is: you. Your manager calls this a growth opportunity. The opportunity appears to be doing three jobs.',
      choices:[
        { label:'Demand a title bump for the load', random:{chance:0.55, good:{fx:{rep:5, pc:1}, text:'“Senior” gets prepended to your title. The pay arrives “next cycle”. Partial victory.'}, bad:{fx:{rep:-2, stress:5}, text:'“Let’s revisit at review time.” Review time is a mythical season, like El Niño.'}} },
        { label:'Do both jobs, brilliantly, unsustainably', fx:{rep:6, stress:9, addCard:{id:'burnout',n:1}}, result:'You are twice as productive and half as alive. The dashboard looks incredible.' },
        { label:'Let the second job visibly fail', fx:{rep:-3, stress:-5}, result:'Two months later they hire a replacement “urgently”. The system only learns from fire.', moral:'bad' } ] },
    { id:'town_hall_question', title:'The Open Mic',
      text:'At the town hall, {ceo} asks: “Any questions? Really. Anything.” A microphone waits. History holds its breath.',
      choices:[
        { label:'Ask about the {crisis}', random:{chance:0.5, good:{fx:{rep:7}, text:'A direct answer, somehow. People Slack you fire emojis for a week. You are the people’s champion.'}, bad:{fx:{rep:-3, stress:6}, text:'“Great question. Next question.” Your name is now a cautionary tale in comms training.'}}, incident:'asked THE question at the town hall' },
        { label:'Ask a friendly setup question', fx:{rep:2, pc:1}, result:'“Can you say more about our exciting momentum?” The CEO beams. Comms loves you. A safe, oily win.' },
        { label:'Do not touch the microphone', fx:{stress:-2}, result:'The mic passes you like a collection plate. Someone else asks about parking. Carnage.' } ] },
    { id:'wellness_module', title:'Mandatory Wellness',
      text:'HR assigns a 45-minute “Resilience & Wellbeing” e-learning to combat burnout. It is due EOD. It cannot be paused.',
      choices:[
        { label:'Complete it earnestly', fx:{stress:-3}, result:'Module 3 suggests “taking breaks”. Revolutionary. You take one to recover from the module.' },
        { label:'Play it muted during real work', fx:{stress:2, pc:1}, result:'Multitasking through the anti-multitasking training. Peak corporate physics.' },
        { label:'Report that the burnout training causes burnout', fx:{rep:2, stress:-2}, result:'HR responds: “Thank you for this feedback journey.” A new module is commissioned.', incident:'filed a complaint that the burnout training causes burnout' } ] },
    { id:'stand_desk', title:'The Ergonomic Arms Race',
      text:'A VP got a standing desk. Then their reports got standing desks. Desk height is now org-chart-correlated. Yours is very, very low.',
      choices:[
        { label:'Requisition the tallest desk in the catalog', fx:{pc:-1, rep:2, stress:-2}, req:{pc:1}, result:'Your desk now towers. Visitors crane upward. Status: acquired, hydraulically.' },
        { label:'Start a lowering-desk counter-trend', fx:{rep:3}, result:'“Grounded leadership.” Three directors adopt floor cushions. You are an influencer now.' },
        { label:'Ignore the desk discourse entirely', fx:{stress:-3}, result:'You remain seated, at peace, while the furniture wars rage above you.' } ] },
    { id:'jargon_bingo', title:'Buzzword Critical Mass',
      text:'In one meeting you hear “double-click”, “de-risk”, “learnings”, “boil the ocean”, and “let’s put a pin in it”. Reality begins to thin.',
      choices:[
        { label:'Complete the bingo card out loud', fx:{rep:-2, stress:-6}, result:'“BINGO.” Confusion, then laughter, then one director’s cold, memorizing stare. Worth it.', incident:'won buzzword bingo out loud in a live meeting' },
        { label:'Out-jargon them all', fx:{rep:3, pc:1, stress:2}, result:'You say “operationalize the flywheel” and receive two nods and a follow-up invite. Terrifying power.' },
        { label:'Translate everything into plain English', fx:{rep:4, stress:3}, result:'“So… we’re behind and need to decide.” The room is stunned by the clarity. Clarity is a weapon.' } ] },
    { id:'return_to_office', title:'The RTO Memo',
      text:'A memo announces a return to office “to protect our collaborative culture”. It was sent by an executive… from a beach… in another timezone.',
      choices:[
        { label:'Comply enthusiastically, farm visibility', fx:{rep:4, stress:5}, result:'You are now “someone leadership sees”. Mostly at the coffee machine. It counts. Somehow it counts.' },
        { label:'Calculate the policy’s cost in a memo', random:{chance:0.5, good:{fx:{rep:5, pc:1}, text:'Your commute-cost model reaches the CFO. Tuesdays become “flex”. You did that.'}, bad:{fx:{rep:-3, stress:4}, text:'Your memo is “appreciated” and archived where memos go to die.'}} },
        { label:'Badge in, coffee, badge out', fx:{pc:1, stress:-2, rep:-1}, result:'Coffee badging: the sport of kings. Your attendance metrics are technically flawless.' } ] },
    { id:'org_chart_leak', title:'The Draft Org Chart',
      text:'Someone screen-shared for 4 seconds too long. You saw a draft org chart. Your box was... dotted. And slightly smaller. And beige.',
      choices:[
        { label:'Quietly build alliances before it lands', fx:{pc:2, stress:4}, result:'You take six coffee chats in three days. When the reorg hits, you land like a cat.' },
        { label:'Confront your manager about it', random:{chance:0.45, good:{fx:{rep:4, stress:-3}, text:'“It’s outdated,” they say — and this time it’s true. Your box re-solidifies.'}, bad:{fx:{rep:-3, stress:6}, text:'“Where did you see that?” Wrong question to be asked, ever.'}} },
        { label:'Pretend you saw nothing', fx:{stress:6, luck:-1}, result:'You know. They don’t know you know. The knowing eats at you nightly.' } ] },
    { id:'award_nomination', title:'The Quarterly Values Award',
      text:'You are nominated for the “Living Our Values” award. The prize: a $25 gift card and the expectation of infinite future sacrifice.',
      choices:[
        { label:'Accept with a gracious speech', fx:{rep:5, stress:2}, result:'You thank “the whole team”. The whole team knows you carried them. The gift card is for a store that closed.' },
        { label:'Redirect the award to a teammate', fx:{rep:3, pc:2}, result:'A power move disguised as humility. They cry. You bank the loyalty.', moral:'good' },
        { label:'Ask for the cash equivalent instead', fx:{rep:-2, stress:-2}, result:'Finance says awards are “non-fungible recognition instruments”. You frame the email.' } ] },
    { id:'production_incident', title:'Someone Broke Production',
      text:'Production is down. The war room fills. Someone (not you) shipped on Friday at 4:58pm. The blame currents are shifting fast.',
      choices:[
        { label:'Jump in and help fix it', fx:{rep:5, stress:6}, result:'Four hours of heroics. Your name enters the incident report under “key responders”. Immortality, of a sort.', moral:'good' },
        { label:'Narrate the incident to leadership', fx:{pc:2, rep:2}, result:'You become the war room’s translator. Executives now believe you fixed it. You typed nothing.' },
        { label:'Note loudly that your code is fine', fx:{rep:-3, stress:-3}, result:'Technically true. Socially fatal. The pager forgives no one.', moral:'bad' } ] },
    { id:'calendar_audit', title:'The Calendar Audit',
      text:'A productivity consultant audits everyone’s calendars. Yours contains 31 hours of meetings, 2 hours of “focus time”, and one block labeled “scream (internal)”.',
      choices:[
        { label:'Let them optimize you', fx:{stress:-6, removeRandomCard:true}, result:'They delete 11 recurring meetings. You feel a lightness previously known only to retirees.' },
        { label:'Defend every single meeting', fx:{rep:2, stress:3}, result:'“This one’s political. This one’s survival. This one has snacks.” The consultant writes “complex case”.' },
        { label:'Ask them to audit your manager instead', fx:{pc:1, rep:-1, stress:-2}, result:'Redirection: executed. Your manager now has “focus Fridays” and mild resentment.' } ] },
    { id:'swag_crisis', title:'The Swag Budget Paradox',
      text:'The company froze raises but ordered 4,000 branded fleece vests. A vest appears on your desk. It is, annoyingly, quite comfortable.',
      choices:[
        { label:'Wear it with dead-eyed loyalty', fx:{rep:2}, result:'You are photographed for the internal newsletter. Caption: “Culture in action!” Your eyes say otherwise.' },
        { label:'Sell it on the internal marketplace', fx:{pc:1, rep:-1}, result:'A new hire buys it for $20. The circle of corporate life continues.' },
        { label:'Ask, publicly, about the vest math', fx:{rep:3, stress:4}, result:'Your cost-per-vest analysis goes mildly viral. Finance calls it “directionally unhelpful”. Employees call it art.', incident:'did the vest math, publicly' } ] },
    { id:'friday_deploy', title:'The 4:58pm Friday Ask',
      text:'A director pings at 4:58pm Friday: “tiny favor, super quick, need it before Monday 🙏”. The praying hands carry the weight of empires.',
      choices:[
        { label:'Do it now, invoice the karma', fx:{pc:2, stress:5}, result:'Ninety “super quick” minutes later, it ships. The director owes you a real one.' },
        { label:'“I’ll pick it up Monday first thing”', fx:{stress:-3, rep:-1}, result:'Monday reveals it was never urgent. It is never urgent. The 🙏 was a bluff all along.' },
        { label:'Delegate it to the group channel', fx:{rep:-2, pc:1, stress:-2}, result:'An eager new hire volunteers within minutes. You have weaponized enthusiasm. Note taken.' } ] },
    { id:'title_inflation', title:'Title Inflation Window',
      text:'A reorg loophole lets managers grant titles without comp changes. Words are, briefly, free. Your manager slides you a menu.',
      choices:[
        { label:'“Senior Staff Principal Lead”', fx:{rep:4, stress:2}, result:'The title is 60% adjectives. Recruiters begin circling like well-dressed sharks.' },
        { label:'“Head of Special Projects” (undefined)', fx:{pc:2, rep:1}, result:'Undefined scope is infinite scope. You can now claim anything. You do.' },
        { label:'Keep your title, ask for money instead', fx:{rep:1, stress:3}, result:'“The comp cycle is closed,” says the man who opened it. But your self-respect appreciates in value.' } ] },
    { id:'all_hands_tech_fail', title:'The Frozen CEO',
      text:'{ceo} freezes mid-word on the all-hands stream, mouth open, mid-gesture. Three thousand employees watch the buffering icon spin over their leader.',
      choices:[
        { label:'Fill the silence in chat with grace', fx:{rep:4}, result:'“While we wait: shoutout to the infra team.” Wholesome. Screenshotted. Beloved.' },
        { label:'Meme it (tastefully)', random:{chance:0.55, good:{fx:{rep:3, stress:-4}, text:'Your freeze-frame caption wins the internet for a day. Even comms laughs, privately.'}, bad:{fx:{rep:-4, stress:3}, text:'Comms does not laugh. There is a meeting about memes. You are its subject.'}}, incident:'memed the frozen CEO' },
        { label:'Use the chaos to skip the meeting', fx:{stress:-4}, result:'You quietly close the tab. The CEO unfreezes into an empty room, spiritually.' } ] },
    { id:'nda_party', title:'The Confidential Offsite',
      text:'You’re invited to an exec offsite to “take notes”. Day one includes a trust circle, a leaked roadmap, and a fight about fonts that gets personal.',
      choices:[
        { label:'Take immaculate, dangerous notes', fx:{pc:3, stress:4}, result:'Your notebook is now the most powerful document in the company. Guard it.', incident:'holds the notebook from THE offsite' },
        { label:'Contribute one bold idea', random:{chance:0.5, good:{fx:{rep:6}, text:'The CPO writes your idea on the big flip chart. It survives to production. A miracle.'}, bad:{fx:{rep:-3, stress:3}, text:'“Interesting,” says the room, in the way that means “no”. The flip chart forgets you.'}} },
        { label:'Master the art of strategic invisibility', fx:{stress:-3, pc:1}, result:'You refill waters, hear everything, and are remembered by no one. Perfect espionage.' } ] },
    { id:'competing_offer_teammate', title:'The Counter-Offer Spiral',
      text:'Your teammate got an offer elsewhere. The company counter-offered 40% instantly — the same company that called your 4% ask “fiscally impossible”.',
      choices:[
        { label:'Point out the math to your manager', random:{chance:0.5, good:{fx:{rep:3, pc:1}, text:'“You make a fair point.” A “market adjustment” materializes. The lesson: leverage or perish.'}, bad:{fx:{rep:-2, stress:5}, text:'“Different situations,” they say, differently situated. Your loyalty discount continues.'}} },
        { label:'Get your own outside offer', fx:{pc:2, stress:6}, result:'Interviews at night, poker face by day. Exhausting, but now you’re holding cards.' },
        { label:'Congratulate them and mean it', fx:{stress:-3, rep:2}, result:'Rare emotional maturity. They remember it. Networks are built from exactly this.', moral:'good' } ] },
    { id:'broken_aircon', title:'Thermostat Wars',
      text:'The office AC has two settings: Antarctic and Venusian. Facilities controls it from another building, possibly another dimension.',
      choices:[
        { label:'Form a temperature coalition', fx:{pc:1, rep:2}, result:'You unite the frozen and the boiled. Facilities yields. You have governed.' },
        { label:'Bring a space heater (forbidden)', fx:{stress:-4, rep:-1}, result:'Contraband warmth. If asked, it is a “personal air quality device”.' },
        { label:'Endure. Complain artfully.', fx:{stress:2, luck:1}, result:'Your daily forecast posts (“Today: light indoor sleet”) become beloved. Morale, oddly, improves.' } ] },
    { id:'phantom_role', title:'The Job Posting That Is Your Job',
      text:'You find a public posting for a role that is, word for word, your job — listed 20% above your salary. The hiring manager is your manager.',
      choices:[
        { label:'Apply to it', random:{chance:0.5, good:{fx:{rep:5, pc:2}, text:'HR panics beautifully. The posting vanishes; a raise appears. Checkmate via paperwork.'}, bad:{fx:{rep:-3, stress:6}, text:'“It’s for a different function,” insists your manager, hiring your function.'}}, incident:'applied to their own job posting' },
        { label:'Send it to your manager with “?”', fx:{rep:2, stress:3}, result:'The single question mark does psychological damage no essay could. The posting is “re-scoped”.' },
        { label:'Send it to a friend as a referral', fx:{pc:2, rep:-1}, result:'If someone must be paid 20% more for your job, it may as well be someone who owes you.' } ] },
    { id:'legacy_system', title:'The System Nobody Understands',
      text:'A billing system written in 1997 needs “one small change”. Its documentation is a sticky note that says “DON’T”. Its author is deceased or in Portugal.',
      choices:[
        { label:'Make the change carefully', random:{chance:0.5, good:{fx:{rep:6, pc:1}, text:'It works. You are now the only living expert, which is both a promotion and a curse.'}, bad:{fx:{stress:8, rep:-2}, text:'Invoicing breaks in Belgium, specifically. Nobody knows why Belgium. The system knows.'}}, incident:'touched the forbidden 1997 billing system' },
        { label:'Declare it unchangeable, propose rewrite', fx:{rep:2, stress:3}, result:'The rewrite is approved, scoped at 6 months, and will take 4 years. A tale as old as software.' },
        { label:'Find the author in Portugal', fx:{pc:-1, rep:4, stress:-2}, req:{pc:1}, result:'One video call with a tanned, serene ex-engineer. “Ah yes. Line 4,022. Never touch line 4,022.” Wisdom.' } ] },
    { id:'micro_feedback', title:'The Feedback Sandwich Factory',
      text:'Your manager discovers “radical candor” via one YouTube video. You are summoned for feedback. They are holding printed notes and a stress ball.',
      choices:[
        { label:'Receive it with visible growth-mindset', fx:{rep:3, stress:4}, result:'You nod, journal, and say “that lands”. Your composure is added to your file as a strength.' },
        { label:'Give feedback back, radically', random:{chance:0.5, good:{fx:{rep:5, stress:-2}, text:'They’re stunned, then grateful. The relationship upgrades from “reporting line” to “alliance”.'}, bad:{fx:{rep:-4, stress:5}, text:'Candor, it turns out, was meant to flow in one direction. Noted. Filed. Remembered.'}} },
        { label:'Redirect to your accomplishments doc', fx:{pc:1, rep:1}, result:'You present the brag doc. The feedback session becomes a promotion case. Aikido.' } ] },
    { id:'charity_drive', title:'The Competitive Charity Drive',
      text:'Departments compete in a charity drive. Leaderboards are public. Executives have opinions. The charity has become... secondary.',
      choices:[
        { label:'Go all-in for the win', fx:{rep:4, pc:-1, stress:3}, req:{pc:1}, result:'Your team wins. A novelty check is printed. Somewhere, actual good occurs, incidentally.' },
        { label:'Donate quietly, skip the theater', fx:{stress:-2}, result:'No leaderboard glory. Just the smug inner peace of the untracked good deed.', moral:'good' },
        { label:'Audit the drive’s overhead', fx:{rep:-1, pc:1, stress:1}, result:'The novelty check cost $400. Your exposé circulates. Finance quietly respects you.' } ] },
    { id:'vc_visit', title:'Investor Petting Zoo Day',
      text:'Investors are touring the office. Everyone has been asked to look “busy but happy”. A board member is walking straight toward your desk.',
      choices:[
        { label:'Deliver a flawless 30-second pitch', random:{chance:0.55, good:{fx:{rep:6, pc:2}, text:'The board member repeats your phrase in the debrief. Your VP claims they coached you. Lies. Glory.'}, bad:{fx:{rep:-2, stress:5}, text:'You say “we’re crushing it” to a person holding your burn rate. Their smile does not reach their eyes.'}} },
        { label:'Perform busy-happiness as instructed', fx:{rep:1, stress:2}, result:'You type furiously into an empty doc, smiling. The doc reads “asdfjkl growth asdfjkl”. Art.' },
        { label:'Be honest about the {crisis}', fx:{rep:-3, pc:3, stress:3}, result:'The board member’s eyebrows rise. Weeks later, changes occur. Your name is never attached. Perfect crime.', moral:'good' } ] }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
