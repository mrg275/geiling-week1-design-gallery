// Mock data — extracted verbatim from legacy/index.html (v25).
// Shape contract documented in AGENTS.md. D2 will wrap this in localStorage.

/* ★ FILL IN: your real classes & grades here ————————————————————————
   One row per course. Keep the shape {code, name, term, grade}.
   Grades are shown exactly as written — "—" means "not entered yet".   */
var TRANSCRIPT = [
  { code:'ECON 10000', name:'The Elements of Economic Analysis I',    term:'Autumn 20—', grade:'—' },
  { code:'ECON 10200', name:'The Elements of Economic Analysis II',   term:'Winter 20—', grade:'—' },
  { code:'MATH 15300', name:'Calculus III',                           term:'Autumn 20—', grade:'—' },
  { code:'STAT 23400', name:'Statistical Models and Methods',         term:'Spring 20—', grade:'—' },
  { code:'CMSC 14100', name:'Introduction to Computer Science I',     term:'Autumn 20—', grade:'—' },
  { code:'CMSC 14200', name:'Introduction to Computer Science II',    term:'Winter 20—', grade:'—' },
  { code:'SOSC 15100', name:'Classics of Social & Political Thought I', term:'Autumn 20—', grade:'—' },
  { code:'HUMA 11500', name:'Philosophical Perspectives I',           term:'Autumn 20—', grade:'—' },
  { code:'BIOS 10130', name:'Core Biology',                           term:'Spring 20—', grade:'—' },
  { code:'ECON 20000', name:'The Elements of Economic Analysis III',  term:'Autumn 20—', grade:'—' }
];

/* ★ FILL IN: your writing here ————————————————————————————————————————
   One entry per piece. body is the full text (plain text, \n\n between
   paragraphs). Everything below is placeholder scaffolding.            */
var WRITINGS = [
  { title:'[Research paper title]', type:'Research paper', date:'20—',
    summary:'One line on the question this paper asks and what it finds.',
    body:'[Placeholder body — paste the full paper here.]\n\nAbstract, sections, and conclusion will all render as plain paragraphs in this reader.' },
  { title:'[Economics seminar paper]', type:'Research paper', date:'20—',
    summary:'One line on the model, the data, and the punchline.',
    body:'[Placeholder body — paste the full paper here.]' },
  { title:'[Essay title]', type:'Essay', date:'20—',
    summary:'One line on the argument this essay makes.',
    body:'[Placeholder body — paste the essay here.]' },
  { title:'[Personal essay]', type:'Essay', date:'20—',
    summary:'One line on what prompted it and where it lands.',
    body:'[Placeholder body — paste the essay here.]' },
  { title:'[Short story title]', type:'Creative writing', date:'20—',
    summary:'One line of synopsis — no spoilers.',
    body:'[Placeholder body — paste the story here.]' },
  { title:'[Poem or fragment]', type:'Creative writing', date:'20—',
    summary:'One line on the form or the occasion.',
    body:'[Placeholder body — paste it here.]' }
];

/* ★ FILL IN: your achievements here ——————————————————————————————————
   kind: 'trophy' | 'medal' | 'plaque' (changes the shape in the case). */
var TROPHIES = [
  { name:'[Achievement name]', year:'20—', kind:'trophy', note:'What it was for.' },
  { name:'[Award name]',       year:'20—', kind:'medal',  note:'What it was for.' },
  { name:'[Honor name]',       year:'20—', kind:'plaque', note:'What it was for.' },
  { name:'[Achievement name]', year:'20—', kind:'medal',  note:'What it was for.' },
  { name:'[Award name]',       year:'20—', kind:'trophy', note:'What it was for.' },
  { name:'[Honor name]',       year:'20—', kind:'plaque', note:'What it was for.' }
];

/* ★ FILL IN: meaningful art later ————————————————————————————————————
   Six wall frames around the hall are reserved. Give each a caption
   and a CSS background when you decide what belongs there.             */
var ARTDECOR = [
  { caption:'Untitled — reserved', hint:'North wall, left of the map.',
    grad:'radial-gradient(ellipse at 30% 70%, rgba(255,214,150,.35), transparent 55%), linear-gradient(160deg,#30435c,#1c2a3c)' },
  { caption:'Untitled — reserved', hint:'North wall, right of the map.',
    grad:'radial-gradient(circle at 70% 30%, rgba(255,240,210,.4), transparent 50%), linear-gradient(200deg,#5c4a30,#2e2416)' },
  { caption:'Untitled — reserved', hint:'West wall, between the stacks.',
    grad:'linear-gradient(170deg,#44584a,#223127 60%,#101a14)' },
  { caption:'Untitled — reserved', hint:'South wall, by the door you came in.',
    grad:'radial-gradient(ellipse at 50% 100%, rgba(150,67,58,.5), transparent 60%), linear-gradient(180deg,#2a2030,#171120)' },
  { caption:'Untitled — reserved', hint:'East wall, past the podcasts.',
    grad:'radial-gradient(circle at 24% 24%, rgba(230,240,255,.3), transparent 50%), linear-gradient(190deg,#243640,#121c22)' },
  { caption:'Untitled — reserved', hint:'South wall, west of the papers.',
    grad:'radial-gradient(ellipse at 70% 80%, rgba(255,222,150,.3), transparent 55%), linear-gradient(150deg,#4c3a52,#241c2c)' }
];

/* ★ FILL IN: future exhibits ————————————————————————————————————————
   Four plinths stand in the hall. Each currently carries a MOCK STATUE
   (statue: picks the carving — 'thinker' | 'orator' | 'discobolus' | 'owl').
   When a real exhibit is ready, rename the title, rewrite the caption/idea,
   and swap or remove the statue. */
var FUTURE_EXHIBITS = [
  { title:'The Thinker',        statue:'thinker',    caption:'Mock exhibit — to be replaced',
    idea:'[A contemplative bust holds this spot. What belongs here? A project, an instrument, a model…]',
    hint:'North aisle, west plinth.' },
  { title:'The Orator',         statue:'orator',     caption:'Mock exhibit — to be replaced',
    idea:'[A robed scholar holds this spot. What belongs here?]',
    hint:'North aisle, east plinth.' },
  { title:'The Discobolus',     statue:'discobolus', caption:'Mock exhibit — to be replaced',
    idea:'[An athlete mid-throw holds this spot. What belongs here?]',
    hint:'South aisle, west plinth.' },
  { title:'The Owl of Minerva', statue:'owl',        caption:'Mock exhibit — to be replaced',
    idea:'[Wisdom&rsquo;s owl holds this spot. What belongs here?]',
    hint:'South aisle, east plinth.' }
];

/* ——————————————————————— THE COLLECTION ——————————————————————— */
var WORKS = [
{ id:'tfs', type:'book', title:'Thinking, Fast and Slow', short:'Thinking, Fast & Slow',
  author:'Daniel Kahneman', mono:'DK', pub:'2011', consumed:'2025-03-02',
  tags:['psychology','decision-making','memory'],
  spine:'linear-gradient(180deg,#273a52,#1b2a3e)', dark:false,
  cover:'radial-gradient(circle at 70% 22%, rgba(255,222,150,.35), transparent 45%), linear-gradient(165deg,#2e4460,#16222f)',
  notes:[
    { d:'2025-03-05', t:'System 1 is not the villain of the book — it is the hero that occasionally lies. The useful discipline: notice the moments where an answer arrives too easily, and make that ease itself the trigger for slowing down.' },
    { d:'2025-03-09', t:'Applied the planning fallacy to my own problem sets: my inside-view estimate is reliably half the real time. Started using last quarter as the reference class instead of my optimism.' }
  ],
  quotes:[
    'Nothing in life is as important as you think it is, while you are thinking about it.',
    'A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.'
  ],
  cards:[
    { q:'What distinguishes System 1 from System 2?', a:'System 1 is fast, automatic, associative and effortless; System 2 is slow, deliberate, effortful and lazy — it endorses System 1’s impressions unless forced to engage.' },
    { q:'What is the availability heuristic?', a:'Judging how likely or frequent something is by how easily examples come to mind — so vivid, recent, or dramatic events feel far more common than they are.', seed:true },
    { q:'What is the planning fallacy, and what is the standard remedy?', a:'Systematically underestimating time and cost by imagining the best-case inside view. Remedy: take the outside view — base the forecast on how similar projects actually went.' }
  ]},
{ id:'ah', type:'book', title:'Atomic Habits', short:'Atomic Habits',
  author:'James Clear', mono:'JC', pub:'2018', consumed:'2025-01-12',
  tags:['habits','systems','psychology'],
  spine:'linear-gradient(180deg,#f0e7d2,#ded0b0)', dark:true,
  cover:'radial-gradient(circle at 30% 80%, rgba(176,141,74,.3), transparent 55%), linear-gradient(160deg,#f2e9d4,#d9c9a4)',
  notes:[
    { d:'2025-01-15', t:'The real thesis is identity, not productivity: each small rep is evidence for a self-image, and the self-image then does the heavy lifting. Rewrote my habits as identities — not “review cards daily” but “I am someone who does not break review chains.”' }
  ],
  quotes:[
    'You do not rise to the level of your goals. You fall to the level of your systems.',
    'Every action you take is a vote for the type of person you wish to become.'
  ],
  cards:[
    { q:'What are the four laws of behavior change?', a:'Make it obvious, make it attractive, make it easy, make it satisfying — and invert each one to break a bad habit.', seed:true },
    { q:'What is habit stacking?', a:'Anchoring a new habit to an existing one with the formula “After [current habit], I will [new habit],” so the old routine becomes the cue for the new.' }
  ]},
{ id:'dw', type:'book', title:'Deep Work', short:'Deep Work',
  author:'Cal Newport', mono:'CN', pub:'2016', consumed:'2025-02-08',
  tags:['focus','habits','creativity'],
  spine:'linear-gradient(180deg,#6d3328,#54251c)', dark:false,
  cover:'radial-gradient(ellipse at 50% 0%, rgba(255,230,180,.25), transparent 50%), linear-gradient(170deg,#7a3a2c,#3e1b14)',
  notes:[
    { d:'2025-02-12', t:'Attention residue explains why my “quick checks” between problems are so expensive: part of the mind stays on the inbox for twenty minutes after. The fix is structural, not willpower — blocks on the calendar, phone in another room.' },
    { d:'2025-02-20', t:'Scheduled two 90-minute deep blocks before noon, Reg basement, no laptop Wi-Fi. Output of one block beats a scattered afternoon. The ritual (same desk, same tea) halves the spin-up time.' }
  ],
  quotes:[
    'To produce at your peak level you need to work for extended periods with full concentration on a single task, free from distraction.'
  ],
  cards:[
    { q:'Define “deep work.”', a:'Professional activity performed in a state of distraction-free concentration that pushes cognitive capability to its limit — creating value that is hard to replicate.', seed:true },
    { q:'What is attention residue?', a:'When switching tasks, part of your attention stays stuck on the previous task, degrading performance on the next one — the cost of every “quick check.”' }
  ]},
{ id:'mis', type:'book', title:'Make It Stick', short:'Make It Stick',
  author:'Brown, Roediger & McDaniel', mono:'MS', pub:'2014', consumed:'2025-04-10',
  tags:['learning','memory','psychology'],
  spine:'linear-gradient(180deg,#b3763a,#8f5a28)', dark:false,
  cover:'repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 4px, transparent 4px 20px), linear-gradient(165deg,#b57a3e,#6e421c)',
  notes:[
    { d:'2025-04-14', t:'The book that justifies this entire library: rereading produces fluency, and fluency masquerades as knowledge. Everything worth keeping now becomes a card the same evening I read it.' }
  ],
  quotes:[
    'Learning is deeper and more durable when it is effortful.',
    'Rereading text and massed practice of a skill are among the least productive study strategies — yet they are the most widely used.'
  ],
  cards:[
    { q:'Why does retrieval practice beat rereading?', a:'The effort of pulling a memory out strengthens its trace and reveals gaps; rereading only builds recognition fluency, which feels like mastery but is not.', seed:true },
    { q:'What are “desirable difficulties”?', a:'Deliberate obstacles — spacing, retrieval, interleaving, variation — that slow visible progress but substantially deepen long-term retention.' },
    { q:'What is interleaving?', a:'Mixing different topics or problem types within one session. It feels worse than blocked practice but produces better discrimination and transfer.' }
  ]},
{ id:'det', type:'book', title:'The Design of Everyday Things', short:'Everyday Things',
  author:'Don Norman', mono:'DN', pub:'1988', consumed:'2025-05-16',
  tags:['design','psychology','systems'],
  spine:'linear-gradient(180deg,#e8ddc4,#d2c3a0)', dark:true,
  cover:'radial-gradient(circle at 68% 64%, #96433a 0 13%, transparent 14%), linear-gradient(150deg,#ece2cc,#cbbb97)',
  notes:[
    { d:'2025-05-19', t:'Once you learn to see Norman doors you cannot stop. Turned the lens on this app: every clickable thing should advertise itself without a tooltip — if it needs a label, the shape failed first.' }
  ],
  quotes:[
    'Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.'
  ],
  cards:[
    { q:'Affordance vs. signifier?', a:'An affordance is the possible action a thing permits (a handle affords pulling); a signifier is the perceivable cue that communicates it (the flat plate that says “push me”).', seed:true },
    { q:'What are the gulfs of execution and evaluation?', a:'Execution: the gap between a user’s intention and the actions the system allows. Evaluation: the gap between the system’s state and the user’s ability to perceive what happened.' }
  ]},
{ id:'med', type:'book', title:'Meditations', short:'Meditations',
  author:'Marcus Aurelius', mono:'MA', pub:'c. 180', consumed:'2025-06-21',
  tags:['philosophy','focus','habits'],
  spine:'linear-gradient(180deg,#8a8172,#6e6557)', dark:false,
  cover:'repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 5px, transparent 5px 24px), linear-gradient(175deg,#7c7365,#4e463a)',
  notes:[
    { d:'2025-06-26', t:'Reads like a man writing flashcards to himself — the same few truths re-derived every morning for a decade. The original spaced repetition, with an empire as the distraction.' }
  ],
  quotes:[
    'You have power over your mind — not outside events. Realize this, and you will find strength.',
    'The impediment to action advances action. What stands in the way becomes the way.'
  ],
  cards:[
    { q:'What is the Stoic dichotomy of control?', a:'Some things are up to us (judgments, intentions, responses) and some are not (events, others’ opinions). Peace comes from spending effort only on the first category.', seed:true },
    { q:'What does “the obstacle is the way” mean in practice?', a:'Every impediment contains the next action: the thing blocking the plan becomes the material of the plan — reframe the obstacle as the task itself.' }
  ]},

{ id:'pg', type:'essay', title:'How to Do Great Work', short:'Great Work',
  author:'Paul Graham', mono:'PG', pub:'2023', consumed:'2025-07-07',
  tags:['creativity','focus','learning'],
  spine:'linear-gradient(180deg,#d8893a,#b56a22)', dark:false,
  cover:'linear-gradient(0deg, #b5611f 0 14%, transparent 14%), linear-gradient(155deg,#f3ecda,#dccead)',
  notes:[
    { d:'2025-07-10', t:'The compounding argument is the core: only genuine curiosity survives the boring middle of anything hard, so choosing what to work on by interest is not indulgence — it is the only sustainable fuel source.' }
  ],
  quotes:[
    'The way to figure out what to work on is by working. If you’re not sure what to work on, guess.'
  ],
  cards:[
    { q:'What three qualities should chosen work have, per Graham?', a:'Natural aptitude for it, deep interest in it, and scope to do great work within it.' },
    { q:'Why does Graham rank curiosity above discipline?', a:'Great work needs years of sustained attention; discipline depletes, but genuine curiosity renews itself — it is the only motive that lasts the whole distance.' }
  ]},
{ id:'bush', type:'essay', title:'As We May Think', short:'As We May Think',
  author:'Vannevar Bush', mono:'VB', pub:'1945', consumed:'2025-08-14',
  tags:['memory','systems','design'],
  spine:'linear-gradient(180deg,#2e5a74,#1d3e52)', dark:false,
  cover:'repeating-linear-gradient(0deg, rgba(190,224,250,.12) 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, rgba(190,224,250,.12) 0 1px, transparent 1px 20px), linear-gradient(140deg,#17364e,#2a6086)',
  notes:[
    { d:'2025-08-18', t:'The memex is this library, eighty years early: storage was never the problem, retrieval by association is. His “trails” are my tag edges — selection by association, not by index.' }
  ],
  quotes:[
    'The human mind operates by association. With one item in its grasp, it snaps instantly to the next that is suggested by the association of thoughts.'
  ],
  cards:[
    { q:'What was the memex?', a:'Bush’s imagined desk that stores all one’s books and records and links them into associative trails — the conceptual ancestor of hypertext and of personal knowledge tools.', seed:true }
  ]},
{ id:'emer', type:'essay', title:'Self-Reliance', short:'Self-Reliance',
  author:'Ralph Waldo Emerson', mono:'RE', pub:'1841', consumed:'2025-09-09',
  tags:['philosophy','creativity'],
  spine:'linear-gradient(180deg,#44584a,#2e4034)', dark:false,
  cover:'linear-gradient(170deg,#3f5a3a,#7c9469 62%,#d5dfc2)',
  notes:[
    { d:'2025-09-13', t:'“Foolish consistency” pairs oddly well with spaced repetition: drill the facts relentlessly, but keep the conclusions revisable. Memory should be stable; opinions should not.' }
  ],
  quotes:[
    'A foolish consistency is the hobgoblin of little minds.',
    'Envy is ignorance; imitation is suicide.'
  ],
  cards:[
    { q:'What does Emerson mean by “a foolish consistency is the hobgoblin of little minds”?', a:'Clinging to yesterday’s positions merely to appear consistent blocks growth — a strong mind contradicts its past self freely as its understanding improves.' }
  ]},

{ id:'wbd', type:'article', title:'Why Books Don’t Work', short:'Books Don’t Work',
  author:'Andy Matuschak', mono:'AM', pub:'2019', consumed:'2025-10-02',
  tags:['learning','memory','design'],
  spine:'linear-gradient(180deg,#f3ecda,#e2d6ba)', dark:true,
  cover:'radial-gradient(circle at 24% 72%, #96433a 0 9%, transparent 10%), linear-gradient(140deg,#f8f3e6,#e4d7b8)',
  notes:[
    { d:'2025-10-05', t:'His accusation — that books assume understanding transfers by exposure — is confirmed by my own retention from most of them. The fix adopted here: the book is raw material; the cards and reflections are the artifact.' }
  ],
  quotes:[
    'Books don’t work for the same reason that lectures don’t work: neither medium has any explicit theory of how people actually learn.'
  ],
  cards:[
    { q:'What is “transmissionism,” per Matuschak?', a:'The implicit, mistaken model that knowledge flows directly from text or speaker into a mind through mere exposure — reading as absorbing.', seed:true },
    { q:'What does Matuschak propose instead of the plain book?', a:'A “mnemonic medium”: prose with spaced-repetition prompts woven into the reading itself, so remembering is part of the act of reading.' }
  ]},
{ id:'nls', type:'article', title:'Augmenting Long-term Memory', short:'Augmenting Memory',
  author:'Michael Nielsen', mono:'MN', pub:'2018', consumed:'2025-11-18',
  tags:['memory','learning','systems'],
  spine:'linear-gradient(180deg,#4a3a68,#352a4c)', dark:false,
  cover:'radial-gradient(circle at 72% 22%, rgba(255,255,255,.3), transparent 42%), linear-gradient(145deg,#352a4c,#6a4f8c 62%,#c3b2d8)',
  notes:[
    { d:'2025-11-21', t:'His arithmetic rewired my card-writing: one card costs roughly five minutes of lifetime review. So the question is never “could I remember this?” but “is this worth five minutes?” Most facts are not. The ones that are, compound.' }
  ],
  quotes:[
    'Anki makes memory a choice, rather than a haphazard event, to be left to chance.'
  ],
  cards:[
    { q:'What is Nielsen’s estimate of a card’s lifetime cost?', a:'About five minutes of total review over twenty years — cheap enough that remembering nearly anything becomes a deliberate decision.', seed:true },
    { q:'Why should flashcards be atomic?', a:'One fact per card: a failure then diagnoses exactly what is weak, and each retrieval strengthens one clean association instead of a blurry bundle.' }
  ]},

{ id:'hub', type:'podcast', title:'Huberman Lab — Improve Your Memory', short:'Huberman: Memory',
  author:'Andrew Huberman', mono:'AH', pub:'2022', consumed:'2026-01-10',
  tags:['memory','psychology','learning'],
  spine:'linear-gradient(180deg,#17333f,#0f2229)', dark:false,
  cover:'radial-gradient(circle at 50% 84%, rgba(63,176,196,.5), transparent 55%), linear-gradient(140deg,#101418,#23394a 62%,#3fa8bc)',
  notes:[
    { d:'2026-01-13', t:'Protocol notes: a brief adrenaline spike right after studying (cold shower, hard intervals) stamps the memory in; the consolidation itself happens in deep sleep that night. Also a defense of this whole room — mentally walking a space counts as a retrieval rep.' }
  ],
  quotes:[
    'Repetition works, but what the nervous system really responds to is salience — it keeps what it flags as important.'
  ],
  cards:[
    { q:'Per Huberman, what two things after learning most strengthen a new memory?', a:'Emotional salience or a brief adrenaline spike shortly after encoding, and deep sleep that night, when the actual consolidation and rewiring occur.', seed:true },
    { q:'What role does the hippocampus play in memory?', a:'It binds new episodic information together, and during sleep its replay gradually transfers those memories to the cortex for long-term storage.' }
  ]},
{ id:'tkp', type:'podcast', title:'The Knowledge Project — Mental Models', short:'Mental Models',
  author:'Shane Parrish', mono:'SP', pub:'2021', consumed:'2026-02-14',
  tags:['decision-making','systems','learning'],
  spine:'linear-gradient(180deg,#2c4034,#1e2e25)', dark:false,
  cover:'repeating-linear-gradient(60deg, rgba(255,255,255,.05) 0 2px, transparent 2px 16px), linear-gradient(150deg,#1f2d26,#3c5a47 62%,#85a68c)',
  notes:[
    { d:'2026-02-16', t:'The latticework claim — a model is only useful once connected to other models — is the third source in this collection to converge on association as the unit of knowledge. Bush, Matuschak, Parrish: same map, different roads.' }
  ],
  quotes:[
    'You can’t make good decisions with a single lens. The world is multidisciplinary, and your map of it has to be too.'
  ],
  cards:[
    { q:'What is a “latticework of mental models”?', a:'Munger’s idea via Parrish: the core models of many disciplines, deliberately connected, so new facts have structure to stick to instead of floating free.' },
    { q:'What is inversion?', a:'Solving problems backward — ask what would guarantee failure, then systematically avoid it.' }
  ]}
];

var REFLECTIONS = [
  { date:'2026-02-20', source:'Meditations',
    quote:'The impediment to action advances action. What stands in the way becomes the way.',
    text:'February slump: the review queue itself became the obstacle — stale, joyless, overdue. Read the obstacle as the instruction: if the queue is boring, the cards are either too easy or too trivial to deserve memory. Deleted thirty of them in one sitting. The queue is interesting again, which Make It Stick would predict: difficulty was never the problem, meaninglessness was.' },
  { date:'2025-11-24', source:'Augmenting Long-term Memory',
    quote:'Anki makes memory a choice, rather than a haphazard event, to be left to chance.',
    text:'If memory is a choice, then so is forgetting — and most of what I highlight deserves to be forgotten. Nielsen’s five-minute price tag turns out to be a curation tool more than a memory tool: writing the card is where I decide what kind of economist, and what kind of person, keeps living in my head rent-free.' }
];

/* ——————————————————————— constants & helpers ——————————————————————— */
var DAY = 86400e3;
var NOW0 = Date.now();
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var TYPE_LABEL = { book:'Book', essay:'Essay', article:'Article', podcast:'Podcast' };
var SECTION_OF = { book:'BOOKS · west stacks', essay:'ESSAYS · west stacks', article:'ARTICLES · east stacks', podcast:'PODCASTS · east stacks' };
var ALL_TAGS = ['memory','learning','habits','psychology','decision-making','focus','systems','philosophy','creativity','design'];

export { TRANSCRIPT, WRITINGS, TROPHIES, ARTDECOR, FUTURE_EXHIBITS, WORKS, REFLECTIONS, ALL_TAGS };
