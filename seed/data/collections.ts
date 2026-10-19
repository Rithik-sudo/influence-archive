import type { SeedCollection } from '../types';

export const collections: SeedCollection[] = [
  {
    slug: 'pioneers-who-built-modern-computing',
    title: 'Pioneers who built modern computing',
    description:
      'From a machine that was never finished to a compiler that made programming ordinary: the people who made computing a discipline.',
    featured: true,
    people: ['ada-lovelace', 'alan-turing', 'grace-hopper', 'katherine-johnson'],
    articles: ['the-first-algorithm'],
    introduction: `Computing is a young discipline with an unusually long memory. It remembers the people whose work it now takes for granted, and the four profiles in this collection are the ones it remembers most clearly.

Ada Lovelace supplies the idea that a machine for numbers might be a machine for symbols generally. Alan Turing gives the theory that bounds what any such machine can do, and the war effort that proved one could be built. Grace Hopper turns the machine into something a person can write to. Katherine Johnson supplies the reminder that the arithmetic was done by hand, by people whose names were not on the technical reports, and that the checking was the job.

Read in order, they describe a discipline assembling itself out of mathematics, engineering, pedagogy and patience.`,
  },
  {
    slug: 'thinkers-who-changed-how-we-see-the-world',
    title: 'Thinkers who changed how we see the world',
    description:
      'Philosophy, ethics and political theory: the arguments that shifted the terms in which the hardest questions are asked.',
    featured: true,
    people: ['hypatia', 'hannah-arendt', 'b-r-ambedkar'],
    articles: ['what-is-influence', 'ideas-that-changed-the-modern-world'],
    introduction: `A philosophical profile is hard to write and harder to keep honest, because the temptation is to report a position rather than an argument. The profiles in this collection are written to show the argument: what the question was, what the answer was, and what it cost the person who held it.

Hypatia's work survives only at one remove, in her students' writing, and the reconstruction of her is a case study in how much can honestly be recovered from second-hand testimony. Hannah Arendt's account of thoughtlessness is the most argued-over position in modern political theory. Confucius built a teaching tradition that is still in use, and whose original text is a conversation rather than a treatise.

Taken together they argue for something the archive elsewhere insists on: that a position is a position held by someone, in circumstances, against alternatives.`,
  },
  {
    slug: 'women-who-changed-the-course-of-science',
    title: 'Women who changed the course of science',
    description:
      'A school for girls opened in 1848, a prize won in 1911, a compiler written in 1952, a trajectory computed by hand: four cases in which the record needed correcting.',
    featured: true,
    people: ['savitribai-phule', 'marie-curie', 'grace-hopper', 'katherine-johnson', 'ada-lovelace'],
    articles: ['women-who-changed-the-course-of-science'],
    introduction: `This collection is not a celebration. It is a record of five instances in which a woman's work on a scientific problem was not recorded as hers, and of the mechanisms that produced the omission.

They are not the same mechanism. Savitribai Phule worked in an educational system that did not exist and had to be built. Marie Curie worked inside a system that recognised her work on condition she be treated as an exceptional woman. Ada Lovelace worked in a collaboration that her collaborator later described as his own. Grace Hopper worked under a job title that named a machine. Katherine Johnson worked in a segregated pool, asked to verify other people's arithmetic and not to sign it.

The essay attached to this collection argues the common feature: each mechanism was invisible, and none of them required anyone to intend anything.`,
  },
  {
    slug: 'rivalries-that-reshaped-history',
    title: 'Rivalries that reshaped history',
    description:
      'Disagreements that forced an argument into the open, and the work that came out of them.',
    people: ['alan-turing', 'marie-curie', 'satyendra-nath-bose', 'ada-lovelace', 'hannah-arendt', 'b-r-ambedkar', 'nelson-mandela', 'rabindranath-tagore'],
    articles: ['rivalries-that-reshaped-history'],
    introduction: `A rivalry is a piece of history that took an argument instead of a position. Sometimes it was between two people; sometimes between a person and an institution; and sometimes between a collaborator and a partner, which is the case that has taken longest to read correctly.

The relationships recorded in this archive — "rival of" alongside "influenced" and "collaborated with" — are not decoration. They are the mechanism by which the record of a scientific or political disagreement is preserved, and they are among the few places where the sources are unexpectedly rich, because people who disagree write things down.`,
  },
  {
    slug: 'ideas-that-shaped-the-modern-world',
    title: 'Ideas that shaped the modern world',
    description:
      'Computability, the algorithm, the cell, the archive: four concepts, and the arguments that produced them.',
    featured: true,
    people: ['alan-turing', 'ada-lovelace', 'marie-curie', 'hypatia', 'b-r-ambedkar', 'rabindranath-tagore'],
    articles: ['ideas-that-changed-the-modern-world'],
    introduction: `This archive is organised around people, because that is the unit in which influence is legible. But what actually gets carried forward is an idea, and ideas have a longer and stranger history than the people who first had them.

The essay attached to this collection follows four — computability, the algorithm, the cell and the archive — and argues that each is a *definition that excludes*, which is where its historical weight sits. It also argues that exclusions in the archive itself are information, and that an honest publication should be able to say which ones it has made.`,
  },
  {
    slug: 'influential-figures-from-india',
    title: 'Influential figures from India',
    description:
      'A mathematician whose notebooks are still yielding results, an educator who opened the first school for girls, a constitution that outlives its framers.',
    featured: true,
    people: ['srinivasa-ramanujan', 'savitribai-phule', 'b-r-ambedkar', 'rabindranath-tagore', 'a-p-j-abdul-kalam', 'satyendra-nath-bose'],
    introduction: `The six profiles here come from different fields and different centuries, and they share a specific and unusual problem: each of them worked in an intellectual system that did not extend the invitation to them.

Ramanujan was refused a university place by the rules of a colonial system and by caste, and worked his way in by correspondence. Phule had to build the school before she could teach in it. Bose did the work that would win a Nobel Prize in another institution, without a PhD. Ambedkar drafted a constitution under a rule that gave him no majority. Tagore and Kalam were both, in different ways, asked to represent a nation that was still being made.

It would be a mistake to read this as a list of national heroes. They are a set of cases in which the conditions of access shaped the work, which is a harder and more useful thing to know.`,
  },
  {
    slug: 'people-who-changed-art-and-culture',
    title: 'People who changed art and culture',
    description:
      'A painter who refused the consolations of allegory, a poet who brought a non-European voice into English, and what they did to the idea of artistic work.',
    people: ['frida-kahlo', 'rabindranath-tagore', 'hypatia'],
    articles: ['what-is-influence'],
    introduction: `Art is the field where the archive's usual categories work least well, and that is instructive. Nobody measures the influence of a painting by what it caused in other paintings; the claim is usually made about how it changed what was possible to see.

Kahlo's work is a case in point. It is frequently discussed as a self-portrait tradition of enormous psychological candour, which is to say as a matter of personal disclosure — a reading she resisted, and which turns a political argument into a symptom. Tagore's case is the mirror image: a body of work in more than sixty languages, translated into the English-speaking world at a moment when it was adjusting to the twentieth century, and then claimed from several directions at once.

The third profile here, Hypatia, is a philosopher, and is included for the same reason: the Alexandrian commentaries and the Neoplatonist tradition she taught are the nearest ancient parallel to what we now call philosophy of art.`,
  },
  {
    slug: 'breakthroughs-that-began-with-failure',
    title: 'Breakthroughs that began with failure',
    description:
      'Results that were wrong before they were right, and what the record actually says about how discovery goes.',
    people: ['srinivasa-ramanujan', 'satyendra-nath-bose', 'alan-turing', 'marie-curie', 'katherine-johnson'],
    articles: ['the-measurement-problem'],
    introduction: `The popular account of discovery is a straight line: a person thinks, and then the thing is true. The working record is much less tidy, and the archive's timeline and source structures exist partly to preserve the untidy version.

Ramanujan's second notebook contains claims that Hardy showed to be false, and Ramanujan had flagged them himself as speculative. His 1940 letter proposing a "radical theory of equations" rests on a premise that does not hold, and he knew it. Bose's 1935 experiments reporting a "response" in living tissue were attacked at the time and have not been established since. Curie's early work on radioactivity included measurements that had to be redone.

The profile of Katherine Johnson supplies the mechanism. Her work was verification, and verification is the practice of finding out that a number is wrong. A field that keeps the corrections in the record — including its own — is a field that can be checked, and that is what makes it a science rather than a story about genius.`,
  },
];
