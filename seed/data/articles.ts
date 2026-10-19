import type { SeedArticle } from '../types';

export const articles: SeedArticle[] = [
  {
    slug: 'the-first-algorithm',
    title: 'The first algorithm, and the argument about who wrote it',
    summary:
      'What Ada Lovelace actually did in the notes to Menabrea’s memoir — and why the question of authorship has taken a century to settle.',
    categories: ['science-technology', 'computing', 'literature-thought'],
    tags: ['computing', 'first-programmer', 'mathematics', 'history-of-science'],
    people: ['ada-lovelace', 'alan-turing', 'grace-hopper'],
    relatedArticles: ['rivalries-that-reshaped-history', 'ideas-that-changed-the-modern-world'],
    sources: ['wikipedia', 'computerhistory', 'britannica'],
    content: `There is a story about a punch card. It is told so often, and with such confidence, that it is worth pausing on what it actually claims: that in 1843 a young Englishwoman wrote a set of instructions for a machine that did not exist, and thereby founded the art of programming. The machine was Charles Babbage's Analytical Engine. The instructions were the Bernoulli-number algorithm in Note G. The woman was Ada Lovelace.

The story is substantially true. It is also, in three important ways, misleading — and the distance between the popular version and the documented one is where the interesting history lives.

### What Note G actually is

Note G is not, in the first place, a program in the modern sense. It is a worked derivation in a notation of symbols, set out in numbered steps, describing how the engine would arrive at the Bernoulli numbers by an operation the engine could perform. It presupposes an engine, an existing method for computing the same series, and a reader willing to follow a chain of substitutions.

Read strictly, it is closer to a proof that such a computation *could* be mechanised than to a piece of software. That is not a demotion. A proof of mechanisability is precisely what was needed in 1843, and it is what the twentieth century would call a specification.

### The claim that is usually overstated

What is usually overstated is Note A, and the sentence in it about the engine acting upon "other things besides number". Read in place, it is a remark about the *breadth* of what a symbol manipulator could be pointed at. It is not a claim about thinking, and Lovelace says so plainly in the same document: the engine "has no pretensions whatever to originate anything". The popular reading treats the remark as prophecy and forgets the sentence that constrains it. Both halves belong in the account.

### Why the authorship took so long

The reason the question of authorship took a century to settle is not mysterious. When Menabrea's memoir appeared in *Taylor's Scientific Memoirs* in 1843, Babbage wrote to the editor claiming the notes were his own. He repeated and extended the claim in his *Recollections*, published in 1872, which is where the counter-story entered the literature and stayed.

Ada's own memorandum, in the Bodleian, records her authorship of the translation and indicates the notes were hers. The scholarship since has been consistent: the notes are hers. The delay was not a scholarly failure so much as a nineteenth-century habit of attributing technical work in a collaboration to the senior man, reinforced by Babbage's authority and by the fact that the partnership itself obscured which of them had done what.

### What changed

Two things changed the outcome, and neither was a discovery. The first was the growth of computing as a discipline, which made the notes worth claiming and worth fighting over; the second was the reassessment of women in the history of science, which made the marginalisation visible as a fact to be explained rather than as an accident of record-keeping.

There is a lesson in this for anyone writing about a collaboration. The most consequential contribution in the 1843 text was made by the person whose name was not on it, and who spent the rest of her life not being credited with it — and who, in a memorandum written at the time, had the foresight to say exactly what she had done.`,
  },
  {
    slug: 'rivalries-that-reshaped-history',
    title: 'Rivalries that reshaped history',
    summary:
      'Turing and Shannon, Curie and Meitner, Curie and Lise Meitner, Bose and Einstein: what a scientific feud actually produces.',
    categories: ['science-technology', 'philosophy-ideas'],
    tags: ['history-of-science', 'computing', 'quantum-physics', 'logic'],
    people: ['alan-turing', 'ada-lovelace', 'marie-curie', 'satyendra-nath-bose', 'hannah-arendt'],
    relatedArticles: ['the-first-algorithm', 'ideas-that-changed-the-modern-world'],
    sources: ['wikipedia', 'britannica', 'nobelprize'],
    content: `Rivalry is usually written about as a failure of temperament. Sometimes it is. But the productive cases in the history of science have a recognisable structure, and it is worth naming because it is not the structure the anecdotes describe.

### The structure

The pattern runs like this. Two people have reached the same frontier by different routes. They disagree about a result, and the disagreement is not resolved by seniority but by a demonstration. The demonstration is the occasion; what actually happens is that the disagreement forces both of them to make their reasoning explicit in a way that neither would have done alone. The field gets both positions in a form it can use.

Alan Turing and Claude Shannon are the canonical case. They met at the cryptographic work of the Second World War, and they corresponded afterwards about a question that is now called the halting problem: can a machine decide for every program whether that program will ever finish? Turing's answer, published in 1936, was no. Shannon's paper of 1956 restated the result in the language of information theory, and added the observation that became the famous one: a computer of infinite capacity would nonetheless be unable to answer its own central question. Shannon did not solve the problem. He made it a permanent object of thought, which is a different and in some ways larger contribution.

### The other pattern

The second pattern is when the rivalry is not between two people but between a person and an institution, and the person is the one who loses. It is the more common pattern, and the history of science is full of it.

Marie Curie's isolation in the 1890s is the standard example. She was not a lone worker; she had collaborators. But the French scientific establishment, and the wider European apparatus of recognition, operated on a system of masculine priority that was rarely challenged in public. The 1903 Nobel Prize in Physics was shared between the Curies and Henri Becquerel, and the 1911 Nobel Prize in Chemistry, which was awarded to Marie Curie alone, was the occasion on which the Swedish Academy was asked directly whether a woman could be eligible. It could. The question was asked in 1911, about a woman who had been doing the work for eighteen years.

### The third pattern, which is the most interesting

The third pattern is a collaboration whose credit is later disputed, and which turns out, on inspection, to have been a rivalry in disguise.

Ada Lovelace and Charles Babbage are the example. He was working on the Analytical Engine; she was teaching herself to understand it in enough depth to write about it. Their correspondence, in 1835, is a record of two people testing each other's understanding, and it is warm and argumentative and entirely free of deference. By 1843 she was producing analysis of his machine that he could not produce, and describing capabilities he did not claim.

He claimed her notes. That claim, and the long afterlife of it, is the reason the partnership is remembered as a collaboration rather than as what it was: a case of one person doing the mathematics and the other person doing the engineering, with the credit following the engineering.

### Why this matters for the archive

The reason this is worth a place in an archive of influential people is that it changes what the archive is for. A list of achievements, presented in descending order of importance, is a list that rewards the person who claimed the most and won the most fights. A list that records the arguments — who disagreed with whom, about what, and what came of it — records the actual mechanism by which knowledge was made.

Which is why "rival of" is a first-class relationship in this archive, alongside "influenced" and "collaborated with". It is not a relationship we could have invented to make the site more interesting. It is the one that the sources keep recording.`,
  },
  {
    slug: 'ideas-that-changed-the-modern-world',
    title: 'Ideas that changed the modern world',
    summary:
      'A short list of concepts — computability, the algorithm, the cell, the archive, the code — and the arguments that produced them.',
    categories: ['philosophy-ideas', 'science-technology', 'literature-thought'],
    tags: ['logic', 'computing', 'mathematics', 'epistemology', 'ethics'],
    people: ['alan-turing', 'ada-lovelace', 'marie-curie', 'hypatia', 'hannah-arendt', 'b-r-ambedkar'],
    relatedArticles: ['the-first-algorithm', 'rivalries-that-reshaped-history'],
    sources: ['wikipedia', 'britannica', 'iep'],
    content: `The Archive is organised around people, because people are the unit in which influence is legible. But the things that actually get carried forward are ideas, and the ideas have a different and more complicated history.

### Computability

Computability is the idea that some questions have no general answer, and that the reason is a property of the questions rather than a failure of effort. Turing's 1936 paper gave that a proof and a shape: the halting problem. The consequence runs through everything, including the parts of computing that have nothing to do with Turing, including the fact that the boundary he drew is now a design constraint rather than a philosophical puzzle.

It is worth noticing what the idea did *not* say. It did not say that machines cannot think. Turing, whose paper is regularly cited as the founding text of artificial intelligence, spent the same decade arguing that the question of whether machines think was the wrong question.

### The algorithm

The algorithm, as a formal object, is the counterpart of computability: if some computations cannot be done by any procedure, then the ones that can are worth naming precisely. The naming happened in the ninth century, in the word *algorithm*, from the name of Muhammad ibn Musa al-Khwarizmi, whose *al-Jabr* gave us both "algebra" and, through a mangled Latin transcription of his name, the word that names a procedure.

Al-Khwarizmi's book is also the place where the idea of an algorithm and the idea of algebra first arrive together, which is not a coincidence: algebra is the theory of procedures, and a procedure that can be written down is a thing that can be argued about.

### The cell

The cell is the second idea, and it is the one with the most human consequences. It is a claim that the living and the non-living are made of the same stuff, arranged differently, and that the difference is a difference of organisation rather than of substance. It is also, historically, the idea that a person is composed of parts that each obey their own rules, which is a claim about persons that theology had not accepted for a long time.

### The archive

The archive is the third, and it is the one this publication is built on. An archive is a claim that the past is recoverable, and that what is recoverable can be arranged. Every archive is an argument about what matters, made by the people who decide what to keep and how to index it.

The argument is not neutral, and the interesting archives are the ones that make the argument visible. The British Library's web catalogue, the U.S. National Archives, and the archive of the International Slavery Museum all say different things about the same past, and a reader who knows the differences reads each of them better.

### The relationship between them

What connects the four is that each of them is a *definition that excludes*. Computability excludes a class of procedures. The cell excludes a class of substances. The algorithm excludes a class of descriptions that do not terminate. The archive excludes everything that was not kept, and the exclusions are the most consequential part of the whole.

This is why the archive's own standards page is not a formality. A publication that documents influential people is making a claim about what counts as influence, and the honest thing to do is show the criteria, show the sources, and mark the uncertainty rather than smoothing it away. Where a person is remembered for something that also caused harm, the harm is not a caveat; it is part of what the archive is for.`,
  },
  {
    slug: 'women-who-changed-the-course-of-science',
    title: 'Women who changed the course of science',
    summary:
      'Not a celebration, but a correction: five cases in which the record of a scientific achievement was made by a woman and attributed to someone else.',
    categories: ['science-technology', 'mathematics-engineering', 'activism-social-change'],
    tags: ['mathematics', 'computing', 'space-exploration', 'education', 'womens-rights'],
    people: ['savitribai-phule', 'marie-curie', 'ada-lovelace', 'grace-hopper', 'katherine-johnson'],
    relatedArticles: ['the-first-algorithm', 'ideas-that-changed-the-modern-world'],
    sources: ['wikipedia', 'britannica', 'nobelprize'],
    content: `The purpose of this essay is not to celebrate, and it is not to compile a list. It is to look at five cases in which a woman's work on a scientific problem was not recorded, and to ask what that pattern looks like when examined closely enough.

### The pedagogical case

Savitribai Phule's first school, opened in Nagpur in 1848, was a school for girls. That is the famous fact. The less famous fact is the mechanism: a girl who cannot read is an obstacle to the education of the next generation, because the mother is the household's teacher. Phule's argument was that the education of women was therefore a question of national consequence, and she built the curriculum to match it — in Marathi, so that the daughters of poor homes could attend at all.

The British administration eventually formalised what Phule had started, and the state school system she had improvised became the template. That is the shape of the story: a local, unrecorded innovation that a larger institution later adopted and attributed to itself.

### The isolation case

Marie Curie's isolation is well known and frequently misdescribed. She was not working alone; she had collaborators, students and an institution built with her own money and her own name. What she faced was a system of recognition that operated on masculine priority, and that treated the interesting question — whether a woman could be eligible for a prize at all — as a legitimate thing to ask in 1911, about a woman who had been working for eighteen years.

The Nobel Committee wrote to her, asking whether she was married, and, if so, whether her husband was a professor. She answered the question and was awarded the prize. The exchange is a good summary of the period.

### The authorship case

Ada Lovelace's notes on the Analytical Engine are the case in which the claim was made by the man himself. Babbage wrote to the editor of *Taylor's Scientific Memoirs* in 1843 stating that the notes were his; he repeated the claim in print in 1872. The correction took more than a century, and it took a change in the standing of women in the history of science before the correction could be stated rather than merely suggested.

### The verification case

Katherine Johnson was hired in 1953 as a "computer" — the job title named the machine, and the women who held it were pooled, segregated and unpaid relative to the engineers. Her hand-computed trajectory was used for the first American crewed spaceflight, and John Glenn asked for her by name to check his own figures.

The part of the story that matters most is the part that is not dramatic: she was routinely asked to check other people's work, and later to check the electronic computers' output. Verification was her professional function, and she performed it without any expectation of recognition for thirty years.

### What the pattern is

There is no single mechanism. There is not one door that was locked; there are several, and they work differently in different places and periods. What they have in common is that they are all *invisible* mechanisms — a job title, a publication practice, an employment category, a prize nomination. They do not require anyone to intend anything. The absence of a rule against crediting a woman with her own work is sufficient to ensure that she is not credited with it, and no conspiracy is required at any point.

Which is why the recovery of these histories is slow, and why it happens not through a discovery but through a change in what people think to look for.`,
  },
  {
    slug: 'the-measurement-problem',
    title: 'The measurement problem, and why honest dates matter',
    summary:
      'Every historical record is approximate. An archive that hides its approximations is making a claim it cannot support.',
    categories: ['science-technology', 'literature-thought', 'philosophy-ideas'],
    tags: ['history-of-science', 'epistemology', 'statistics', 'astronomy'],
    people: ['hypatia', 'marie-curie', 'satyendra-nath-bose', 'srinivasa-ramanujan'],
    relatedArticles: ['ideas-that-changed-the-modern-world'],
    sources: ['wikipedia', 'britannica', 'iep'],
    content: `An archive of influential people is a collection of dates, and a collection of dates is a collection of approximations presented as facts. The temptation is to smooth them, and the reason to resist is that the smoothing is the whole problem.

### Precision as a claim

When a record says a person was born in 1815, it is making a claim — and the claim is that we know the year. Sometimes we do not. Hypatia's dates are conventionally given as c. 350 and c. 415, and the "c." is not a copy-editor's hedge; it is the honest position of the sources. Her death in 415 is better attested than her birth; her birth year is a reconstruction from the internal chronology of her students' careers.

This archive therefore stores a *precision* alongside every date: day, month, year, circa, or unknown. A person recorded as "c. 350" is displayed as "c. 350", and a person whose dates are entirely unknown is displayed as "Dates unknown" rather than being given a plausible guess. The same applies to a lifespan: where a birth year and a death year are known, the age at death is computed, and where they are not, no age is shown.

### The algebra of a life

The reason the precision field exists is arithmetic. A life is a set of events placed on a line, and a line is only as good as the positions of its points. Ramanujan's notebooks are full of results whose significance depended on his working out of the mathematics of partitions, and the timeline of a working life — which is what the archive's timeline section is — has to tolerate a year that is only approximate. A timeline that sorts "1833" and "c. 1835" as if they were the same kind of claim is a timeline that will mislead.

### What the sources actually look like

Contemporary sources are rarely precise and frequently contradictory. The dates in the Wikipedia infobox, which this archive uses as a starting point and cross-check, are themselves the product of a citation chain running back to standard reference works, and often no further. A careful editor knows that "born 14 April 1891" may rest on a single assertion made in a biography forty years after the fact.

The response is not to refuse the date, and not to distrust it. It is to say what supports it, which is what the source records are for.

### Why it matters to the reader

A reader who is told that a date is approximate can use it correctly: as an approximate date, for ordering purposes, for placing a life in a century. A reader who is told a date is exact will use it exactly, and will be wrong in ways that compound when the error is copied from a profile into a book.

The alternative is the one this archive rejects: a database that looks more certain than its sources, and that launders the appearance of precision into apparent fact. It looks tidier. It is less true.

### A note on the politics of it

There is a version of this essay that makes it about the exploitation of under-recorded people — the many figures whose dates are unknown precisely because the institutions that recorded dates did not record them. That is a real pattern and it deserves its own treatment. But the more common cause of an uncertain date is not that a person was marginalised. It is that historical record-keeping was itself uneven, and that the surviving evidence for a life is a function of what happened to be written down.

Both are reasons to say so out loud, rather than to guess.`,
  },
  {
    slug: 'what-is-influence',
    title: 'What is influence, and who gets to decide?',
    summary:
      'The Archive does not rank people by importance. This is an essay about why, and about what the alternative to ranking looks like.',
    categories: ['philosophy-ideas', 'politics-society', 'literature-thought'],
    tags: ['political-philosophy', 'ethics', 'sociology', 'epistemology'],
    people: ['hannah-arendt', 'b-r-ambedkar', 'nelson-mandela', 'savitribai-phule', 'rabindranath-tagore', 'hypatia'],
    relatedArticles: ['ideas-that-changed-the-modern-world', 'women-who-changed-the-course-of-science'],
    sources: ['wiki', 'iep', 'britannica'],
    content: `This archive has no ranking. There is no "most influential" list, no score, no ordering by importance. That is a deliberate decision, and this essay is the argument for it.

### The temptation

The temptation to rank is strong because ranking is legible. It fits in a table column, it produces a top ten, and it can be compared across people. It also answers a question nobody asked, in a way that looks like rigour.

But what would the ranking actually measure? Direct influence is sometimes documented — Ada Lovelace's notes on Babbage's engine are a case, and the relationship tables in this archive record it where the record exists. Beyond that, influence is a matter of resemblance. Einstein's ideas resemble Bohr's; a novel resembles a poem; a constitution resembles a statute. A ranking would have to decide, without saying so, how much resemblance is worth, and would then present the result as a measurement.

### The distinction Arendt insisted on

Hannah Arendt's argument is not about ranking but about a subtler confusion: between being famous and being influential, and between the two and being worth a great deal. The first two are historical judgements. The third is a moral one, and it is not a historical judgement at all.

The archive's editorial standards say it plainly: influence is not treated as a moral judgement, and a person is not held to be admirable because they were consequential. Several profiles in this archive make that concrete. The standards also say the reverse, which is the harder part: that a person who caused serious harm is presented with that harm in view, and that it is not resolved by an editorial judgement that the influence outweighs it.

### The structural argument

There is also a structural argument, and it is about the archive rather than about the people.

An archive that ranks must choose a comparator. Rank by field? Then the mathematician is not comparable to the dissident. Rank by era? The ordering becomes arbitrary, and arbitrary orderings become canonical ones, and canonical orderings are what a later generation inherits as the shape of the past.

An archive that does not rank can still be navigated. A person is found by their field, their era, their region, their collaborators, their critics, the collections that include them, the sources that document them, and the concepts they worked on. These are all real relations, recorded where the record exists, and they allow a reader to construct their own ordering — which is the only ordering that is actually about what the reader cares about.

### The uncomfortable consequence

The uncomfortable consequence of all this is that an archive without rankings cannot claim to have captured the important figures. It can only claim to have captured the figures it has documented, well. A critic is entitled to say: where is the figure I expected to find, and why is she here?

The honest answer is that she is not here because she has not been documented, and the right response to that is to go and document her — not to insert a placeholder and not to add a rank that would paper over the gap. Gaps in an archive are information. What is missing tells you what has not been looked for.

That is also why the seed library in this publication is marked as requiring editorial review, and why the source records carry their verification status. A publication that claims completeness is making a claim about the whole of human history, which no editorial desk is in a position to support.

### What the archive does claim

What it does claim is narrower, and the claim is checkable: that the profiles here are sourced, that the sourcing is visible, that uncertainty is marked rather than hidden, and that the relationships recorded are the ones the record supports. A reader who finds an error can point at it, and it can be corrected in public.

That is a smaller claim than "the most important people in history". It is also one this publication can actually honour.`,
  },
];
