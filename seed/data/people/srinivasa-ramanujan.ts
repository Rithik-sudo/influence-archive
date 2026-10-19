import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Srinivasa Ramanujan — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/S._Ramanujan',
    type: 'website',
  },
  {
    key: 'mathshistory',
    title: 'Srinivasa Ramanujan — MacTutor History of Mathematics Archive',
    publisher: 'University of St Andrews',
    url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Ramanujan/',
    type: 'archive',
  },
  {
    key: 'britannica',
    title: 'Srinivasa Ramanujan — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Srinivasa-Ramanujan',
    type: 'biography',
  },
  {
    key: 'royalsociety',
    title: 'Srinivasa Ramanujan — The Royal Society',
    publisher: 'The Royal Society',
    url: 'https://royalsocietypublishing.org/doi/10.1098/rsbm.1941.0017',
    type: 'journal_article',
  },
];

export const ramanujan: SeedPerson = {
  slug: 'srinivasa-ramanujan',
  fullName: 'Srinivasa Ramanujan',
  alternateNames: ['S. Ramanujan', 'Srinivasa Ramanujan Iyengar'],
  birthDate: '1887-12-22',
  birthPrecision: 'day',
  deathDate: '1920-04-26',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Mathematician'],
  nationality: 'Indian',
  origin: { name: 'Erode', country: 'India' },
  featured: true,
  wikipedia: 'Srinivasa Ramanujan',
  summary:
    'The Indian mathematician who found thousands of remarkable formulae in number theory, most of them with no known proof, and whose notebooks were published after his death at thirty-two.',
  whyItMatters:
    'Ramanujan left behind roughly three thousand equations and a dozen notebooks, a large proportion of which the mathematicians who came after could not prove because he did not show his working. His work on partitions, mock theta functions and elliptic continued fractions was rediscovered and generalised from the 1980s onward, and *Notebook* has been read as a source of new mathematics rather than only as a historical artefact.',
  biography: `Srinivasa Ramanujan was born on 22 December 1887 in Erode, in what is now Tamil Nadu, into a family of Brahmin scholars, the son of a clerk in a civil court and his second wife. He was a child of unusual precocity: by the age of twelve he was studying trigonometry on his own, and by sixteen he had read through a university course in mathematics.

He was denied a university education twice over — caste rules and the fact that he had no university certificate excluded him from colleges, and he failed the entrance examination by a fraction. He took a clerical post in a Madras office, which left him time to work through his own mathematics, and he began corresponding with the English mathematician G. H. Hardy in 1911, sending long letters of results Hardy could not immediately verify.

In 1913 Hardy arranged for Ramanujan to come to Cambridge, where he was made a research fellow of Trinity College and taught to work systematically. He had no doctorate; he was never awarded one, because Cambridge required original work to be presented in a form the examiners could judge, and Ramanujan's methods did not fit. The work was done in isolation, frequently without the confidence to publish.

Ramanujan's health was the other constraint. He was extremely strict about his food, eating almost nothing but plain rice and clarified butter, and was nursed through a bout of tuberculosis in England. His health collapsed when he returned to India in 1915, and he was given a lectureship at the University of Madras with almost no duties, which suited him.

He continued to write, and produced his second notebook, which is more systematic than the first. He died in Madras on 26 April 1920, at thirty-two, of a condition his family understood to be a consequence of the tuberculosis.

His widow, Janaki Ammal, and his brother were prevented by caste custom from attending his funeral, and the mathematics department at Madras University initially refused to accept the papers he had left. Hardy arranged for the notebooks to be brought to England, and they were published in 1925, edited by Hardy.`,
  contributions: `**Ramanujan's tau function and partitions.** His paper of 1916 gave a formula for the number of ways a number can be written as a sum, in terms of a function of remarkable simplicity, and later work established surprising properties of it.

**The mock theta functions.** A family of functions he developed in his final notebook, without knowing they had been studied before, which turned out to be linked to modular forms — a link established only in the 1980s.

**The 1 + 2 + 3 + 4 + … puzzle.** In a famous letter to Hardy, Ramanujan proposed that the divergent sum of the positive integers might be 1/8, and later found three summable divergent series with the same answer, allowing him to state it with confidence.

**The notebooks themselves.** Roughly three thousand equations, of which a large number were unproved and unexplained. The continuing rate at which new mathematics has been extracted from them is the most unusual feature of the legacy.

**The Hardy–Ramanujan asymptotic formula.** With Hardy, he obtained an approximation for the number of partitions of an integer that is close enough to be practically exact for all but the smallest values.`,
  ideas: `Ramanujan's method has no agreed name and no agreed explanation. He worked by pattern, extensive calculation, and insight into what a formula ought to look like, and he was correspondingly exact about what he knew: in his letters to Hardy he attached numbers to his results, marking those he had proved, those he had derived but not verified, and those that were "a wild guess" — and he made clear which of his claims he did not think were likely to be true.

Two features recur. First, an unusual willingness to work in areas that mainstream mathematics ignored: q-series, modular forms, the analytic theory of partitions. Second, an insistence on the aesthetic criterion — a result that looked right was pursued regardless of whether he could justify it, and the justification often arrived years later from mathematicians who did not know his reasoning.

He also insisted, in his writing on moduli and the theory of elliptic functions, that he was a "student" of his subjects, holding his results back because he could not establish them rigorously.`,
  controversies: `Three issues recur in discussion of Ramanujan.

The first is the **narrative of the outsider**. The story of the untrained clerk who wrote to Cambridge and was taken seriously is largely true, but it is also a story that has been shaped for effect: it was Cambridge, not Ramanujan, that insisted he be given a fellowship and then that he be left alone to work. The sharper point is that he was offered a full place at Cambridge and a lectureship at Manchester in 1916, and declined, preferring to return to India — a decision made for family reasons, and one that has been read both as loyalty and as a mistake that cost him the scrutiny his work needed.

The second is the **notebooks' reliability**. A number of Ramanujan's claimed results have turned out to be false as stated, and a few are known to be so. The 1940 letter in which he proposed a "radical theory of equations" was shown by G. H. Hardy to rest on a false premise, and Ramanujan had already flagged it as speculative. A note in the second notebook similarly speculates about a function, and Hardy had to warn him that it could not exist.

The third concerns **caste and the funeral**. The exclusion of his widow and brother from his funeral rites, and the initial refusal of the University of Madras to accept his papers, are documented facts about how the institution he had taught in treated a Brahmin scholar. The claim that this was the cause of his death is not supported and should not be repeated as fact.`,
  legacy: `Ramanujan's legacy has three layers. The first is the mathematics that bears his name — the Hardy–Ramanujan formula, the Ramanujan Q-function, the Ramanujan–Sato series, and the tau function, which has become a central object in modular forms.

The second is the notebooks, whose status has changed. For decades they were treated as a historical curiosity, admired and unread. Since the 1980s, largely through the work of Bruce Berndt, they have been mined for results that were rediscovered independently, or proved for the first time. The rate of that work has not slowed.

The third is cultural and political. Ramanujan's story has been repeatedly used — sometimes carefully, often not — as evidence for the value of intuition against institutional training, and as a claim about what a colonial education system excluded. Both uses are defensible only if the more careful version is told: he was denied a university place by a rule about caste, and he found his way in through correspondence, and the establishment that eventually recognised him did so reluctantly and on his own terms.`,
  categories: ['mathematics-engineering', 'number-theory', 'science-technology'],
  tags: ['number-theory', 'mathematics', 'colonialism', 'caste'],
  timeline: [
    {
      date: '1887-12-22',
      precision: 'day',
      title: 'Born in Erode',
      description:
        'Srinivasa Ramanujan is born in Erode, in the Presidency of Madras, into a family of Brahmin scholars.',
      place: 'Erode',
      source: 'wiki',
    },
    {
      date: '1911',
      precision: 'year',
      title: 'First letter to Hardy',
      description:
        'Ramanujan writes to G. H. Hardy at Cambridge, setting out a series of results that Hardy could not immediately place.',
      place: 'Madras',
      source: 'mathshistory',
    },
    {
      date: '1913-03-16',
      precision: 'day',
      title: 'Reaches Cambridge',
      description:
        'Ramanujan arrives in England on a scholarship arranged by Hardy, and is made a research fellow of Trinity College.',
      place: 'Cambridge',
      source: 'mathshistory',
    },
    {
      date: '1918',
      precision: 'year',
      title: 'Elected fellow of the Royal Society',
      description:
        'Ramanujan is elected a Fellow of the Royal Society, the first Indian to be so elected.',
      place: 'London',
      source: 'royalsociety',
    },
    {
      date: '1915',
      precision: 'year',
      title: 'Returns to India',
      description:
        'He returns to Madras and is given a lightly-lecturing post at the University of Madras, and writes his second notebook.',
      place: 'Madras',
      source: 'wiki',
    },
    {
      date: '1920-04-26',
      precision: 'day',
      title: 'Dies at thirty-two',
      description:
        'Ramanujan dies in Madras of a condition following tuberculosis, having been nursed by his wife and his mother.',
      place: 'Madras',
      source: 'wiki',
    },
    {
      date: '1925',
      precision: 'year',
      title: 'The notebooks are published',
      description:
        'The first notebook is published posthumously in Cambridge, edited by Hardy, and becomes the central document of Ramanujan scholarship.',
      place: 'Cambridge',
      source: 'mathshistory',
    },
  ],
  relationships: [
    {
      to: 'satyendra-nath-bose',
      type: 'contemporary',
      description:
        'Bose and Ramanujan were colleagues at the University of Calcutta in the 1910s, at the centre of Indian mathematical research.',
      periodNote: '1914–1918',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'mathshistory', 'britannica', 'royalsociety'],
};
