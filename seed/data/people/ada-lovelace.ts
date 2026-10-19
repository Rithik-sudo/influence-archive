import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Ada Lovelace — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Ada_Lovelace',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Ada Lovelace — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Ada-Lovelace',
    type: 'biography',
  },
  {
    key: 'chm',
    title: 'Ada Lovelace — Computer History Museum',
    publisher: 'Computer History Museum',
    url: 'https://www.computerhistory.org/babbage/',
    type: 'archive',
  },
  {
    key: 'mathshistory',
    title: 'Ada Lovelace — MacTutor History of Mathematics Archive',
    publisher: 'University of St Andrews',
    url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/',
    type: 'archive',
  },
  {
    key: 'stanford',
    title: 'Ada Lovelace — Analytical Engine, Computer History Museum',
    publisher: 'Computer History Museum',
    url: 'https://www.computerhistory.org/collections/catalog/102726521',
    type: 'archive',
  },
];

export const adaLovelace: SeedPerson = {
  slug: 'ada-lovelace',
  fullName: 'Ada Lovelace',
  alternateNames: [
    'Augusta Ada King, Countess of Lovelace',
    'Augusta Ada Byron',
    'Ada King',
  ],
  birthDate: '1815-12-10',
  birthPrecision: 'day',
  deathDate: '1852-11-27',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Mathematician', 'Writer', 'Translator'],
  nationality: 'British',
  origin: { name: 'London', country: 'United Kingdom' },
  featured: true,
  wikipedia: 'Ada Lovelace',
  summary:
    'The English mathematician who translated Charles Babbage’s description of the Analytical Engine and, in the notes she added to it, wrote the first algorithm intended to be carried out by a machine.',
  whyItMatters:
    'Ada Lovelace saw that a machine which could carry out arithmetic might also work on any symbols whose relations could be expressed — music, logic, law. Her notes on Babbage’s engine, published in 1843, contain the first published algorithm intended for a machine, and an insight about computing that was a century ahead of its time. It is the vision, more than the code, that makes her a founding figure.',
  biography: `Ada Byron was born on 10 December 1815, the only legitimate child of the poet Lord Byron and Anne Isabella Milbanke. Her parents separated before she was a month old, and she was raised by her mother, her father having died in Messina in 1824 — by his own account, partly for the sake of his daughter. Ada never knew him.

What she had instead was a remarkable education. Her mother, anxious that her daughter should be "a rational creature" and not a merely brilliant one, ensured that mathematics was placed before her as a subject of serious instruction. In 1830 she met Augustus De Morgan, the professor whose "A Budget of Paradoxes" she read years later with something approaching joy. De Morgan tutored her in mathematics and, it seems, encouraged her in a habit that would define her: asking not just what a calculation produced but what it *meant*.

In 1833, at seventeen, Ada was introduced to Charles Babbage and saw the plans for his Difference Engine. She was fascinated, and in 1835 she married William King-Noel, later Earl of Lovelace, who took an interest in her work and in whom she found a partner rather than a patron. In 1842 Babbage asked her to translate a paper by the Italian engineer Luigi Menabrea, written in French, describing the still-unbuilt Analytical Engine.

The translation, published in 1843 in *Taylor's Scientific Memoirs*, is where Ada's own work appears — in the notes she appended, lettered A through G. Note A, written as a "publisher's memorandum", sets out what the engine could do. Note G is the famous one: it contains a step-by-step method for calculating Bernoulli numbers, which is generally described as the first published computer program.

What makes the notes remarkable is not the program. It is the argument. Ada observes that the engine "has no pretensions whatever to originate anything"; it can only do what we know how to order it to do. But she then takes the crucial step: the engine could act on any symbols whose relations could be expressed by the notation of music, logic or mathematics. A machine for numbers, she implies, might be a machine for anything.

She also understood the machine's limits. She wrote that the Analytical Engine, as described, could not reason on more than one subject at a time, and warned that a wrong input would produce a wrong result without any sign of error — a remark that reads as a description of a debugging problem a century and a half before the term existed.

Ada's health failed through the 1840s. She died of uterine cancer on 27 November 1852, aged thirty-six, and was buried in the churchyard of St Mary Magdalene at Hucknall, Nottinghamshire, near the family seat. She left behind a body of writing on mathematics, astronomy and religion that she asked her husband to burn or publish as an anonymous memoir; he published it under her initials instead.

Charles Babbage, who called her the "Enchantress of Numbers", was dismissive of her writing abilities and never fully credited her contributions. The correction of that judgement took more than a century, and is still incomplete.`,
  contributions: `**Translation of Menabrea's memoir.** Ada's 1843 translation brought the Analytical Engine to an English-speaking audience for the first time. It is the translation that made the machine legible to people who would never read the original French.

**Note A — a clear description of the machine.** Note A explains the structure of the Analytical Engine: the store, the mill, the cards and the reader, and how the mechanism of the engine "weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves." It is the most accurate contemporary account of the machine's architecture.

**Note G — the first published algorithm.** Note G sets out a method for computing Bernoulli numbers by which the engine could operate symbol by symbol, tracking the values of variables as it went. Whether it is "the first computer program" is a matter of definition, but it is the first published algorithm written explicitly for a machine to carry out, and the most complete one.

**The generalisation of the machine.** Ada's most consequential contribution is conceptual rather than technical: the argument that a calculating engine is a general symbol processor, and that its reach is limited only by the notation available to describe relations. That claim is the direct ancestor of the stored-program computer.`,
  ideas: `Ada's central idea is that calculation and expression are the same activity. A machine that manipulates symbols according to rules is not limited to numbers, because numbers are only one kind of symbol.

She states it most explicitly in Note A, where she observes that the engine "might act upon other things besides number, were facts found which the engine could express by the appropriate notation." The engine has "no pretensions whatever to originate anything" — it does exactly what it is told, which Ada sees not as a limitation but as a precondition for reliability.

Two corollaries follow. First, that the machine's usefulness depends on the person operating it: since the engine cannot check its own inputs, an error in the instructions propagates silently. Second, that a general machine invites general uses, including ones with no immediate commercial value. She does not dismiss the possibility; she simply declines to let the possibility of use limit the description of what the machine *is*.`,
  controversies: `Two controversies surround Ada, and both are worth stating plainly.

The first concerns the authorship of the notes. Charles Babbage, when *Taylor's Scientific Memoirs* came out, told the editor that the notes were his own, and in his later *Recollections of the Life of the late Babbage* he claimed considerable part of the intellectual content. Ada's own memorandum, preserved in the Bodleian Library, records her authorship of the translation and indicates that the notes were hers. The question was not settled during her lifetime, and Babbage's claim was the reason Ada received so little credit for most of the nineteenth and twentieth centuries.

The second concerns the myth that has grown around her. Ada is now sometimes presented as a programmer who anticipated artificial intelligence. The evidence in the notes is more interesting and more modest than that: it is a careful, specific argument about what a machine can and cannot do, written by someone who had worked the machine's logic through in detail. "Analytical Engine" in the title of her poem refers to the *other* engine — the one she believed could analyse and compose music, which was never built. That is a long way from a claim about thinking machines.

Neither controversy requires dismissing her achievement. The notes are hers, they are remarkable, and their most accurate reading is the one she herself gave.`,
  legacy: `Ada Lovelace's immediate influence was small; her long-run influence is enormous, and it runs through a specific line: the idea that computing is general.

That idea did not enter the machine directly. Babbage's Analytical Engine was never completed, and the practical lineage of modern computing runs through Charles Babbage's pupil Ada's descendant in a different sense — through the stored-program designs of the 1940s, where the notion of a machine that held its own program finally realised the formal structure Babbage had described.

The revival of Ada's reputation from the 1970s onward has been substantial, and the naming of the programming language Ada in 1980 was part of it. But the deeper legacy is conceptual: every general-purpose computer, from the smallest microcontroller to a machine-learning cluster, embodies the proposition Ada stated in 1843 — that a device for manipulating symbols can be pointed at any subject we know how to write down.

The same notes produced a lasting warning about verification, since a machine that cannot check its own inputs is exactly the machine on which human error becomes invisible. In an age of systems that process far more than anyone can inspect, that warning is arguably the more useful of her two legacies.`,
  categories: ['science-technology', 'computing', 'mathematics-engineering'],
  tags: ['computing', 'mathematics', 'first-programmer', 'logic'],
  timeline: [
    {
      date: '1815-12-10',
      precision: 'day',
      title: 'Born in London',
      description:
        'Ada Byron is born on 10 December 1815, the only legitimate child of Lord Byron and Anne Isabella Milbanke.',
      place: 'London',
      source: 'wiki',
    },
    {
      date: '1824',
      precision: 'year',
      title: 'Separated from her father',
      description:
        'Lord Byron dies in Messina in April 1824. Ada, aged eight, never knew him, and was raised by her mother.',
      place: 'Hucknall',
      source: 'wiki',
    },
    {
      date: '1830',
      precision: 'year',
      title: 'Studied mathematics with De Morgan',
      description:
        'Ada meets Augustus De Morgan, who tutored her in mathematics and encouraged her habit of asking what a result meant, not only what it equalled.',
      place: 'London',
      source: 'wiki',
    },
    {
      date: '1833',
      precision: 'year',
      title: 'First meeting with Charles Babbage',
      description:
        'At seventeen Ada is introduced to Babbage and sees the plans for the Difference Engine, which she found more absorbing than anything she had encountered.',
      place: 'London',
      source: 'chm',
    },
    {
      date: '1835',
      precision: 'year',
      title: 'Married William King-Noel',
      description:
        'Ada marries William King-Noel, later Earl of Lovelace. The marriage was affectionate, and he supported her studies and her work.',
      place: 'London',
      source: 'wiki',
    },
    {
      date: '1842',
      precision: 'year',
      title: 'Asked to translate Menabrea',
      description:
        'Babbage asks Ada to translate a French paper by Luigi Menabrea describing the Analytical Engine. She works on it, adding notes of her own.',
      place: 'London',
      source: 'wiki',
    },
    {
      date: '1843',
      precision: 'year',
      title: 'Notes published',
      description:
        'The translation and her notes A through G appear in Taylor\'s Scientific Memoirs, volume 3. Note G contains the Bernoulli-number algorithm, generally described as the first published computer program.',
      place: 'London',
      source: 'chm',
    },
    {
      date: '1848',
      precision: 'year',
      title: 'Birth of her son',
      description:
        'Ada gives birth to her only child, Byron, who was later Lord King.',
      place: 'London',
      source: 'wiki',
    },
    {
      date: '1852-11-27',
      precision: 'day',
      title: 'Dies at thirty-six',
      description:
        'Ada dies of uterine cancer on 27 November 1852, aged thirty-six. She is buried in the churchyard of St Mary Magdalene, Hucknall.',
      place: 'Hucknall',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'alan-turing',
      type: 'movement',
      description:
        'Turing completed the argument Ada began: that a machine for numbers might be a machine for symbols generally. The two never met, and the lineage is a matter of argument rather than instruction.',
      periodNote: '1843 → 1936',
      source: 'chm',
    },
    {
      to: 'grace-hopper',
      type: 'movement',
      description:
        'Hopper turned the machine Ada analysed into something a person could write to, which is the practical completion of the generalisation she proposed.',
      periodNote: '1952',
      source: 'chm',
    },
  ],
  sources: ['wiki', 'britannica', 'chm', 'mathshistory'],
};
