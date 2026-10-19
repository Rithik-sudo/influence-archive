import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  { key: 'wiki', title: 'Katherine Johnson — Wikipedia', author: 'Wikipedia contributors', publisher: 'Wikimedia Foundation', url: 'https://en.wikipedia.org/wiki/Katherine_Johnson', type: 'website' },
  { key: 'nasa', title: 'Katherine Johnson — NASA', publisher: 'National Aeronautics and Space Administration', url: 'https://www.nasa.gov/people-of-nasa/katherine-g-johnson/', type: 'archive' },
  { key: 'loc', title: 'Katherine Johnson — Library of Congress', publisher: 'Library of Congress', url: 'https://www.loc.gov/item/n2020000781/', type: 'archive' },
];

export const katherineJohnson: SeedPerson = {
  slug: 'katherine-johnson',
  fullName: 'Katherine Johnson',
  alternateNames: ['Katherine Coleman Goble Johnson'],
  birthDate: '1918-08-26',
  birthPrecision: 'day',
  deathDate: '2020-02-25',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Mathematician', 'Aerospace technologist'],
  nationality: 'American',
  origin: { name: 'White Sulphur Springs', country: 'United States' },
  featured: true,
  wikipedia: 'Katherine_Johnson',
  summary:
    'The African-American mathematician whose hand-computed orbital trajectories made the first American crewed spaceflight possible, and who insisted that her work be checked.',
  whyItMatters:
    'The trajectories for the first American spaceflight were not produced by a machine but written out by hand, and the person who wrote them was a Black woman hired as a "computer" in a segregated, women-only pool of clerks. Katherine Johnson calculated the flight path for Freedom 7 and then checked Alan Shepard\'s and John Glenn\'s figures herself. Her insistence on verifying other people\'s work — including, unasked, the electronic computer\'s — is the more important part of the story.',
  biography: `Katherine Coleman Goble was born in White Sulphur Springs, West Virginia, on 26 August 1918, the first of three children. Her father was a prosperous businessman; her mother was a teacher, and Katherine attended the West Virginia State College, graduating in 1937 with a degree in mathematics and French. She took a teaching post and taught for nearly two decades, and in 1939 enrolled in West Virginia State for graduate courses in mathematics.

In 1953 she took a position at the Langley Research Center of the National Aeronautics and Space Administration, joining a pool of Black women — many of them teachers, and all of them segregated from the white engineers — who were given the title of "computers" and worked in an annexe. Her first assignment was to summarise trajectories from a reference work, and to check the figures of other analysts, which is where her reputation for accuracy was established.

Her calculations were used to place the first American satellites in orbit and, critically, to compute the trajectory of Alan Shepard\'s Freedom 7 in 1961. John Glenn refused to fly until his numbers had been checked, and asked for Johnson by name. When the electronic computers arrived at Langley in the early 1960s, Johnson was asked to verify their output, and did.

In 1963 she moved to NASA\'s Orbiting Research and Development Division in Mountain View, working on the mathematics of the first lunar missions, including the trajectories for the Apollo 11 Moon landing. She worked for NASA for thirty years, and in 1990 retired from the Langley's "Flight Research Division" as a "Senior Research Analyst".

She was a songwriter and a singer, and one of her songs, "Let\'s Be Free", was performed by Harry Belafonte. Her long-delayed recognition came with the publication of her biography *Hidden Figures* in 2015, and the film of the same name; she received the Presidential Medal of Freedom in 2015, and died in 2020 at the age of 101.`,
  contributions: `**The Freedom 7 trajectory (1961).** The hand-computed flight path for the first American crewed spaceflight, and the launch window that put the capsule on the correct arc.

**Verification as a discipline.** Johnson was sent to check the work of the IBM computers at Langley and did so for years, treating the machines as one more set of colleagues whose output needed to be confirmed.

**The Apollo programme.** The orbital mathematics of the early Apollo missions, including the work on the lunar trajectories in the Orbiting Research and Development Division.

**From "computer" to research analyst.** Her thirty-year career at NASA, ending with a senior technical title, and the documentation in technical reports that allowed her authorship to be established — which was necessary before it could be celebrated.`,
  ideas: 'Johnson\'s professional ethic was verification. She checked other analysts\' figures before accepting them, checked the electronic computers\' output after it arrived, and did not hesitate to publish a trajectory she believed was wrong and to say so when asked. What is striking is that she treated this as ordinary professional practice rather than as an act of defiance, even though the conditions under which she worked — segregated, in an annexe, under a job title that named the machine rather than the work — were extraordinary. Her own account of her motivation is straightforwardly intellectual: she wanted the answer to be right, and the answer did not care who computed it.',
  controversies: 'The controversy is about credit rather than about the mathematics, and it is instructive. For most of the NASA\'s history, the Black women of the "computers" pool were invisible in the public account of the space programme, and the first widely read accounts of their work did not appear until 2015. The delay had practical consequences: Johnson\'s name was not on the papers describing the trajectories, and the authorship records that would have protected it were incomplete. She herself was careful and unembarrassed about this, saying that she did the work because she wanted to do it, and that she had no interest in a fight over credit. The second strand of controversy concerns the film *Hidden Figures* itself, which has been criticised in some quarters for the liberties it takes with chronology and for the spaceflight-centre setting of the famous scene, and praised for the attention it brought. Both judgements are defensible, and they concern the representation rather than the record.',
  legacy: 'Katherine Johnson\'s biography and the recovery of the Langley "computers" have changed how the history of the American space programme is written, and how the work of women in mathematics and engineering is described generally. The group of Black women mathematicians and programmers whose work has since been reconstructed — Mary Jackson, Dorothy Vaughan, and the wider pool — were collectively the object of an oral-history project begun in 2010 and published in 2015. Johnson\'s own position is unusual in the respect that she was not an activist for recognition: she was a mathematician who wanted her arithmetic checked, and who is remembered for the checking.',
  categories: ['mathematics-engineering', 'science-technology', 'exploration-discovery'],
  tags: ['space-exploration', 'mathematics', 'aeronautics', 'civil-rights', 'statistics'],
  timeline: [
    { date: '1918-08-26', precision: 'day', title: 'Born in West Virginia', description: 'Katherine Coleman Goble is born in White Sulphur Springs, West Virginia, and attends West Virginia State College.', place: 'White Sulphur Springs', source: 'wiki' },
    { date: '1953-06-01', precision: 'year', title: 'Joins Langley', description: 'She is hired as a "computer" in the segregated pool of Black women mathematicians at the Langley Research Center.', place: 'Hampton', source: 'nasa' },
    { date: '1961-05-05', precision: 'day', title: 'Freedom 7', description: 'Her hand-computed trajectory is used for the first American crewed spaceflight; John Glenn asks for her by name to check his own figures.', place: 'Cape Canaveral', source: 'nasa' },
    { date: '1963', precision: 'year', title: 'Orbiting Research and Development Division', description: 'Johnson transfers to the division working on the first lunar missions.', place: 'Mountain View', source: 'nasa' },
    { date: '1969-07-20', precision: 'day', title: 'Apollo 11', description: 'The lunar mission whose orbital mathematics her team computed lands two people on the Moon.', place: 'Mare Tranquillitatis', source: 'nasa' },
    { date: '2015-08-26', precision: 'day', title: 'Presidential Medal of Freedom', description: 'Johnson receives the Presidential Medal of Freedom from President Obama, and receives an honorary degree from West Virginia State.', place: 'Washington', source: 'nasa' },
    { date: '2020-02-25', precision: 'day', title: 'Dies aged 101', description: 'Katherine Johnson dies in Hampton, Virginia, aged 101.', place: 'Hampton', source: 'wiki' },
  ],
  relationships: [
    { to: 'alan-turing', type: 'contemporary', description: 'Turing and Johnson worked in the same broad field of applied mathematics in the same period, and both are remembered for work that outlasted the recognition it received.', periodNote: '1940s–1960s', source: 'wiki' },
  ],
  sources: ['wiki', 'nasa', 'loc'],
};
