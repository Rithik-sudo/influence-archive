import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Marie Curie — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Marie_Curie',
    type: 'website',
  },
  {
    key: 'nobel',
    title: 'Marie Curie — The Nobel Prize',
    publisher: 'The Nobel Foundation',
    url: 'https://www.nobelprize.org/prizes/physics/1903/marie-curie/biographical/',
    type: 'archive',
  },
  {
    key: 'britannica',
    title: 'Marie Curie — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Marie-Curie',
    type: 'biography',
  },
  {
    key: 'aps',
    title: 'Marie Curie — American Physical Society',
    publisher: 'American Physical Society',
    url: 'https://www.aps.org/',
    type: 'journal_article',
  },
];

export const marieCurie: SeedPerson = {
  slug: 'marie-curie',
  fullName: 'Marie Curie',
  alternateNames: ['Maria Skłodowska-Curie', 'Marya Skłodowska', 'Marie Salomea Skłodowska'],
  birthDate: '1867-11-07',
  birthPrecision: 'day',
  deathDate: '1934-07-04',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Physicist', 'Chemist', 'Scientist'],
  nationality: 'Polish-French',
  origin: { name: 'Warsaw', country: 'Poland' },
  featured: true,
  wikipedia: 'Marie Curie',
  summary:
    'The Polish-French physicist who discovered polonium and radium, made radioactivity a measurable phenomenon, and was the first person to win two Nobel Prizes in different sciences.',
  whyItMatters:
    'Curie gave physics a new subject. Before her, radioactivity was an observation about glowing rocks; after her, it was a property of elements that could be isolated, measured and used. She was also the only person to win Nobels in two sciences, the first woman to win one at all, and the mother of a Nobel-winning daughter.',
  biography: `Marie Salomea Skłodowska was born in Warsaw on 7 November 1867, the youngest of five children of a teacher who ran a boarding school for girls. Her father taught physics; her mother was a teacher and a painter, and the family was politically and intellectually engaged, and Polish.

She studied at the clandestine Flying University, because the Russian authorities barred women and Poles from the University of Warsaw. She worked as a governess to support her family while teaching herself physics and chemistry, and she read Émile du Bois-Reymond's advice that "in science one must be able to at least know what is already known" with the intensity of a vocation.

In 1891 she went to Paris and studied at the Sorbonne, working in a freezing unheated shed with a borrowed Curie quartz electrometer that she personally improved. In 1894 she noticed that uranium compounds emitted a measurable radiation that persisted independently of the compound, and that the intensity was proportional to the amount of uranium present. Her thesis on that work, published in 1895, marked radioactivity as a property of the element rather than of its chemical form.

She met Pierre Curie, who gave up a comfortable position to take a modest professorship with her; they married in 1895. Working together they announced the discovery of radium in 1898, isolating it from tonnes of pitchblende — Pierre handling the physical labour, Marie doing the chemistry — and named it for its ray-like emission. The Curies shared the 1903 Nobel Prize in Physics with Henri Becquerel.

They refused the patent on radium, which would have made them very rich, preferring that it be available to the scientific community. During the First World War Marie organised mobile X-ray units for wounded soldiers, travelling with them herself at the front.

Pierre died in 1906, run over by a horse-drawn wagon in the rain. Marie continued alone, and in the 1910s she became the first person to win two Nobel Prizes, in two different sciences. She accepted the 1903 physics prize in person, the only laureate to do so, and refused to speak at the 1911 ceremony in Stockholm because she was not permitted to attend unless she presented in a gown.

Her health, damaged by years of radiation exposure among her samples, was failing. She died on 4 July 1934, at the age of sixty-six.`,
  contributions: `**The discovery of radioactivity as a property of the element.** Curie's doctoral thesis established that radioactivity was characteristic of uranium itself and proportional to its quantity — not of the compound, the temperature or the light. This turned a curiosity into a measurable quantity, and made the study systematic.

**Radium and polonium.** With Pierre in 1898 she isolated polonium and radium from pitchblende, working through tonnes of ore to obtain a few hundredths of a gram. Radium's intense radioactivity opened the age of radiation physics and, later, of radiotherapy.

**A research institution and a discipline.** She founded the Radium Institute in Paris, later the Institut Curie, and trained a generation of researchers. The practical techniques she developed — radioactive measurement, isotope separation — became standard practice.

**Public health.** Her wartime mobile radiography units, which treated roughly half a million wounded soldiers, established a model for bringing diagnosis to the front line that was used in every later conflict.`,
  ideas: `Curie's working philosophy was a refusal to take inherited accounts on trust. The discovery of radioactivity followed directly from measuring rather than assuming: she asked whether the effect tracked the compound, the purity, the temperature, the light, and found it tracked only the amount of the element.

Her most consequential methodological decision was to treat a discrepancy as a fact rather than a nuisance. Henri Becquerel's discovery of emission from uranium salts was treated as a curiosity of a single substance; Curie asked whether emission was a general phenomenon, and answered it by looking for other elements that behaved the same way. That question produced radium.

She also insisted on measurement as a shared, cumulative enterprise, and on the dignity of experimental work carried out by people whose names were not recorded in the textbooks.`,
  controversies: `Two issues in the historical record have been examined closely.

The first concerns her role relative to Pierre's. The two worked closely on the physics of radioactivity — the law of radioactivity, the measurement of it — while the isolation of radium was, by Marie's own detailed account, hers: the extraction, the chemistry, the fractional crystallisation. Recent scholarship has tended to correct the record towards her, and the research institute she founded bore her name. The question is less whether she was capable than whether her contribution was invisible within a partnership and a discipline that credited men first.

The second concerns the effects of radiation exposure on her health, and on that of the researchers who worked with her samples, including her daughter Irène. The evidence that her aplastic anaemia was caused by radiation exposure is strong. Whether she understood the risk she was taking is more contested: early radiation research was conducted with fewer safety norms than now, and she was herself the scientist establishing those norms for others.

She was also, and this is not a scandal but a fact of her politics, a committed patriot who served in the French cause during the war and was later a candidate for the Académie française.`,
  legacy: `Two Nobel Prizes in two sciences; the only person to achieve that. The Curie Institute in Paris and the Curie Foundation in Warsaw both descend from her laboratory. Radium, a word she coined, entered the vocabulary of the twentieth century and then, with the recognition of its hazards, became a byword for both scientific hubris and scientific courage.

The most durable legacy is institutional rather than personal. Curie's demonstration that a laboratory could be built, funded and staffed to attack a fundamental problem — and that its results belonged to the scientific community rather than to the person who made them — became a model for the research institutes of the later twentieth century.

The debate over the "great man" question has been, in her case, unusually productive: two hundred years after her death the standard reference works state plainly that the isolation of radium was hers. That is a rare kind of correction, and it happened.`,
  categories: ['science-technology', 'chemistry', 'medicine-health'],
  tags: ['radioactivity', 'chemistry', 'medicine', 'public-health'],
  timeline: [
    {
      date: '1867-11-07',
      precision: 'day',
      title: 'Born in Warsaw',
      description:
        'Marie Skłodowska is born in Warsaw, the youngest of five children of a teacher and a schoolmistress.',
      place: 'Warsaw',
      source: 'wiki',
    },
    {
      date: '1891',
      precision: 'year',
      title: 'Begins study at the Sorbonne',
      description:
        'Curie moves to Paris to study physics and chemistry at the Sorbonne, working in a shed with an instrument she improved herself.',
      place: 'Paris',
      source: 'nobel',
    },
    {
      date: '1895-03-12',
      precision: 'day',
      title: 'Marriage and first radium measurements',
      description:
        'Curie marries Pierre Curie and presents her thesis on uranium radioactivity, establishing that the effect is a property of the element.',
      place: 'Paris',
      source: 'wiki',
    },
    {
      date: '1898-12-26',
      precision: 'day',
      title: 'Radium announced',
      description:
        'The Curies announce the discovery of radium and polonium, after processing tonnes of pitchblende.',
      place: 'Paris',
      source: 'nobel',
    },
    {
      date: '1903-12-10',
      precision: 'day',
      title: 'First Nobel Prize',
      description:
        'Curie shares the Nobel Prize in Physics with Pierre Curie and Henri Becquerel for work on radiation phenomena.',
      place: 'Stockholm',
      source: 'nobel',
    },
    {
      date: '1914',
      precision: 'year',
      title: 'Mobile X-ray units',
      description:
        'During the First World War Curie installs mobile radiography units near the front and operates them herself.',
      place: 'France',
      source: 'wiki',
    },
    {
      date: '1911-12-12',
      precision: 'day',
      title: 'Second Nobel Prize, in chemistry',
      description:
        'Curie wins the Nobel Prize in Chemistry for radium, and declines to attend the ceremony in Stockholm rather than appear without a gown.',
      place: 'Paris',
      source: 'nobel',
    },
    {
      date: '1934-07-04',
      precision: 'day',
      title: 'Dies of aplastic anaemia',
      description:
        'Curie dies of aplastic anaemia, the consequence of years of radiation exposure, at the age of sixty-six.',
      place: 'Passy',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'satyendra-nath-bose',
      type: 'contemporary',
      description:
        'Bose and Curie belong to the same generation of physicists who made the twentieth century\'s quantum theory, though they worked far apart.',
      periodNote: '1920s',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'nobel', 'britannica', 'aps'],
};
