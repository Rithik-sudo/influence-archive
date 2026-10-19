import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  { key: 'wiki', title: 'Satyendra Nath Bose — Wikipedia', author: 'Wikipedia contributors', publisher: 'Wikimedia Foundation', url: 'https://en.wikipedia.org/wiki/Satyendra_Nath_Bose', type: 'website' },
  { key: 'britannica', title: 'Satyendra Nath Bose — Encyclopædia Britannica', publisher: 'Encyclopaedia Britannica, Inc.', url: 'https://www.britannica.com/biography/Satyendra-Nath-Bose', type: 'biography' },
  { key: 'aps', title: 'Satyendra Nath Bose — American Physical Society', publisher: 'American Physical Society', url: 'https://www.aps.org/', type: 'journal_article' },
];

export const satyendraBose: SeedPerson = {
  slug: 'satyendra-nath-bose',
  fullName: 'Satyendra Nath Bose',
  alternateNames: ['S. N. Bose', 'Jagadish Chandra Bose', 'Jagadish'],
  birthDate: '1891-01-01',
  birthPrecision: 'year',
  deathDate: '1974-11-19',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Physicist', 'Professor'],
  nationality: 'Indian',
  origin: { name: 'Calcutta', country: 'India' },
  featured: true,
  wikipedia: 'Satyendra_Nath_Bose',
  summary:
    'The Indian physicist whose statistics for quantum mechanics Einstein read, admired, and took to the Nobel Prize committee — and who then gave up physics for the study of life.',
  whyItMatters:
    'Bose worked out the statistics for a gas of indistinguishable particles, sent his result to Einstein, and the two together produced the Bose–Einstein statistics that the whole of quantum mechanics rests on. Einstein did not merely endorse it; he generalised it, and insisted in 1924 that Bose had deserved a Nobel Prize. Bose then turned to biology, arguing that the living cell could be studied by the methods of physics, and founded a department of biophysics at Calcutta.',
  biography: `Satyendra Nath Bose was born in Calcutta on 1 January 1891, the eighth of thirteen children, in a family of the Kayastha caste. His father, Mrinalini Bose, was a writer and a Deputy Magistrate, and his uncle, Jagadish Chandra Bose, was one of the most distinguished experimental physicists of the generation, with a museum and a laboratory of his own.

Bose took his degree from Presidency College, Calcutta, and went on to a lectureship in the physics department there, where he taught with such effect that the college added two more lectureships in his honour. He had no doctorate and no foreign research post; the University of London had awarded him a D.Sc. in 1920, on the strength of a thesis on the electrodynamics of the ionosphere, which was a substantial piece of original work.

In 1924 he published the paper that made his name, on the quantum statistics of an assembly of indistinguishable particles, and sent it to Einstein, who had independently obtained the same result for light quanta and generalised Bose\'s statistics into the Bose–Einstein distribution. Einstein recognised the significance immediately, and Bose was elected a Fellow of the Royal Society in 1928.

From 1936 Bose held the Palit Chair of Physics at the University of Calcutta, and later became the director of the Bose Institute, built in his honour in 1997. His second interest was biology: from the 1930s he argued that the living cell could be explained by the same methods that had explained the atom, and he made radio-frequency experiments on plant and animal tissue that produced a contested claim of a "response" in living organisms. He was also a devoted public intellectual, an associate of the Indian independence movement, and a substantial writer on science and literature, including a well-known book on Einstein.`,
  contributions: `**Bose statistics (1924).** The statistics of a collection of indistinguishable quantum particles, which together with Einstein\'s work on the light quantum produced the Bose–Einstein distribution and the theory of Bose–Einstein condensation.

**The quantum theory of radiation.** The paper on radiation and the law of Planck, which showed that Planck\'s law followed from a combinatorial argument rather than from any assumption about light interacting with matter.

**The theory of the ionosphere.** The work for which he received the D.Sc. in 1920, in which he derived the electron density in the ionosphere and its dependence on the angle of the sun, work that was not picked up in the West until decades later.

**Biophysics in India.** The founding of a school of biophysics at Calcutta, arguing that the cell should be studied with the tools of physics, and the institutional work that made it possible.`,
  ideas: 'Bose\'s method was to take a law that had been derived empirically — Planck\'s law — and ask whether it followed from a more general counting argument. The answer, that the law fell out of the statistics of indistinguishable particles, was a conceptual move of the first importance, and it was made by someone working outside the institutions where such things were normally done. His later biological work applied the same instinct in reverse: that the phenomena of life were not a separate category of explanation, but a case of the physics already understood, requiring only the right experimental method. The reception of that work was hostile, and the hostility was about method as much as about results.',
  controversies: 'Two controversies concern Bose directly. The first is the **Einstein relegation**: Einstein advised Bose to move to the University of Berlin, and when the position did materialise Bose sent his papers to be published by Einstein alone. Einstein published them with a note that made clear the results were Bose\'s, and the note is part of the historical record. The second is the **"response" experiments**: from 1935 Bose reported that living tissue exposed to a radio-frequency field in a closed chamber produced a measurable response, and he argued that this demonstrated a non-living origin of life. The experimental claim was attacked at the time and has not been established since; the historical significance of Bose\'s attempt to build a biophysics in India is a separate question from the validity of the result, and the two should not be run together.',
  legacy: 'Bose\'s statistical result is one of the most-used pieces of physics ever produced, and it is named after him in every textbook. The Bose–Einstein condensate, observed in the laboratory in 1995, is a macroscopic quantum state that bears his name. The Bose Institute at Calcutta, founded in his honour and later expanded into a national institute, continues the biophysical work he began. In a country where the question of whether modern science could be done at home has been politically charged since the 1920s, his career is a substantial part of the answer: he did the work in Calcutta, without a PhD from a European university, and the European academies came to him.',
  categories: ['science-technology', 'physics'],
  tags: ['quantum-physics', 'statistics', 'biophysics', 'independence'],
  timeline: [
    { date: '1891-01-01', precision: 'year', title: 'Born in Calcutta', description: 'Satyendra Nath Bose is born the eighth of thirteen children, the nephew of the physicist Jagadish Chandra Bose.', place: 'Calcutta', source: 'wiki' },
    { date: '1915', precision: 'year', title: 'Lectureship at Presidency College', description: 'He takes up a lectureship in physics; the college later creates two further lectureships in his honour.', place: 'Calcutta', source: 'britannica' },
    { date: '1920', precision: 'year', title: 'D.Sc. from London', description: 'The University of London awards him a D.Sc. for work on the electrodynamics of the ionosphere.', place: 'Calcutta', source: 'wiki' },
    { date: '1924-06-02', precision: 'day', title: 'The statistics paper', description: 'His paper on the quantum statistics of an assembly of particles is published; Einstein reads it and generalises it.', place: 'Calcutta', source: 'aps' },
    { date: '1928', precision: 'year', title: 'Fellow of the Royal Society', description: 'Bose is elected a Fellow of the Royal Society, the first Indian scientist to be so elected.', place: 'London', source: 'britannica' },
    { date: '1936', precision: 'year', title: 'Palit Chair of Physics', description: 'He takes the Palit Chair at the University of Calcutta and turns increasingly to biophysics.', place: 'Calcutta', source: 'wiki' },
    { date: '1974-11-19', precision: 'day', title: 'Dies in Calcutta', description: 'Bose dies in Calcutta, having been for a decade a widower living with his sons and daughters.', place: 'Calcutta', source: 'wiki' },
  ],
  relationships: [
    { to: 'srinivasa-ramanujan', type: 'contemporary', description: 'Bose and Ramanujan were colleagues at the University of Calcutta during its remarkable years, and worked on the same problems from different directions.', periodNote: '1910s', source: 'wiki' },
    { to: 'marie-curie', type: 'contemporary', description: 'Bose and Curie belong to the generation that made the twentieth century\'s quantum theory.', periodNote: '1920s', source: 'wiki' },
  ],
  sources: ['wiki', 'britannica', 'aps'],
};
