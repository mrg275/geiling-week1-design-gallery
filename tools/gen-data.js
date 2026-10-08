// Translates Matthew's Notion Knowledge Base into src/data.js.
// Source of truth is Notion; this file records the mapping so it can be re-run.
//   Book Reading Log      -> WORKS type 'book'   (Read / Reading only)
//   Article Reading Log   -> WORKS type 'essay'  (essays + articles combined, Read / Reading only)
//   Content Pipeline Log  -> WORKS type 'queued' (unread; never duplicated with the above)
//   Convictions           -> REFLECTIONS (source + date preserved)
//   Misc.                 -> REFLECTIONS (Exact Thought verbatim + Stan's Take alongside)
// Verbatim text is copied exactly, typos included. Tightened companions sit
// alongside in `tight`, never replacing the original.
const fs = require('fs');

const V = (d, t, tight) => (tight ? { d, t, tight } : { d, t });

/* ─────────────────────────── BOOKS ─────────────────────────── */
const BOOKS = [
{ id:'sapiens', title:'Sapiens', short:'Sapiens', author:'Yuval Noah Harari', mono:'YH',
  pub:'2011', consumed:'2026-10-03', status:'Reading', pages:464,
  tags:['history','civilization','ai','anthropology'],
  spine:'linear-gradient(180deg,#8a6a3a,#5d4523)', dark:false,
  notes:[
  V('2026-10-03','Christianity came before Islam. The history of humans is minuscule compared to the history of energy. Energy first formed 13.8B years ago first homosapiens were 200,000 years ago',
    'Christianity predates Islam. Human history is minuscule compared with the history of energy. Energy first formed 13.8 billion years ago; the first Homo sapiens appeared 200,000 years ago.'),
  V('2026-10-03','Humans have had vastly bigger brains than other animals for a long time now. The key question is what we do with our brains. Back then there wasn’t much use to brains as we could be torn apart by an ape at any second. With AI we kind of have a similar phenomenon — AI is quickly becoming vastly more intelligent than us. But we control the inputs like power and compute so it can’t rlly do anything to defeat us. What happens though if these AI brains recursively self improve and are able to become completely independent in some sense. They may be able to point a proverbial gun at us similar to how we are able to point a gun at apes',
    'Humans have long had much larger brains than other animals, but the key question is how we use them. In the past, greater intelligence offered little protection from being killed by an ape. AI presents a similar contrast: it is becoming far more intelligent than humans, while people still control its inputs, such as power and compute. The concern is what happens if AI recursively self-improves and becomes independent enough to overcome that dependence, shifting the balance of power as humans once did with other animals.'),
  V('2026-10-04','we were more like hyenas when we were a younger species. One of our earliest niches was using stone tools to crack open bone marrow slowly inserting us into the food chain after hyenas',
    'Early humans were more like hyenas. One of our earliest niches was using stone tools to crack open bone marrow, which slowly inserted us into the food chain after hyenas.'),
  V('2026-10-04','generally speaking it’s difficult for us to comprehend what order of magnitude of intelligence can unlock. For us, when we discovered fire it unlocked the ability to turn indigestible food into digestible food like wheat and potatoes. Early animals could never have even conceived of this food being digestible, yet we made it a possibility and essentially created energy out of this air',
    'It is generally difficult for us to comprehend what an order-of-magnitude increase in intelligence can unlock. When humans discovered fire, it made indigestible foods like wheat and potatoes digestible. Early animals could never have conceived of these as food, yet we made it possible, essentially creating energy out of thin air.'),
  V('2026-10-05','one of the greatest debates of human kind is the replacement theory versus the interbreeding theory. We have found that it’s sort of a mix of the both with more prominence to the replacement. We share most of our DNA with Homo sapiens to the point that we are homosapiens, however specific human populations do have small single % DNA strands from past homo species such as Neanderthals and others',
    'One of the greatest debates in human history is replacement theory versus interbreeding theory. The evidence suggests a mix of both, with more weight on replacement. Most of our DNA is Homo sapiens DNA, but some human populations carry small single-digit percentages of DNA from other Homo species, such as Neanderthals.'),
  V('2026-10-05','the stadel lion man was the first known human expression of art. It’s the logo of the Peugeot car',
    'The Stadel lion man is the first known human expression of art. It is also the logo of the Peugeot car.'),
  V('2026-10-06','a major difference between us and other intelligent animals is our ability to organize millions of people under a common goal. Apes can only organizes troops of 50 or so, but we do this through fiction. We are able to create stories (religion, laws, etc.) to convince a person who has never met another person to die for that person',
    'A major difference between humans and other intelligent animals is our ability to organize millions of people under a common goal. Apes can only organize troops of about 50, but humans do it through fiction. We create stories, such as religion and laws, that can convince a person to die for someone they have never met.'),
  V('2026-10-06','The agricultural revolution was a fraud. It made the lives of humans much worse short term. Hunter and gatherers did things that were more apt for humans to do and had more balanced diets and could roam freely. Agricultural revolution essentially chained us to areas of lands, thus increasing violence and making us slaved to the land. Long term it was great as we produced much more food per capita which allowed us to reproduce more but the micro lives were worse. It’s a myth that the agricultural revolution was all good',
    'The agricultural revolution was not wholly beneficial. In the short term, it made many people’s lives worse: hunter-gatherers had more varied diets and could move freely, while farming tied people to the land and increased violence. In the long term, agriculture produced more food per person and supported population growth, but individual lives could still be worse. The idea that the agricultural revolution was entirely good is a myth.'),
  V('2026-10-07','on of and perhaps the biggest unique point of humans is our ability to organize larger than 100s of individuals towards a collective. We do this with myths: myths of gods, kings, LLCs, social order, etc.',
    'One of humanity’s most distinctive abilities is organizing groups larger than a few hundred people around a shared purpose. We do this through myths: shared beliefs about gods, kings, corporations, social order, and more.'),
  V('2026-10-07','many people believe that the elite are Cynsits and they wield god, motherland, etc. to their advantage. This is unlikely to be true as Diogenes lived in a barrel. When Alexander the Great visited him and asked what he could do Diogenes famously said that he could move to the side to block the sunlight. The elite also likely buy into their beliefs about god and all this other stuff',
    'Many people think elites cynically use God, the motherland, and similar ideas for their own benefit. But Diogenes’ story suggests this may be too simple: he lived in a barrel and, when Alexander the Great asked what he could do for him, Diogenes asked him to move aside and stop blocking the sun. Elites may also genuinely believe in the ideas they invoke.')],
  quotes:['There is no god. But don’t tell that to my servant, lest he murder me at night. — Voltaire, quoted in Sapiens'],
  cards:[
    { q:'Why does Harari say fiction is humanity’s defining advantage?', a:'Because shared stories — gods, kings, LLCs, social order — let us organise millions of strangers around one goal, where apes top out at troops of about fifty.', seed:true },
    { q:'What is the case that the agricultural revolution was “a fraud”?', a:'Per capita food and population rose, but individual lives got worse: hunter-gatherers ate more varied diets and roamed freely, while farming chained people to land and increased violence.' },
    { q:'What parallel do you draw between early human brains and AI?', a:'Big brains were useless until we could act on them; AI is far more intelligent than us but depends on inputs we control — power and compute. The risk is recursive self-improvement removing that dependence.' }]},

{ id:'ulb', title:'The Unbearable Lightness of Being', short:'Unbearable Lightness', author:'Milan Kundera', mono:'MK',
  pub:'1984', consumed:'2026-08-19', status:'Read', pages:314,
  tags:['philosophy','literature','love'],
  spine:'linear-gradient(180deg,#6d3328,#431d16)', dark:false,
  notes:[
  V('2026-08-19','1. Everyone is quick to impose their own philosophies upon others actions, when rather people’s past experiences and ways of viewing life need to be seen as the motivations for actions. Tomas was unfaithful but it was not the same type of unfaithfulness as Teresa’s\n\n2. True happiness can be found in lack of a mission. I wonder if I will be happy without a mission but with people I love by my side.\n\n3. Mans love for animals is the only unconditional love. We don’t require or ask for any love in return we love unconditionally\n\n4. Tomas and Tereza died the happiest. Sabina the saddest and Franz in the middle, but closer to Sabina\n\nBeing with someone driven by love is so much better than driven by lust',
    'Moral judgment should account for the histories and inner frameworks that motivate people’s actions; Tomas’s infidelity differs in character from Tereza’s. The novel raises the possibility that happiness may come through an absence of grand mission, especially alongside people one loves. Human love for animals is presented as uniquely unconditional: it asks for no love in return. Among the major characters, Tomas and Tereza arrive at the happiest ending; Sabina the saddest; Franz falls between them, nearer Sabina. Love-driven partnership is meaningfully better than lust-driven partnership.')],
  quotes:['“Es muss sein!” — “It must be!”','“Der schwer gefasste Entschluss” — “The decision reached with difficulty”'],
  cards:[
    { q:'What does the novel suggest about judging other people’s actions?', a:'That we impose our own philosophies too quickly — a person’s past and way of seeing life are the real motivations. Tomas’s unfaithfulness is not the same kind as Tereza’s.', seed:true },
    { q:'Which love does the book treat as the only unconditional one?', a:'Man’s love for animals — we ask for nothing in return.' }]},

{ id:'msfm', title:'Man’s Search for Meaning', short:'Man’s Search for Meaning', author:'Viktor E. Frankl', mono:'VF',
  pub:'1946', consumed:'2026-08-31', status:'Read', pages:184,
  tags:['philosophy','psychology','resilience'],
  spine:'linear-gradient(180deg,#2e4634,#1b2b1f)', dark:false,
  notes:[
  V('2026-08-31','- Man is much stronger than we can ever imagine.\n- Paslow’s hierarchy of needs is real. Very quickly we disregard the upper rungs when the lower rungs are threatened.',
    'Human resilience is far greater than we tend to imagine. Maslow’s hierarchy becomes tangible under deprivation: when basic needs are threatened, higher-order needs quickly recede.')],
  quotes:[],
  cards:[
    { q:'What happens to higher-order needs under deprivation?', a:'They recede fast. The moment the lower rungs of the hierarchy are threatened, the upper rungs get disregarded.', seed:true }]},

{ id:'amf', title:'A Moveable Feast', short:'A Moveable Feast', author:'Ernest Hemingway', mono:'EH',
  pub:'1964', consumed:'2026-08-15', status:'Read', pages:0,
  tags:['literature','writing','paris'],
  spine:'linear-gradient(180deg,#b08d4a,#7a5a28)', dark:true,
  notes:[
  V('2026-08-15','- I love the way Hemingway writes, it makes for an easy and fast read.\n- Outlook on life is so important. Hemingway encounters difficult times, people, and situations but he always has a positive outlook and knows he can just go to a cafe and drink and write and be happy.\n- Paris is a beautiful city that I want to spend more time in.\n- Good friends are so important and spending time with them is so important.',
    'Hemingway’s spare style makes the book unusually quick and easy to read. His response to difficulty is a model of agency: return to simple sources of meaning — cafés, writing, drinking, and happiness. Paris is a city Matthew wants to spend more time in. Close friendship and deliberately spending time with friends matter deeply.')],
  quotes:[],
  cards:[
    { q:'What is Hemingway’s model for handling difficulty?', a:'Return to simple sources of meaning — a café, a drink, writing — and keep the outlook positive regardless of the circumstances.' }]},

{ id:'med', title:'Meditations by Marcus Aurillius', short:'Meditations', author:'Marcus Aurelius', mono:'MA',
  pub:'180', consumed:'2026-07-01', status:'Read', pages:0,
  tags:['philosophy','stoicism'],
  spine:'linear-gradient(180deg,#3c2c18,#241a0e)', dark:false,
  notes:[], quotes:[], cards:[] },
];

/* ─────────── ESSAYS + ARTICLES (combined, as instructed) ─────────── */
const E = (id, title, short, author, mono, pub, consumed, status, tags, spine, dark, notes, quotes, cards) =>
  ({ id, title, short, author, mono, pub, consumed, status, tags, spine, dark,
     notes: notes || [], quotes: quotes || [], cards: cards || [] });

const ESSAYS = [
E('shortness','On the Shortness of Life','On the Shortness of Life','Seneca','SE','49','2026-10-08','Read',
  ['philosophy','stoicism','time'],'linear-gradient(180deg,#6d3328,#40201a)',false,[
  V('2026-10-08','Life isn’t short, we just waste it. That’s his main gist','Life isn’t short; we waste it. That’s Seneca’s main point.'),
  V('2026-10-08','“everyone suffers from a longing for the future and a loathing for the present”','We long for the future and loathe the present.'),
  V('2026-10-08','procrastination is the greatest waste of time as it future','Procrastination is the greatest waste of time, as it…'),
  V('2026-10-08','what I’ve learned is that I should make decisions quickly and do things quickly. Do only what I want and what is necessary. My priority should always be the development of my mind. All else is a distraction and should be handled swiftly','Decide and act quickly. Do only what I want and what is necessary. Prioritize developing my mind; handle everything else swiftly, since it is a distraction.'),
  V('2026-10-08','generally speaking I don’t really agree with Seneca. He doesn’t make a point on the true meaning of life except enjoying the present but also critiques people’s enjoyment of the present. I disagree that toiling over old philosophies and schools of thought is somehow a more useful way of spending your time. I sort of believe that life has no meaning. Part of the beauty of humans is for us to construct meaning out of nothing. I agree that one shouldn’t waste one’s life do8ng things they find meaningless but I think it is worthwhile to find something that brings you joy and balance and commit yourself to it','I generally disagree with Seneca: he praises enjoying the present while criticizing others for doing so, and I don’t think studying old philosophies is necessarily a better use of time. I believe life has no inherent meaning; humans can create meaning, and it’s worth finding something that brings joy and balance and committing to it rather than spending life on things that feel meaningless.'),
  V('2026-10-08','my mind should always be 100% focused on the present. My present conversation, reading, etc. when I feel my mind wandering to the past or future I must reign it into the present','Keep my mind fully on the present — the conversation or reading in front of me. When it wanders to the past or future, bring it back to the present.'),
  V('2026-10-08','Beyond biology, nothing is truly meaningful unless we deam is to be so. As humans we are gifted with the beauty of imagination. We can imagine value in things that are not intrinsically valuable and this is ok because nothing is intrinsically valuable','Beyond biology, nothing is meaningful or valuable unless we decide it is. We can imagine value in things with no intrinsic value, and that is okay.')],
  ['“everyone suffers from a longing for the future and a loathing for the present”'],
  [{ q:'What is Seneca’s central claim, and where do you part ways with him?', a:'That life isn’t short, we waste it. You disagree that studying old philosophy is the better use of time, and you hold that life has no inherent meaning — the beauty is constructing it from nothing.', seed:true },
   { q:'What rule did you take from Seneca about attention?', a:'Keep the mind 100% on the present — this conversation, this reading — and rein it back whenever it drifts to past or future.', seed:true }]),

E('enlightenment','What Is Enlightenment?','What Is Enlightenment?','Immanuel Kant','IK','1784','2026-10-07','Reading',
  ['philosophy','politics','freedom'],'linear-gradient(180deg,#53607a,#2f3950)',false,[
  V('2026-10-07','the Age of Enlightenment represents the common man becoming a scholar. It sets the foundations for freedom of speech. It suggests taking away the threats made by power structures to suppress one’s own human desires to think and reason for oneself','The Age of Enlightenment represents ordinary people becoming scholars and lays the foundations for freedom of speech. It calls for removing the threats power structures use to suppress people’s desire to think and reason for themselves.'),
  V('2026-10-07','Kant also argues that enlightenment is inevitable. The best governments will recognize and protect this, as men will eventually rise up regardless','Kant also argues that enlightenment is inevitable. The best governments will recognize and protect it, since people will eventually rise up regardless.'),
  V('2026-10-07','This is really the foundation of our 1st amendment. Kant argues that the best government lets people argue and use reason in public while also commanding the respect to follow orders','This is the foundation of our First Amendment. Kant argues that the best government lets people debate and reason publicly while still requiring respect for its orders.')],
  ['“have courage to use your own understanding”'],
  [{ q:'What does Kant say the best government does?', a:'Lets people argue and reason publicly, while still commanding the respect to have its orders followed.', seed:true }]),

E('starlink','Why is Starlink on planes so good?','Why Starlink on planes is good','Stardrift','SD','2026','2026-03-23','Read',
  ['space','technology','manufacturing'],'linear-gradient(180deg,#2e3a4c,#1a2230)',false,[
  V('2026-03-23','Another amazing example of an Elon company gaining dominance from lowering manufacturing costs. This allows them to have low earth orbit starlink satellites that depreciate in 5 years and can be replaced. Just like Tesla did with EVs. Elon is a manufacturing genius','Another example of an Elon company winning through manufacturing cost reduction. Lower build costs let SpaceX operate a replaceable low-earth-orbit Starlink constellation on short depreciation cycles, similar to how Tesla used manufacturing advantages to dominate EVs. The deeper pattern is that Elon’s edge is manufacturing.')],
  [], [{ q:'What is the repeating pattern behind SpaceX and Tesla’s dominance?', a:'Manufacturing cost reduction. Cheap builds let SpaceX run a replaceable LEO constellation on five-year depreciation, the same way Tesla used manufacturing to win EVs.' }]),

E('power-intel','Power in the Age of Intelligence','Power in the Age of Intelligence','Packy McCormick','PM','2026','2026-03-11','Read',
  ['ai','strategy','markets'],'linear-gradient(180deg,#44583f,#28351f)',false,[
  V('2026-03-11','Dominance may keep accruing to the top 1% of companies as local moats weaken; you see versions of this in private markets, public markets, and VC. Historically, “local” advantage has eroded as distribution and delivery constraints fall away, and even software\'s local moat weakens if more people can build. Every industry has a high ground or “Schwerpunkt” — the true center of gravity that determines power. Strategy is to identify that Schwerpunkt, break through to it, seize the high ground, then integrate outward. SpaceX example: its Schwerpunkt was cost-to-orbit; reusable rockets broke it, and Starlink extends the advantage. Key takeaway: each industry has its own constraint structure and resulting high grounds, and many cannot be captured by digital intelligence alone.')],
  [], [{ q:'What is a “Schwerpunkt” and how do you use it?', a:'The true centre of gravity of an industry — its high ground. Strategy is to identify it, break through to it, seize it, then integrate outward. SpaceX’s was cost-to-orbit.', seed:true }]),

E('elad-gil','Elad Gil’s framework for spotting billion-dollar markets before they look big.','Elad Gil on big markets','The Venture Crew','VC','2025','2025-11-05','Read',
  ['startups','investing','markets'],'linear-gradient(180deg,#71543a,#473424)',false,[
  V('2025-11-05','11/5 — Elad Gil Billion Dollar Markets\n\n# Market > Team > Idea\n\n1) First principles\n   -> What changes? Cost? Tech?\n2) Product first\n   -> Would you pay for this right now?\n3) Look on the fringe\n\nThree types of markets\n1) New tech\n   -> tech that feels like a toy\n2) Look for crowded markets\n   -> demand > more -> 10x product\n\nWhat\'s a product or tool you hate but are forced to use?')],
  [], [{ q:'What is Elad Gil’s ordering of what matters?', a:'Market > Team > Idea. Then: reason from first principles about what changed, ask if you’d pay for the product right now, and look on the fringe.' }]),

E('mlg','Machines of Loving Grace','Machines of Loving Grace','Dario Amodei','DA','2024','2026-03-11','Read',
  ['ai','work','philosophy'],'linear-gradient(180deg,#8a6527,#55400f)',false,[
  V('2026-03-11','Dario — Machines of Loving Grace\n\n- One way to think about AI is through comparative advantage.\n  -> We delegate our worst work to AI and get so good at the other stuff.\n\n- Hunter-gatherers may have felt that life must be meaningless and boring without hunting and gathering.')],
  [], [{ q:'What is the comparative-advantage way of thinking about AI?', a:'We delegate our worst work to AI and get very good at everything else — just as hunter-gatherers would have struggled to imagine meaning without hunting and gathering.' }]),

E('a16z-markets','State of the Markets','a16z State of the Markets','a16z','AZ','2026','2026-01-21','Read',
  ['markets','ai','investing'],'linear-gradient(180deg,#405a66,#243740)',false,[
  V('2026-01-21','1/21/26 — a16z State of Markets\n\nPublic markets:\n- Revenue is growing faster than previous tech cycles\n- Non-AI 9/10 unicorns are slowing higher\n- Homes users have 2x\'d share on platform\nPublic names:\n- 2025 performance is being driven by EPS growth, not multiple expansion\n- 300–350B vs 6000B white-collar software market\n- People model AI in terms of software spend, but white-collar payroll is 20x the size\n\n- Until the GFC, growth and fixed investment scaled together, tech changed that\n- Hyperscaler capex is ~7% of rev, ~5%?\n- Meta has substantially more capex as % of revenue\n- Average common return on ~55% higher\n- Retail participation > markets are more volatile')],
  [], [{ q:'Why is modelling AI as “software spend” the wrong frame?', a:'Because white-collar payroll is roughly 20x the size of the software market — 300–350B against a ~6000B white-collar market.', seed:true }]),

E('ai-revolution','The AI revolution is here. Will the economy survive the transition?','Will the economy survive AI?','Michael Burry; Dwarkesh Patel; Patrick McKenzie','BP','2025','2025-01-12','Read',
  ['ai','markets','investing'],'linear-gradient(180deg,#5f2f26,#381a14)',false,[
  V('2025-01-12','1/12/25 — Burry, Patel, McKenzie\n\n- ROIC will fall at these software companies as they become more capital intensive\n- Need to just compare investment w/ returns of companies printing cash with 8x multiple as they have low ROIC potential\n- Construction in progress (CIP) is another accounting term that helps depreciation of assets not in service\n  -> AI chips don\'t depreciate from use as much as they degrade from new AI chips\n- In all industries, value typically accrues to those with a durable competitive advantage — manifesting as either pricing power or an unbreachable cost or distribution advantage\n  -> This is what allows any company to achieve \'above market margins\'\n- If your competitor puts in an escalator, then so do you. Both are worse off as no durable competitive advantage is created\n- Concern around AI spending as most won\'t benefit as competitors will also benefit -> no competitive advantage\n- NVDA is holding up best with a different approach\n- Such a huge risk in scaling/hitting a wall')],
  [], [{ q:'Why does AI capex not necessarily create advantage?', a:'Because competitors get the same benefit — like installing an escalator because your competitor did. Both are worse off; no durable advantage is created.', seed:true },
       { q:'How do AI chips actually depreciate?', a:'Not much from use — they degrade because newer AI chips arrive.' }]),

E('mars','Mars Colonization','Mars Colonization','Contrary Research','CR','2025','2025-01-08','Read',
  ['space','science','frontier'],'linear-gradient(180deg,#8a4a2a,#54291a)',false,[
  V('2025-01-08','1/8/25 — Mars Colonization Space\n\n- Rich in natural resources\n- Super, super cold\n- Mars used to have rivers & oceans\n- Has water underground\n- Thickening Mars atmosphere to warm it up\n- This will pave the way for oxygen\n- Right now need to find the best place for bases\n- Optimal travel occurs once every 26 months\n- Takes about 6 months\n- It\'s super hard to get out of atmosphere\n- Much harder to slow down given thin atmosphere\n- 7 mins of terror -> takes 7 mins to land and 7 mins to communicate\n- Need to first assess how to make best use of natural resources\n- SMRs important for Mars')],
  [], [{ q:'Why is landing on Mars called “7 minutes of terror”?', a:'It takes about 7 minutes to land and 7 minutes for a signal to reach Earth — you cannot intervene. The thin atmosphere also makes slowing down much harder.' }]),

E('saas-case','Contrarian Case for SaaS','Contrarian Case for SaaS','Unknown','UN','2026','2026-03-11','Read',
  ['startups','technology','markets'],'linear-gradient(180deg,#53402c,#2e2418)',false,[
  V('2026-03-11','Contrarian Case for SaaS\n\n- First of all, coding has always been the easy part -> FB, Dropbox, Atlassian all built in days\n  -> It\'s security, compatibility, reliability, databases, etc. that are different\n- Also -> before SaaS people had internal tools for all these things and they sucked -> that\'s why we got SaaS\n- Economics are sooooo good\n- Slack has 500 eng. at 150k each; call it 75M R&D annually\n- They charge $18 per head per month\n- You have 1000 people, that\'s $220k per year\n- That\'s enough for like 1 engineer')],
  [], [{ q:'What is the contrarian defence of SaaS?', a:'Coding was never the hard part — security, compatibility, reliability and databases are. Internal tools were terrible, which is why SaaS exists, and the economics are extraordinary.' }]),

E('jevons','Jevons Paradox: The Most Important Idea in AI','Jevons Paradox','Charles Rubenfeld','CR','2025','2025-01-09','Read',
  ['ai','economics','startups'],'linear-gradient(180deg,#604832,#38291a)',false,[
  V('2025-01-09','1/9/25 — Jevons Paradox — software monads\n\nJevons Paradox = increases in efficiency in resource use leads to higher total consumption.\n\n- \'Software\' is like trains/cars/etc. → massively shifting constraints; the constraint is implementation skill, and if that falls...\n\nStartup theses:\n1) Enterprise internal tools\n   -> super compelling; still have huge frictions\n2) SaaS\n   -> weak? everyone has these tools\n   -> harder for CRM-type tools if your agent can just enable or replace them\n3) Personal software\n   -> will be huge\n4) Academic software\n   -> yes!\n\nGovernment & NGO\n- weakly due to dysfunctions\n- government will lag\n- 50–80% gov software fails\n\nControl software\n- potentially required\n- quality is king\n\nMVPs\n- technical co-founders could get more important')],
  [], [{ q:'State Jevons Paradox and its relevance to software.', a:'Efficiency gains in using a resource raise total consumption of it. In software the binding constraint is implementation skill — if that falls, demand expands rather than shrinks.', seed:true }]),

E('great-man','The Great Man Theory of Venture','Great Man Theory of Venture','Koko’s Spotlights','KS','2025','2026-03-11','Read',
  ['investing','startups','strategy'],'linear-gradient(180deg,#4a3a28,#2a2017)',false,[
  V('2026-03-11','Asset classes will converge to the same IRR.\n\nThe Great Man Theory of Venture\n\n- Holes vs. horses investor\n  -> Horses: there are a set amount of addressable business opportunities; companies eventually emerge to fill those gaps.\n  -> Horses / generational founders carve holes in the world that otherwise would not exist. (SpaceX)\n- Founder-first is inevitable in that state.')],
  [], [{ q:'What is the “holes vs horses” distinction?', a:'Horses assumes a fixed set of addressable opportunities that companies eventually fill; the alternative is that generational founders carve holes in the world that would not otherwise exist — which makes founder-first investing inevitable.' }]),

E('neil-mehta','The Visions of Neil Mehta: Greenoaks','Neil Mehta / Greenoaks','Colossus','CO','2025','2025-01-07','Read',
  ['investing','strategy','markets'],'linear-gradient(180deg,#2c4034,#18251c)',false,[
  V('2025-01-07','1.7.25 — Neil Mehta / Greenoaks\n\n- Started at D.E. Shaw -> founds Greenoaks @ 27\n- He had conviction that the internet would replace most of the S&P 500\n- One thing that makes these companies beautiful is 0 marginal costs\n- $13B & 9 investment pros\n- Lean in when others lean out\n- \'You\'re still on the helicopter\' -> get in the dirt to really understand it\n- When SVB was collapsing he backed Rippling, which had 100s of Ms in funds with the bank\n- Don\'t sell at the first sign of \'light\'\n- Do something perceived as impossible\n- Foundational moats are tough. They learn from failure -> learn to reframe, never show distress')],
  [], [{ q:'What does “you’re still on the helicopter” mean?', a:'That you haven’t got into the dirt yet. Real understanding requires going down into the detail rather than surveying from above.', seed:true }]),

E('adolescence','The Adolescence of Technology','The Adolescence of Technology','Dario Amodei','DA','2026','2026-02-02','Read',
  ['ai','policy'],'linear-gradient(180deg,#6d5a3a,#3e3421)',false,[
  V('2026-02-02','2/2/26 — Dario: The Adolescence of Tech\n\n- Anthropic does a lot of things FD?\n- These new clauses \'self dealing\' by proxy\n- Says line \'don\'t overfit\' out of system prompts')],
  [], []),

E('ellenbogen','Henry Ellenbogen: Last Human Edge','Henry Ellenbogen','Colossus','CO','2025','2025-01-05','Read',
  ['investing','markets','strategy'],'linear-gradient(180deg,#39311f,#201b11)',false,[
  V('2025-01-05','1/5/25 — Henry Ellenbogen — T. Rowe\n\n- Ran New Horizons at T. Rowe Price\n  -> $8B to $40B in 9 years\n- 100x on Netflix during inflection point\n- \'The trick was distinguishing between a company failing and a company transitioning\'\n- Key is pattern recognition with these transitions\n- Twitter was first used in Tunisia / Arab Spring to coordinate protests\n\nTraits of \'compounders\'\n1) Better as bigger -> increased returns on invested capital\n2) These are volatile: over the 10 years of 20% compounding, in one of those years they may fall 62% -> transition\n\n\'2 acts\'\n1) Demonstrated product-market fit, large TAM, poor unit economics\n2) A leap: new product, new market, something bigger')],
  [], [{ q:'What was Ellenbogen’s “trick”?', a:'Distinguishing between a company failing and a company transitioning — it is a pattern-recognition problem.', seed:true },
       { q:'What are the two traits of a compounder?', a:'It gets better as it gets bigger (rising returns on invested capital), and it is volatile — a 20%-compounding decade can still contain a 62% drawdown year.' }]),

E('garnett','Garnett Station Partners','Garnett Station Partners','Colossus','CO','2026','2026-03-11','Read',
  ['investing','markets'],'linear-gradient(180deg,#512d20,#2e1912)',false,[
  V('2026-03-11','Garnett Station Partners\n\nReasons for franchising:\n- Trillion $ TAM\n- Attractive supply/demand mismatch\n  -> Individual franchises too small for large PE\n- Margin expansion with scale\n\n- Essentially buy franchises for 3–4x, do add-ons + margin work, and sell to larger PE for 7–8x\n- Just them on IC/MM — must be unanimous\n- Fly in person, ask personal questions -> don\'t be \'the guys in suits\'\n- \'Overmatch\' -> put overly qualified folks in charge of portfolios\n- Look for highly fragmented businesses with tailwinds for them + buyers\n- Same-store sales growth driven by traffic, not pricing')],
  [], [{ q:'What is the Garnett Station playbook?', a:'Buy franchises at 3–4x in a fragmented market too small for large PE, do add-ons and margin work, and sell up to larger PE at 7–8x.' }]),

E('agent-engineer','How to be an AI agent engineer','AI agent engineering','systematicls','SL','2026','2026-03-11','Read',
  ['ai','engineering','agents'],'linear-gradient(180deg,#2e3a4c,#1b2330)',false,[
  V('2026-03-11','1. Separate research from implementation to save context.\n2. Agents tell you what you want to hear instead of what the bugs say.\n3. Use bug-finding adversarially, with references/points.\n4. Put it in claud.md / re-read the plan and relevant files after completion.\n5. Needs to investigate skills.')],
  [], [{ q:'What are the first two rules of agent engineering you noted?', a:'Separate research from implementation to save context; and remember agents tell you what you want to hear rather than what the bugs say — so use bug-finding adversarially.', seed:true }]),

E('build-letter','Annual Letter 2025: Build','Annual Letter 2025: Build','Koko’s Spotlights','KS','2025','2026-03-11','Read',
  ['investing','startups'],'linear-gradient(180deg,#44583f,#273323)',false,[
  V('2026-03-11','Narr built by Koko xs\n\n- 70\'s $30M raises total, 8 firms\n- Venture today is where PE was 20 years ago\n  - Biggest firms on cusp of IPO\n- Capital will flock and exits will happen\n  -> This will decrease IRR\n- In the end state of capitalism, all asset classes will converge to the same IRR')],
  [], [{ q:'What is the end-state claim about asset classes?', a:'That in the end state of capitalism all asset classes converge to the same IRR — venture today is where PE was twenty years ago, and inflowing capital will compress returns.' }]),

E('agi-not','Why AGI Will Not Happen','Why AGI Will Not Happen','Tim Dettmers','TD','2026','2026-03-14','Read',['ai'],'linear-gradient(180deg,#403024,#241b14)',false,[],[],[]),
E('knowledge-work','Exactly Why and How AI Will Replace Knowledge Work','AI & knowledge work','Daniel Miessler','DM','2026','2026-03-23','Read',['ai','work'],'linear-gradient(180deg,#53607a,#313a4c)',false,[],[],[]),
E('dimon','Jamie Dimon Has a Plan for JPMorgan to Rescue the American Dream','Jamie Dimon’s plan','Alexander Saeedy','AS','2026','2026-04-01','Read',['markets','policy'],'linear-gradient(180deg,#2e4634,#1b2a20)',false,[],[],[]),
E('train-or-not','To Train or Not to Train','To Train or Not to Train','Tanay Jaipuria','TJ','2026','2026-04-28','Read',['ai','markets'],'linear-gradient(180deg,#5a4a34,#332a1d)',false,[],[],[]),
E('task-not-job','The task is not the job','The task is not the job','Luis Garicano','LG','2026','2026-04-28','Read',['ai','work','economics'],'linear-gradient(180deg,#71543a,#422f20)',false,[
  V('2026-04-28','Relevant to my independent research.')],[],[]),
E('power-grid','America’s Electric Power Grid Is Broken. This Startup Is Trying to Fix It.','America’s power grid','Mario Gabriele','MG','2026','2026-03-11','Read',['energy','startups'],'linear-gradient(180deg,#8a6527,#4f3a16)',false,[],[],[]),
];

/* ─────────────── CONTENT PIPELINE (unread / queued) ─────────────── */
// Canonical unread store. Deduplicated against the read shelves above:
// anything Matthew has started or finished never appears here.
const Q = (title, author, kind, why) => ({ title, author, kind, why });
const QUEUE = [
  // Essays — reading list texted Oct 5 2026
  Q('As We May Think (1945)','Vannevar Bush','essay','Theme: Science, technology, and the future. Imagined something like hyperlinked personal knowledge machines decades early. Origin of a lot of what you\'re building with agents and your Life OS.'),
  Q('Cargo Cult Science','Richard Feynman','essay','Theme: Science, technology, and the future. His Caltech commencement address on intellectual honesty and not fooling yourself.'),
  Q('Economic Possibilities for Our Grandchildren (1930)','John Maynard Keynes','essay','Theme: Science, technology, and the future. A great economist reasoning a century forward. Grade his predictions against today, then ask what your own convictions would look like written the same way.'),
  Q('Essays ("Of Studies," "Of Ambition," "Of Great Place," "Of Cunning")','Francis Bacon','essay','Theme: Essentials. Each is a page or two of dense, almost aphoristic advice on power and ambition. They read like an operating manual for an ambitious young man in 1600.'),
  Q('Fifty Years Hence (1931)','Winston Churchill','essay','Theme: Science, technology, and the future. Predicts nuclear power, lab-grown meat, and remote communication. Conviction-style thinking from a statesman.'),
  Q('In Praise of Idleness','Bertrand Russell','essay','Theme: How to live. A brilliant, contrarian case against worshipping work. Useful precisely because it pushes against your default setting.'),
  Q('Letter to Francesco Vettori (Dec. 10, 1513)','Niccolo Machiavelli','essay','Theme: Power, politics, and strategy. Describes his days in exile and his evenings putting on formal robes to "converse" with the ancients while writing The Prince. Short and unforgettable.'),
  Q('Notes of a Native Son','James Baldwin','essay','Theme: Modern classics. One of the greatest pieces of American prose, set in the context of a father\'s death and the Harlem riot of 1943.'),
  Q('Of Experience','Michel de Montaigne','essay','Theme: Essentials. Montaigne\'s final essay, about learning from your own life rather than from authorities. Read Donald Frame\'s translation.'),
  Q('On Self-Respect','Joan Didion','essay','Theme: Modern classics. Short and piercing, about character and taking responsibility for your own life.'),
  Q('Politics and the English Language','George Orwell','essay','Theme: Power, politics, and strategy. Explains how sloppy writing enables sloppy thinking. It will make every memo and IC brief you write better.'),
  Q('Politics as a Vocation','Max Weber','essay','Theme: Power, politics, and strategy. 1917-19 lecture on what it takes to wield power responsibly. Top-tier.'),
  Q('Science as a Vocation','Max Weber','essay','Theme: Power, politics, and strategy. 1917-19 lecture on what it means to devote your life to knowledge. Top-tier.'),
  Q('Self-Reliance','Ralph Waldo Emerson','essay','Theme: How to live. The American classic on trusting your own judgment over consensus, essentially the philosophical version of non-consensus conviction.'),
  Q('That to Philosophize Is to Learn to Die','Michel de Montaigne','essay','Theme: Essentials. Montaigne essentially created the essay as a genre. This one is about facing mortality. Read Donald Frame\'s translation.'),
  Q('The Hedgehog and the Fox','Isaiah Berlin','essay','Theme: Power, politics, and strategy. The source of the famous split between people who know one big thing and people who know many things. A great lens for investors and analysts.'),
  Q('The Myth of Sisyphus (title essay)','Albert Camus','essay','Theme: Modern classics. Camus finds meaning in a pointless task, and he finds it with defiance rather than despair.'),
  Q('The Unreasonable Effectiveness of Mathematics in the Natural Sciences','Eugene Wigner','essay','Theme: Science, technology, and the future. Asks why abstract math describes the physical universe at all. Perfect given your cosmology interest.'),
  Q('The Use of Knowledge in Society','Friedrich Hayek','essay','Theme: Intelligence and judgment. Perhaps the single most important economics essay ever written. Prices aggregate dispersed knowledge no planner could gather.'),
  Q('Words of Estimative Probability','Sherman Kent','essay','Theme: Intelligence and judgment. Kent is the founding father of CIA analysis. Asks what "probable" actually means and why analysts must quantify it. Directly relevant to the Directorate of Analysis.'),
  Q('You and Your Research','Richard Hamming','essay','Theme: Science, technology, and the future. A Bell Labs legend on why some people do great work and most don\'t. Many founders and researchers reread it every year.'),
  Q('What matters in AI right now: models, distribution, and power','Stratechery','essay',''),
  // Articles
  Q('How Demis Hassabis Went From Idealist to Realist','Sebastian Mallaby','article',''),
  Q('X post from @akshay_pachaar','Akshay Pachaar','article','Save this for me to read later.'),
  Q('X post from @jayagup10','@jayagup10','article','Save this for me to read later.'),
  // Books
  Q('A Guide to Financial Markets',null,'book',''), Q('Alchemy of Finance',null,'book',''),
  Q('Antifragile',null,'book',''), Q('Beating the Street',null,'book',''),
  Q('Behavioral Investing',null,'book',''), Q('Blackbox Thinking',null,'book',''),
  Q('Common Stocks and Uncommon Profits',null,'book',''), Q('Dallio Economic Principles',null,'book',''),
  Q('Fooled by Randomness','Nassim Nicholas Taleb','book',''), Q('Left of Bang',null,'book',''),
  Q('Margin of Safety',null,'book',''), Q('One Up on Wall Street',null,'book',''),
  Q('Poor Charlie\'s Almanack',null,'book',''), Q('Random Walk Down Wall Street',null,'book',''),
  Q('Security Analysis',null,'book',''), Q('Speculative Contagion',null,'book',''),
  Q('Spy to lie',null,'book',''), Q('Technological Revolutions and Financial Capital',null,'book',''),
  Q('The Battle of Investment Survival',null,'book',''), Q('The Blind Watchmaker',null,'book',''),
  Q('The Davis Dynasty',null,'book',''), Q('The Gift of Fear (1997)',null,'book',''),
  Q('The Intelligent Investor',null,'book',''), Q('The Mind of Wall Street',null,'book',''),
  Q('The Outsiders - Will Thorndike','Will Thorndike','book',''), Q('The Tyranny of the Meritocracy',null,'book',''),
  Q('Thinking, Fast and Slow',null,'book',''), Q('Warren Buffett Shareholder Letters',null,'book',''),
  // in the Book Reading Log as To Read, not yet in the Pipeline
  Q('The Art of War by Sun Tzu',null,'book',''), Q('Chip War by Chris Miller',null,'book',''),
  Q('Competition Demystified',null,'book',''),
];

const QSPINE = { book:'linear-gradient(180deg,#4a3a28,#2a2017)', essay:'linear-gradient(180deg,#53607a,#333b4c)', article:'linear-gradient(180deg,#5a4a34,#332a1d)' };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,28);
const initials = s => (s || '').split(/\s+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase() || '—';

const QUEUED = QUEUE.map(q => ({
  id: 'q-' + slug(q.title), type: q.kind === 'book' ? 'qbook' : 'qessay', title: q.title,
  short: q.title.length > 32 ? q.title.slice(0, 30) + '…' : q.title,
  author: q.author || 'Unattributed', mono: initials(q.author || q.title),
  pub: '', consumed: '', status: 'Queued', queuedAs: q.kind,
  tags: ['queued', q.kind], spine: QSPINE[q.kind], dark: false,
  notes: q.why ? [{ d: '2026-10-08', t: q.why }] : [], quotes: [], cards: [],
}));

/* ──────────────────────────── WORKS ──────────────────────────── */
const mk = (o, type) => ({
  id:o.id, type, title:o.title, short:o.short, author:o.author, mono:o.mono,
  pub:o.pub, consumed:o.consumed, status:o.status, tags:o.tags,
  spine:o.spine, dark:!!o.dark,
  cover:'radial-gradient(circle at 70% 22%, rgba(255,222,150,.28), transparent 45%), ' + o.spine,
  notes:o.notes, quotes:o.quotes, cards:o.cards,
});
const WORKS = [...BOOKS.map(b => mk(b,'book')), ...ESSAYS.map(e => mk(e,'essay')), ...QUEUED];

/* ───────────────────────── REFLECTIONS ───────────────────────── */
// Convictions (numbered, themed, each pointing back to its source) and the
// Misc. thought log (his exact words, with the take that was written alongside).
const C = (date, source, quote, text) => ({ date, source, quote, text });
const SEN = 'Convictions · IV. Personal Philosophy — Seneca, On the Shortness of Life';
const REFLECTIONS = [
  C('2026-10-08', SEN, '9. Prioritize the development of my mind', 'My priority should always be the development of my mind.'),
  C('2026-10-08', SEN, '10. Life has no inherent meaning', 'Life has no inherent meaning; part of being human is constructing meaning from nothing.'),
  C('2026-10-08', SEN, '11. Find joy and balance, then commit', 'It is worthwhile to find something that brings me joy and balance and commit myself to it, rather than spend life doing things I find meaningless.'),
  C('2026-10-08', SEN, '12. Keep my mind in the present', 'Keep my mind fully on the present; pull it back when it wanders to the past or future.'),
  C('2026-10-08', SEN, '13. Value is imagined, not intrinsic', 'Beyond biology, nothing is truly meaningful unless we deem it so. Humans can imagine value in things that are not intrinsically valuable, and this is okay because nothing is intrinsically valuable.'),
  C('2026-08-01', 'Convictions · I. AI Economics', '1. Model choice becomes a deliberate price/performance decision', 'People and enterprises will become far more aware of the AI models they are using and will start actively optimizing for price versus performance. The result is a mixed stack: open-source models for commodity workloads, frontier models where the marginal quality matters, and specialized models built for specific industries. Nobody runs a single-model strategy at scale.'),
  C('2026-08-01', 'Convictions · I. AI Economics', '2. Education becomes personalized tutoring at scale', 'One-on-one adaptive instruction, historically a luxury, becomes the default for anyone with a device. Credentialing and assessment will lag badly behind the delivery of learning, creating a gap someone will fill.'),
  C('2026-08-01', 'Convictions · II. Frontier Technology', '3. Space is the next frontier', 'Strong belief in space travel, space infrastructure, and everything downstream of it. Everything that can be in space theoretically will eventually be in space.'),
  C('2026-08-01', 'Convictions · II. Frontier Technology', '4. Robotics and physical-world AI are the next wave', 'AI moves out of the screen and into the physical world — this is the next major wave after language models. Open question: not confident this proceeds from single-purpose robots to general-purpose robots; the wave may be won by many specialized systems rather than one general platform.'),
  C('2026-08-01', 'Convictions · II. Frontier Technology', '5. Materials science becomes a software problem', 'AI-driven discovery of batteries, catalysts, alloys, and semiconductors compresses R&D cycles from decades to years. Materials becomes a venture-scale category again.'),
  C('2026-08-01', 'Convictions · II. Frontier Technology', '7. Memory and chip packaging unlock on-device computing', 'The advancements in memory and chip packaging will allow for significantly stronger on device computing.'),
  C('2026-08-01', 'Convictions · III. Human Flourishing', '6. Medicine gets more specialized and more research-driven', 'There will be more and more medications and supplements driven by cutting-edge research and specialized, personalized medicine. Treatment becomes narrower and better targeted.'),
  C('2026-08-01', 'Convictions · III. Human Flourishing', '7. Longevity becomes a real market (strong conviction)', 'Aging gets treated as an addressable condition. Diagnostics, monitoring, and preventive intervention become a mainstream consumer spend category — first among affluent buyers, then broadening.'),
  C('2026-08-01', 'Convictions · III. Human Flourishing', '8. Less work time drives more in-person experiences', 'As automation absorbs more of the workday, humans will have more time for things other than work. That time flows disproportionately into physical, in-person experiences — the scarce, un-synthesizable stuff.'),
];

const MISC = [
['2026-03-13','When lagging AI labs pivot to jobs rhetoric','It’s kind of funny how whenever an AI lab is falling behind (OpenAI or Anthropic) the CEO starts talking about economic impact and jobs to slow progress','Stan’s take: there is probably something real here. Economic-impact rhetoric often rises when competitive positioning weakens, because labor concerns are both socially legible and politically useful. The sharper question is whether the same leader was making the same argument with the same intensity when their lab was ahead.'],
['2026-03-13','Anthropic’s revenue velocity versus giant tech companies','Anthropic did more revenue (6 bn) in the month of Feb alone than Databricks and Snowflake do in a year. They’ll do more revenue in 4-6 months than SpaceX does in a year','Stan’s take: even if the exact number ends up being run-rate, bookings, or otherwise massaged, the underlying intuition is strong. The striking part is the revenue velocity: frontier AI labs may be scaling into giant businesses faster than traditional software and even iconic private tech companies.'],
['2026-03-30','Chess vs poker as a personality signal','Whether someone is a Chess or Poker player tells a lot about them. Poker is dealing with information asymmetry. You can bluff, dodge, hide behind your ability to lie and make high probability bets. Chess is different. There are no secrets. It’s pure intellectual horsepower up against each other','This is a sharp distinction between opaque, probabilistic competition and transparent, legible competition. It reads less like a game preference and more like a worldview test: do you admire clean truth-discovery or strategic ambiguity?'],
['2026-04-02','Apple’s Manufacturing Boomerang','It\'s super interesting how Apple\'s manufacturing strategy came from Japan, we perfected it in the US through a bunch of companies, then re-exported it to Asia today.','The operational knowledge travelled Japan → U.S. → back to Asia, but the value capture stayed overwhelmingly American. It is a case study in how intellectual capital and operational architecture matter more than where the factory sits.'],
['2026-04-02','Agentic Market Decision-Making','I should set up investment agents that understand the set of decisions to be made in a market in a given day, and make calls on each one','Decompose a trading day into a structured decision tree — earnings reactions, macro releases, sector rotations, breakouts, options expiry — and give each node its own agent with a mandate and risk envelope. Closer to how a multi-PM pod shop operates, except the PMs are agents.'],
['2026-04-03','Get Into Space Next','find the coolest stations doing space stuff. Space is next and I need to get in on it','The new space economy is not just launch: orbital infrastructure, in-space manufacturing, Earth observation, satellite comms and eventually resource extraction. Cost-to-orbit was the Schwerpunkt; SpaceX broke it, so every downstream application becomes viable.'],
['2026-04-05','Robotics & Space: Next Breakthroughs','I believe very strongly that robotics and space economy are the early innings of the next great technical breakthroughs','Both share the structural setup that defined the early internet and cloud: plummeting unit economics, expanding TAM, and network effects that compound once critical mass is reached.'],
['2026-04-14','Domain Expertise vs. Process Articulation','humans don\'t think algorithmically. If you asked a human to make a simple flow chart of what they do, many would fail. I think domain expertise isn\'t really a moat in AI. Relationships are a moat and being able to express processes can make you a superhero','Most human knowledge is tacit and procedural, so knowing things is a depreciating asset. The scarce skill becomes translation — turning fuzzy workflows into structured processes an AI can execute. Relationships stay durable because they are trust-based and contextual.'],
['2026-04-14','Steep Up Rounds = Undervalued','Peter Thiel said the steeper the up round the more undervalued it is. This is because people have a need to anchor on the past (prior round). Interesting take','If fundamentals improved dramatically between rounds, investors still anchor on the last price — so even a 3–5x step-up may understate value creation. A steep markup is a signal to dig deeper, not a red flag.'],
['2026-05-04','Autonomous logistics container idea','Autonomous vehicles won’t replace truck drivers as someone needs to protect the cargo (many carry weapons), rearrange inside, etc. what if I made an actual truck container to go on autonomous vehicles that solve these problems with security, AI, robotics, etc. could do this for a lot of industries','Reframes the bottleneck as the payload environment rather than the driver: security, cargo handling, reconfiguration and exception management. A picks-and-shovels layer for autonomous logistics — a smart modular container rather than a vehicle company.'],
['2026-05-07','Drone food delivery business idea','Random idea — restaurants should be able to just load up food onto drones and send to locations. Could build the business','Clean wedge if framed as logistics infrastructure rather than restaurant tech. The question is whether the business is the drone network, the loading hardware and software, or a managed service for dense campuses and events.'],
['2026-05-09','Review Violet Quaker Group biannual report','Review the Violet Quaker Group biannual report.','Worth revisiting in synthesis mode or when looking for differentiated niche market observations, investor letters, or operator signals.'],
['2026-05-11','LEO satellites and offshore infrastructure idea','Random thought — a huge challenge for low earth orbit satellites is that they are usually over water. So thus they’re wasting potential? They try to connect to boats and stuff. What if we put for meaningful things in the middle of the ocean?','An infrastructure inversion: instead of treating oceans as dead zones beneath LEO coverage, treat them as deployment surfaces for assets that benefit from persistent satellite visibility.'],
['2026-05-16','Proximity-based dating app idea','Idea: a dating app that can tell who you walk by and allow you to see them and get their number','Strong consumer hook because it targets real-world serendipity rather than endless swiping. The wedge is probably an opt-in proximity network for specific contexts — campuses, events, nightlife — rather than a universal passively identifying app.'],
['2026-06-08','Check out Semafor recommendation from Ty','Semafor news site recommended by Ty','A pointer to a potentially high-signal information source worth sampling and evaluating for repeat use.'],
['2026-09-09','AI and the long tail of disease','What AI will do to medicine / health is address the long tail of diseases that currently don’t make sense for us to address due to the small amount of patients','AI could change the economics of rare-disease research by lowering the cost of diagnosis, biological modeling, trial design and personalized treatment. The open question is where discovery cost is the binding constraint versus trials, regulation and reimbursement.'],
].map(([date, name, thought, take]) => C(date, 'Misc. · ' + name, thought, take));

const ALL_REFLECTIONS = [...REFLECTIONS, ...MISC];

/* ─────────────────────────── tags ─────────────────────────── */
const ALL_TAGS = [...new Set(WORKS.flatMap(w => w.tags))].sort();

/* ─────────────────────── emit src/data.js ─────────────────────── */
const header = `// The Geiling Library — content translated from Matthew's Notion Knowledge Base.
//
//   Book Reading Log      -> type 'book'   (Read / Reading)
//   Article Reading Log   -> type 'essay'  (essays and articles combined)
//   Content Pipeline Log  -> type 'queued' (unread; never duplicated with the above)
//   Convictions + Misc.   -> REFLECTIONS   (each carries its source and date)
//
// Notes keep Matthew's exact words in \`t\`, typos included; the tightened
// companion sits alongside in \`tight\` and never replaces the original.
// Regenerate with scratchpad/gen-data.js rather than hand-editing in bulk.

var DAY = 86400e3;
`;

const out = header +
  '\nvar TRANSCRIPT = ' + JSON.stringify(TRANSCRIPT_PLACEHOLDER(), null, 1) + ';\n' +
  '\nvar WRITINGS = ' + JSON.stringify(WRITINGS_PLACEHOLDER(), null, 1) + ';\n' +
  '\nvar TROPHIES = ' + JSON.stringify(TROPHIES_PLACEHOLDER(), null, 1) + ';\n' +
  '\nvar ARTDECOR = ' + JSON.stringify(ARTDECOR_PLACEHOLDER(), null, 1) + ';\n' +
  '\nvar FUTURE_EXHIBITS = ' + JSON.stringify(FUTURE_PLACEHOLDER(), null, 1) + ';\n' +
  '\nvar WORKS = ' + JSON.stringify(WORKS, null, 1) + ';\n' +
  '\nvar REFLECTIONS = ' + JSON.stringify(ALL_REFLECTIONS, null, 1) + ';\n' +
  '\nvar ALL_TAGS = ' + JSON.stringify(ALL_TAGS) + ';\n' +
  '\nexport { TRANSCRIPT, WRITINGS, TROPHIES, ARTDECOR, FUTURE_EXHIBITS, WORKS, REFLECTIONS, ALL_TAGS };\n';

// the non-Notion exhibits are carried over unchanged from the existing file
function carry(name) {
  const src = fs.readFileSync(process.argv[2], 'utf8');
  const m = src.match(new RegExp('var ' + name + ' = ([\\s\\S]*?);\\n\\n'));
  if (!m) throw new Error('could not carry ' + name);
  return m[1];
}
function TRANSCRIPT_PLACEHOLDER(){ return null; }
function WRITINGS_PLACEHOLDER(){ return null; }
function TROPHIES_PLACEHOLDER(){ return null; }
function ARTDECOR_PLACEHOLDER(){ return null; }
function FUTURE_PLACEHOLDER(){ return null; }

let final = out;
for (const n of ['TRANSCRIPT','WRITINGS','TROPHIES','ARTDECOR','FUTURE_EXHIBITS']) {
  final = final.replace('var ' + n + ' = null;', 'var ' + n + ' = ' + carry(n) + ';');
}
fs.writeFileSync(process.argv[3], final);
console.log('works:', WORKS.length,
            '(books', BOOKS.length, '/ essays', ESSAYS.length, '/ queued', QUEUED.length + ')',
            '| reflections:', ALL_REFLECTIONS.length, '| tags:', ALL_TAGS.length);
