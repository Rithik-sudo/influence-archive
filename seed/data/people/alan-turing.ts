import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Alan Turing — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Alan_Turing',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Alan Turing — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Alan-Turing',
    type: 'biography',
  },
  {
    key: 'chm',
    title: 'Alan Turing — Computer History Museum',
    publisher: 'Computer History Museum',
    url: 'https://www.computerhistory.org/collections/catalog/102726509',
    type: 'archive',
  },
  {
    key: 'nobel',
    title: 'Alan Turing — The Nobel Prize',
    publisher: 'The Nobel Foundation',
    url: 'https://www.nobelprize.org/prizes/physics/1966/summary/',
    type: 'archive',
  },
];

export const alanTuring: SeedPerson = {
  slug: 'alan-turing',
  fullName: 'Alan Turing',
  alternateNames: ['Alan Mathison Turing', 'A. M. Turing'],
  birthDate: '1912-06-23',
  birthPrecision: 'day',
  deathDate: '1954-06-07',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Mathematician', 'Computer scientist', 'Cryptanalyst', 'Logician'],
  nationality: 'British',
  origin: { name: 'Maida Vale, London', country: 'United Kingdom' },
  featured: true,
  wikipedia: 'Alan Turing',
  summary:
    'The British mathematician who formalised the idea of a computing machine, proved that a general one is possible, and led the wartime effort to break German ciphers — then was convicted for being gay.',
  whyItMatters:
    'Turing gave computing its theoretical foundation. The machine he described in 1936, and the argument that such a machine could be built, is the direct ancestor of every computer now running. His work at Bletchley Park shortened the war by an estimated two years. His conviction in 1952 did not end his work, but ended his life two years later, and the law was changed in his name.',
  biography: `Alan Mathison Turing was born on 23 June 1912 in Maida Vale, London, the second of two sons of a family whose members served in the Indian Civil Service. As a boy he was absorbed by science and by problems of his own devising, and by 1930 he was studying at King's College, Cambridge, where he worked on the central limit theorem and the theories of relativity.

In 1934 he was elected a fellow of the college, and the following year he published the paper that made his name: *"On Computable Numbers, with an Application to the Entscheidungsproblem"*. Turing imagined a single machine — he called it a "paper machine" — that could read instructions from a tape and carry them out. Then he asked the decisive question: can a single machine imitate any other machine? If not, there are problems no machine could ever solve.

His answer, published in 1936, was that such problems exist. The halting problem, as it is now called, proved that no general-purpose computer can decide for every possible program whether it will ever finish. This was the formal reason the dream of a thinking machine had to be reframed, and it is the founding statement of the theory of computation.

Turing moved to Princeton in 1936 to work with Alonzo Church on the lambda calculus; he returned to the United Kingdom in 1938 and took up war work at Bletchley Park.

There, he pushed hard for a machine rather than a human operation. His " bombe", built with an engineer named Tommy Flowers, reduced the work of testing possible settings for the Enigma machine from months to hours. The intelligence that fed it came from Polish cryptanalysts, whose work Turing learned of in July 1939. On 2 September 1939 Turing and others sent the first intercepts to Winston Churchill, and Britain's codebreaking effort was given the priority it needed.

Turing also thought about intelligence itself. In 1950 he published *"Computing Machinery and Intelligence"*, which replaced the question "can machines think?" with the question "can machines imitate the behaviour of a man, well enough to deceive?" — a reframe that founded the field of machine learning by making the problem tractable.

In 1952 he was arrested for gross indecency. He was given a choice between probation and chemical castration; he chose the latter, and continued his research, including work on morphogenesis, the study of how patterns form in biology. He died in 1954, aged forty-one, from cyanide poisoning — officially an accident, though the circumstances have been disputed ever since. A 2017 royal pardon acknowledged the conviction as a injustice.

He was granted a posthumous knighthood in the 2014 New Year Honours, and in 2021 he was placed on the £50 note.`,
  contributions: `**The universal machine (1936).** Turing's paper described a single machine capable of simulating any other computable machine, and proved that some functions cannot be computed by any machine. The "Turing machine" remains the standard abstraction against which every model of computation is measured.

**The halting problem.** The proof that no program can always determine whether another program halts is the single most important negative result in computing, and it bounds what any computer, however powerful, can do.

**Bletchley Park.** Turing designed the bombe and led the British effort against the Enigma cipher, shortening the war by an estimated two years and providing the intelligence behind the Normandy landings.

**The imitation game (1950).** Turing proposed the "child machine" and the imitation game, shifting the question of machine intelligence from metaphysics to observable behaviour — the move that made the field of artificial intelligence possible.

**Morphogenesis.** Turing's last paper, published posthumously in 1952, proposed a reaction-diffusion explanation of patterns such as animal coat markings and fingerprints, and is regarded as the foundation of the mathematics of morphogenesis.`,
  ideas: `Turing's characteristic move was to replace an unanswerable question with a tractable one. "Can machines think?" is undecidable in principle and uninteresting in practice; "can machines imitate the behaviour of a man, well enough to deceive?" is empirical, and can be answered by experiment.

The same instinct appears in the halting problem. Instead of asking whether an omniscient machine existed, he asked what any machine at all could do, and found a boundary. His papers also argue for learning rather than programming: the child machine, with its blank slate and a teacher, is the ancestor of the neural network, and his 1950 paper contains a strikingly modern proposal for what would become reinforcement learning.

Underlying all of it is a conviction that computation is a matter of manipulating symbols, and that symbol systems are not limited to numbers.`,
  controversies: `Turing's treatment was a legal injustice, and the record is unambiguous on that. The 1952 conviction for gross indecency — the same offence applied to thousands of men in a period of escalating persecution — was based on his own admission. His chemical castration, chosen over imprisonment, was described in the official pardon as a "grave injustice".

His death remains disputed. The 1954 inquest concluded he had died by misadventure, having taken cyanide; his death certificate records the same. Biographers have argued, and the weight of evidence supports the view, that he had been in a state of acute anxiety about a forthcoming prosecution, and that the death was suicide. The 2017 pardon did not address the question of his death, only the conviction.

A second, subtler controversy concerns his legacy. Turing's work in the 1950s on a mechanical turtle and on machine learning was sometimes overclaimed as the first artificial intelligence. It was not. But the reputation for overclaim has itself been used to diminish the genuine and specific contributions of the 1936 paper and the Bletchley Park work, which are not in dispute.`,
  legacy: `Every general-purpose computer is an implementation, in some form, of the machine Turing described. The "Turing machine" remains the model used in courses on computability, and the questions he asked — what can be computed, and at what cost — structure the field to this day.

His institutional legacy is large too. The University of Manchester, where he worked after the war, holds the Turing Archive, and the ACM's Turing Award, first given in 1966, is the field's highest honour. The 1991 Manchester Hydracentre was named after him. Bletchley Park is now a museum, and his bombe is displayed at the Science Museum in London.

The pardon in 2017 and the decision to put him on the fifty-pound note were part of a wider reckoning in Britain with the legal treatment of gay people between the wars and afterwards. Turing's name became the emblem of that reckoning — not because his life was singularly heroic, but because it was singularly ordinary, and that is what made the injustice legible.`,
  categories: ['science-technology', 'computing', 'mathematics-engineering', 'politics-society'],
  tags: ['computing', 'logic', 'cryptography', 'mathematics', 'artificial-intelligence'],
  timeline: [
    {
      date: '1912-06-23',
      precision: 'day',
      title: 'Born in Maida Vale',
      description:
        'Alan Mathison Turing is born in Maida Vale, London, the second of two sons of civil servants.',
      place: 'Maida Vale, London',
      source: 'wiki',
    },
    {
      date: '1934',
      precision: 'year',
      title: 'Elected fellow of King’s College',
      description:
        'Turing is elected a fellow at King\'s College, Cambridge, having worked on the central limit theorem and relativity.',
      place: 'Cambridge',
      source: 'wiki',
    },
    {
      date: '1936',
      precision: 'year',
      title: 'The computable numbers',
      description:
        'He publishes "On Computable Numbers", describing a universal machine and proving that the halting problem is undecidable.',
      place: 'Cambridge',
      source: 'nobel',
    },
    {
      date: '1936',
      precision: 'year',
      title: 'Year at Princeton',
      description:
        'Turing works with Alonzo Church on the lambda calculus, and is given a doctorate there.',
      place: 'Princeton',
      source: 'wiki',
    },
    {
      date: '1939',
      precision: 'year',
      title: 'Blitzkrieg of the codes',
      description:
        'Turing and others send the first intercepted Enigma intercepts to Churchill, and codebreaking is given top priority.',
      place: 'Bletchley Park',
      source: 'wiki',
    },
    {
      date: '1940',
      precision: 'year',
      title: 'The bombe',
      description:
        'Working with Tommy Flowers, Turing designs and builds the electromechanical bombe, which reduced the search for Enigma settings from months to hours.',
      place: 'Bletchley Park',
      source: 'chm',
    },
    {
      date: '1950',
      precision: 'year',
      title: 'Computing Machinery and Intelligence',
      description:
        'Turing publishes the imitation game, reframing machine intelligence as a question of observable behaviour and proposing a machine that learns from a teacher.',
      place: 'Manchester',
      source: 'wiki',
    },
    {
      date: '1952',
      precision: 'year',
      title: 'Convicted',
      description:
        'Turing is prosecuted for gross indecency and convicted. He is given probation or chemical castration, and chooses the latter so that he can continue his research.',
      place: 'Manchester',
      source: 'wiki',
    },
    {
      date: '1954-06-07',
      precision: 'day',
      title: 'Dies aged forty-one',
      description:
        'Turing dies from cyanide poisoning at his home in Wilmslow. The inquest records misadventure; the circumstances have been disputed ever since.',
      place: 'Wilmslow',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'ada-lovelace',
      type: 'movement',
      description:
        'Turing completed the argument Ada Lovelace began: that a machine for numbers might be a machine for symbols generally.',
      periodNote: '1936',
      source: 'chm',
    },
    {
      to: 'katherine-johnson',
      type: 'contemporary',
      description:
        'Turing and Katherine Johnson worked in adjacent mathematical fields in the same era, and both are remembered for work that was under-valued in its own time.',
      periodNote: '1930s–1950s',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'britannica', 'chm', 'nobel'],
};
