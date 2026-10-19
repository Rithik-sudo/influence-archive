import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  { key: 'wiki', title: 'Frida Kahlo — Wikipedia', author: 'Wikipedia contributors', publisher: 'Wikimedia Foundation', url: 'https://en.wikipedia.org/wiki/Frida_Kahlo', type: 'website' },
  { key: 'britannica', title: 'Frida Kahlo — Encyclopædia Britannica', publisher: 'Encyclopaedia Britannica, Inc.', url: 'https://www.britannica.com/biography/Frida-Kahlo', type: 'biography' },
  { key: 'moma', title: 'Frida Kahlo — Museum of Modern Art', publisher: 'The Museum of Modern Art', url: 'https://www.moma.org/artists/2464', type: 'archive' },
];

export const fridaKahlo: SeedPerson = {
  slug: 'frida-kahlo',
  fullName: 'Frida Kahlo',
  alternateNames: ['Frida Kahlo Rivera', 'Magdalena Carmen Frida Kahlo y Calderón'],
  birthDate: '1907-07-06',
  birthPrecision: 'day',
  deathDate: '1954-07-13',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Painter', 'Printmaker'],
  nationality: 'Mexican',
  origin: { name: 'Coyoacán', country: 'Mexico' },
  featured: true,
  wikipedia: 'Frida_Kahlo',
  summary:
    'The Mexican painter who turned a life of severe physical pain into one of the most self-aware and influential bodies of twentieth-century art.',
  whyItMatters:
    'Kahlo painted at the scale of an altarpiece and refused every convention that would have softened her subject matter. Her self-portraits, which she painted in the hundreds, are not vanity or confession but argument: a way of placing a body that was both politically and physically invaded at the centre of a Mexican history that did not usually put women there. She has become, in the long run, the most institutionally powerful artist of the twentieth century — and a contested one.',
  biography: `Magdalena Carmen Frida Kahlo y Calderón was born on 6 July 1907 in the Casa Azul in Coyoacán, on the outskirts of Mexico City. She was the seventh of seven children of a German-Mexican photographer, Guillermo Kahlo, and a Mexican mestiza of indigenous and Spanish descent. At six she was given the name Frida in honour of her paternal grandmother.

In 1918 a tram accident fractured her pelvis, collarbone and leg, and left her with a chronic pain that would shape her entire working life. During a long convalescence she began to paint, and her mother supplied her with a mirror and a bed easel. Two years later she was admitted to the School of Fine Arts, where the curriculum was dominated by European academic painting and Mexican easel painting of the Rivera and Orozco kind.

In 1922 she married Diego Rivera, the painter of murals who was at that moment at the centre of Mexican nationalism, and moved between Mexico City, San Francisco and New York. Rivera's large public murals and her small, densely worked, unforgiving self-portraits make an instructive pair: his are addressed to a nation, hers to a body.

Her work was shown in New York by the Julien Levy Gallery in 1939, and later in Paris and London, and she was painted by Rivera, by Tina Modotti, and by the photographer Guillermo Kahlo. The 1938 exhibition in New York was attended by André Breton, and Kahlo was exhibited in the 1940 "International Surrealist Exhibition" in New York, though she had no interest in joining the movement and said so.

Her last painting, completed in the weeks before her death, was *Self-Portrait with the Monkey and Parrot*. She died in Mexico City on 13 July 1954, of a pulmonary embolism, and was buried in the Panteón de San Fernando, where she had asked to be laid beside her parents.`,
  contributions: `**The self-portrait as argument.** Kahlo made herself the subject of more than a hundred paintings. In them the body is shown damaged, bleeding, split open by corsets, or held together by surgical hardware — and is not offered for pity.

**A Mexican subject without condescension.** Her work refused the folkloric expectations of the tourist market and of the Mexican muralists, insisting on the specificity and difficulty of a woman\'s experience of Mexico rather than its generalised symbols.

**A new internationalism.** The Julien Levy exhibition of 1939 and the surrealist exhibitions that followed it made Mexican art visible in New York and Paris at a time when the question of what modern art could be was still live.

**Abridging.** *The Two Fridas* (1939) — two seated figures sharing a single heart, one European and one Mexican, joined by a broken artery — is among the most widely reproduced paintings in modern art, and one of the most concentrated.`,
  ideas: `Kahlo\'s subject matter is the body as a site of politics. Injury, anaesthesia, childbirth, amputation, the pain of a damaged spine and an operated foot: these are not metaphors in her work but its actual conditions, and the paintings refuse the consolation of metaphor.

The second theme is Mexicanness without sentimentality. The Tehuana dress, the Día de Muertos, the *Tehuana* figures of her later career, and the folk art she collected with the help of a dealer in Ollin Groceries in New York, are used to build an identity that is neither the state\'s official nationalism nor the tourist\'s fantasy.

Her own statement of method is the most quoted line in her writing: "I paint myself because I am so often alone."`,
  controversies: 'Three controversies are worth naming. The first concerns the commodification of her image. The production of Frida Kahlo merchandise, and the use of her likeness in advertising, is now a substantial business, and there is a long scholarly and critical debate about how much of the global fame is the work\'s and how much is the image\'s. Kahlo herself was commercially active to a degree her reputation obscures — she sold prints and small works to survive, and gave interviews. The second concerns her politics. She was committed to the Mexican Revolution\'s programme of land reform and to the Communist Party, and left the latter in 1954, but her 1930s works have been read, often reductively, as allegories of Mexican nationalism. The third concerns the bodily and personal content of the work, and the long argument in art history and criticism about whether the pain is political statement or symptom.',
  legacy: 'Kahlo\'s posthumous reputation is the largest in the history of art, and it has not been a purely celebratory development. The Casa Azul in Coyoacán, opened as a museum in 1958, is among the most visited in the Americas, and her work hangs in the permanent collections of the Louvre, the Tate, MoMA and the Museo de Arte Moderno in Mexico City. In 2018 she became the first woman whose work was auctioned for over a hundred million dollars, and the Frank Gehry-designed museum in Mexico City, opened in 2024, continues the institutional presence.',
  categories: ['art-culture', 'visual-arts'],
  tags: ['painting', 'modernism', 'womens-rights', 'revolution'],
  timeline: [
    { date: '1907-07-06', precision: 'day', title: 'Born in Coyoacán', description: 'Magdalena Carmen Frida Kahlo y Calderón is born in the Casa Azul, the seventh of seven children.', place: 'Coyoacán', source: 'wiki' },
    { date: '1918-09-13', precision: 'day', title: 'Tram accident', description: 'A tram strikes the bus she is riding, fracturing her pelvis, collarbone and leg, and beginning a lifelong struggle with pain.', place: 'Mexico City', source: 'britannica' },
    { date: '1919', precision: 'year', title: 'Begins to paint', description: 'During a long convalescence she begins painting, using a mirror and a bed easel supplied by her mother.', place: 'Mexico City', source: 'wiki' },
    { date: '1922', precision: 'year', title: 'Marries Diego Rivera', description: 'She marries the muralist Diego Rivera, and the two move between Mexico City, San Francisco and New York.', place: 'Mexico City', source: 'wiki' },
    { date: '1939', precision: 'year', title: 'New York exhibition', description: 'The Julien Levy Gallery exhibits her work in New York, and she is painted and photographed by Rivera and Modotti.', place: 'New York', source: 'moma' },
    { date: '1939', precision: 'year', title: 'The Two Fridas', description: 'The painting is completed in San Francisco, and is shown in New York the following year.', place: 'San Francisco', source: 'moma' },
    { date: '1954-07-13', precision: 'day', title: 'Dies', description: 'Kahlo dies of a pulmonary embolism in Mexico City, and is buried in the Panteón de San Fernando as she had wished.', place: 'Mexico City', source: 'wiki' },
  ],
  relationships: [],
  sources: ['wiki', 'britannica', 'moma'],
};
