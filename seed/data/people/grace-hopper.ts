import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  { key: 'wiki', title: 'Grace Hopper — Wikipedia', author: 'Wikipedia contributors', publisher: 'Wikimedia Foundation', url: 'https://en.wikipedia.org/wiki/Grace_Hopper', type: 'website' },
  { key: 'chm', title: 'Grace Hopper — Computer History Museum', publisher: 'Computer History Museum', url: 'https://www.computerhistory.org/collections/catalog/102726649', type: 'archive' },
  { key: 'navy', title: 'Grace Murray Hopper — United States Navy', publisher: 'United States Navy', url: 'https://www.navy.mil/', type: 'archive' },
];

export const graceHopper: SeedPerson = {
  slug: 'grace-hopper',
  fullName: 'Grace Hopper',
  alternateNames: ['Grace Murray Hopper', 'Amazing Grace', 'Rear Admiral Grace Hopper'],
  birthDate: '1906-12-09',
  birthPrecision: 'day',
  deathDate: '1992-01-01',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Computer scientist', 'Rear admiral', 'Programmer', 'Naval engineer'],
  nationality: 'American',
  origin: { name: 'New York City', country: 'United States' },
  featured: true,
  wikipedia: 'Grace_Hopper',
  summary:
    'The American computer scientist who wrote the first compiler and argued that programs should be written in something closer to English than to machine code.',
  whyItMatters:
    'Hopper demonstrated in 1952 that a machine could be programmed in something resembling English, by writing the first compiler — the program that translates a higher-level language into machine instructions. That single demonstration opened the door to every programming language in use since. She also helped design the compiler that ran the first English-language program on a US Navy computer, and became the most visible public face of computing for two decades.',
  biography: `Grace Brewster Murray was born in New York City on 9 December 1906, to Walter Fletcher Murray, an insurance broker with an interest in the natural sciences, and Mary Campbell Van Horne, who had studied mathematics. She was unusually well educated from childhood: she attended the Brooklyn Latin School alongside future physicists, and her mother took her to the Museum of Natural History and the Bronx Zoo, where she first encountered a planetarium.

She graduated from Vassar in 1928 with a degree in mathematics and physics and went on to Yale for a doctorate, which in 1934 was the first in physics awarded to a woman there. She taught at Vassar and at Princeton's Institute for Advanced Study, and in 1943 took a commission in the Navy Reserve, where she was assigned to the Bureau of Ships Computation Project at Harvard.

There she worked on the Harvard Mark I, a room-sized electromechanical calculator, programming it with a team of women including Jean Bartik, whose work has been substantially recovered in recent decades. In 1949 Hopper proposed a machine-independent language, and in 1952 she and her team produced the first compiler, the A-0 system, translating a notation resembling English into machine code.

The practical demonstration came at UNIVAC, where Hopper's team built the first English-like language compiler in production use, FLOW-MATIC, in 1955; the later COBOL specifications, which she helped write, were designed to be readable by non-specialists. Her argument was simple and radical: if a machine can be taught to understand a statement, then the barrier between the person with an idea and the machine is not a technical one but an educational one.

She was twice president of the American Association for the Advancement of Science, and in 1966 she received the Eckert-Mauchly Award for the first time it was presented. She remained in the Navy Reserve until her death, being promoted to rear admiral, and became a media figure as the " grandmother of computing" — appearing on *The Tonight Show* and on the cover of *Time*. She died on 1 January 1992, at home in Arlington, Virginia, and was buried with full military honours at the Arlington National Cemetery, where her grave is marked with a plaque from the United States Naval Academy.`,
  contributions: `**The first compiler (1952).** The A-0 system translated a notation resembling English into machine code, demonstrating for the first time that a computer could be programmed in a language other than the machine\'s own.

**FLOW-MATIC (1955).** The first English-like compiler in production use, at UNIVAC, and the direct ancestor of the business languages that followed.

**COBOL (1959).** Hopper led the technical committee that designed COBOL, the first widely used high-level language, and which was written to be readable by people who were not computer specialists — a design goal that is still quoted approvingly.

**The compiler language (1952).** She also developed the idea of a machine-independent intermediate language, which anticipated the portability of compiled software.

**The public argument.** Her insistence that programming was a form of communication rather than a form of clerical work shaped how the profession described itself, and made the case for computing as an intellectual discipline.`,
  ideas: 'Hopper\'s central claim was that the difference between a person and a machine was not a wall but a language barrier, and that the barrier was temporary and pedagogic. If a machine could be taught to understand statements, then the skill required to use it was ordinary literacy rather than a specialism. She argued, in lectures and on television, that the shortage of programmers was a shortage of teaching, not a shortage of people. She also insisted on the intellectual seriousness of the work: a program was a statement of method, and debugging a program was a statement of method that could be wrong, which made computing a discipline in which thinking could be tested.',
  controversies: 'Two themes recur in discussion of Hopper. The first is credit. Her contribution to the first compiler was substantial and is not in serious dispute, but for most of the twentieth century the story of the compiler was told without her name, and the recovery of the wartime programming team — Jean Bartik, Betty Holberton, Klara von Neumann, and others — that began in the 1980s has been a parallel and continuing correction. Hopper herself was not sentimental about this, and said publicly that she had been lucky to be in the room. The second is the myth of the grandmother. The image of Hopper as a folksy grandmother figure has been read by historians as a way of domesticating a sharply technical argument, and as having been useful to a computing industry that wanted to present itself as friendly and non-threatening. She was considerably more combative than the image suggests.',
  legacy: 'The practical legacy is the language business: every high-level language in use descends from the demonstration that she and her team made, and the COBOL applications that ran the world\'s banks and governments for three decades descend directly from the design work she led. The institutional legacy is the Naval Postgraduate School\'s Grace Hopper Professorship, and the Navy\'s decision to name a future destroyer after her, announced in 2021. The cultural legacy is the argument she won: that programming is a form of writing, that writing is a form of thinking, and that the people who do it are not technicians but authors.',
  categories: ['science-technology', 'computing'],
  tags: ['computing', 'programming-languages', 'navy', 'women-in-science'],
  timeline: [
    { date: '1906-12-09', precision: 'day', title: 'Born in New York City', description: 'Grace Brewster Murray is born to Walter Murray, an insurance broker interested in natural science, and Mary Van Horne.', place: 'New York City', source: 'wiki' },
    { date: '1934', precision: 'year', title: 'Doctorate from Yale', description: 'She receives a PhD in physics from Yale, the first awarded to a woman by the university.', place: 'New Haven', source: 'wiki' },
    { date: '1943', precision: 'year', title: 'Joins the Navy Reserve', description: 'Hopper is commissioned and assigned to the Bureau of Ships Computation Project at Harvard, working on the Mark I.', place: 'Cambridge', source: 'navy' },
    { date: '1952', precision: 'year', title: 'The first compiler', description: 'She and her team complete the A-0 system, the first compiler, translating a notation resembling English into machine code.', place: 'Cambridge', source: 'chm' },
    { date: '1955', precision: 'year', title: 'FLOW-MATIC', description: 'The first English-like compiler in production use is completed at UNIVAC.', place: 'Philadelphia', source: 'chm' },
    { date: '1959', precision: 'year', title: 'COBOL', description: 'Hopper chairs the committee that designs COBOL, the first widely used high-level language.', place: 'New York', source: 'chm' },
    { date: '1992-01-01', precision: 'day', title: 'Dies', description: 'Rear Admiral Grace Hopper dies at home in Arlington, Virginia, and is buried at Arlington National Cemetery.', place: 'Arlington', source: 'wiki' },
  ],
  relationships: [
    { to: 'alan-turing', type: 'movement', description: 'Hopper took the theoretical machine Turing described and made it programmable in something approaching ordinary language.', periodNote: '1950s', source: 'chm' },
    { to: 'ada-lovelace', type: 'movement', description: 'She and Lovelace are the two most frequently cited figures in the long argument about what a machine can be told to do.', periodNote: 'separated by a century', source: 'chm' },
  ],
  sources: ['wiki', 'chm', 'navy'],
};
