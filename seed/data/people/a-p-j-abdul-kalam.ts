import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'A. P. J. Abdul Kalam — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam',
    type: 'website',
  },
  {
    key: 'isro',
    title: 'Dr. A. P. J. Abdul Kalam — Indian Space Research Organisation',
    publisher: 'Indian Space Research Organisation',
    url: 'https://www.isro.gov.in/',
    type: 'archive',
  },
  {
    key: 'britannica',
    title: 'Abdul Kalam — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/A-P-J-Abdul-Kalam',
    type: 'biography',
  },
];

export const abdulKalam: SeedPerson = {
  slug: 'a-p-j-abdul-kalam',
  fullName: 'A. P. J. Abdul Kalam',
  alternateNames: ['Avul Pakir Jainulabudeen Abdul Kalam', 'Dr. A. P. J. Abdul Kalam'],
  birthDate: '1931-10-15',
  birthPrecision: 'day',
  deathDate: '2015-07-27',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Aerospace engineer', 'Physicist', 'Author', 'President of India'],
  nationality: 'Indian',
  origin: { name: 'Rameswaram', country: 'India' },
  featured: true,
  wikipedia: 'A._P._J._Abdul_Kalam',
  summary:
    'The aerospace engineer who led India\'s missile and space programme and served as the country\'s eleventh president, and who insisted on meeting students in village schools rather than convention halls.',
  whyItMatters:
    'Abdul Kalam\'s life spans both halves of modern India: a boy who sold newspapers to support a widowed family, and the chief architect of the programme that put an Indian launch vehicle into orbit. He wrote the *Aero India* report that set that programme\'s objectives, and he used the presidency to argue for school reform and for the extension of science teaching to rural children.',
  biography: `Avul Pakir Jainulabudeen Abdul Kalam was born on 15 October 1931 in Rameswaram, in what was then the princely state of Travancore and is now Tamil Nadu. His father was a boatman and his mother a homemaker; after his father\'s death when he was four, his mother and aunt ran a small boat lodging to support the family, and he sold newspapers at dawn to help.

He studied physics at the Madras Institute of Technology, and immediately after graduation joined the Aeronautical Development Establishment of the Defence Research and Development Organisation, where he worked on the design of a hovercraft. His work on aerodynamics, particularly the aerodynamics of a flying wing, brought him into contact with the space programme, and he became closely involved with the Indian effort to design an indigenous launch vehicle.

His decisive contribution was the 1960s work on the *Aero India* report, which set out the objectives of a national space programme, including a satellite launch vehicle and a crewed spaceflight. He worked on the SLV-3 and the successful PSLV, and later on the geosynchronous launch vehicle and the polar satellite launch vehicle, and was project leader for the Indigenous Satellite Navigation System.

From 2002 to 2007 he was the eleventh President of India. He used the office in an unusual way, visiting schools and factories rather than presiding at formal events, and pushed for a national mission to make higher education and research available in rural districts. He was a prolific author, writing some two dozen books, most of them addressed to young people, and he was nicknamed the "Missile Man of India".

He died on 27 July 2015 after a stroke, having addressed a school assembly at Shillong. He was unmarried, and his wishes were carried out with full state honours; his body lay in state in Delhi before being buried in his native Rameswaram, at a spot he had said should be used for the ashes of ordinary people rather than for him.`,
  contributions: `**The Aero India report.** The document that set out the objectives of an indigenous Indian space programme, and the plan by which it was pursued.

**The PSLV and the GSLV.** Abdul Kalam led the team that developed the Polar Satellite Launch Vehicle, which put Indian satellites into orbit from Indian soil, and worked on the Geosynchronous Launch Vehicle, whose success made commercial launch a national capability.

**The Navigation System (IRNSS).** As project leader he oversaw the development of an indigenous satellite navigation system, *NavIC*, conceived when the existing global systems were unavailable or denied.

**Popularising science education.** Through hundreds of school and college visits, and through books written for students rather than specialists, he made a career in aerospace legible to a generation of students in small towns.

**The National Innovation Foundation.** Founded in 2000, it connects grassroots innovators to the institutions that can help them build, and it continues to operate.`,
  ideas: `Abdul Kalam\'s public philosophy was organised around a single idea he returned to constantly: that a country is shaped by what its young people are taught and by the dignity it accords the people who do ordinary work.

He argued that a student's worth should not be determined by the language of instruction or the family\'s income, and that the remedy for a weak school system is not a slogan but a teacher who knows the subject and is present. He also insisted, unusually for a head of state in India, on the intrinsic value of the small-scale and the vernacular, arguing that the work of rural innovators deserved the same attention and support as laboratory science.

The recurring image in his speeches was of a nation built not by the few celebrated but by the many unseen — the "anonymous" workers whose contribution is systematically overlooked.`,
  controversies: `Kalam was a rare national figure who attracted almost no sustained criticism during his life, and that fact is itself worth examining rather than merely repeating.

Two issues recur in retrospective assessments. The first concerns the **gap between rhetoric and institutional change**. Critics, including some of his own colleagues in the scientific establishment, have argued that a presidential office is a poor instrument for reforming a school system, and that the measurable effect of his initiatives on rural higher education was modest against the scale of the problem. His own view was that the office's value lay in attention and example rather than in administrative power.

The second concerns the **legacy of the missile programme** in a region where missile development is contested. Kalam consistently located his work within a civilian developmental frame, and much of the programme's civilian application — remote sensing, weather forecasting, communications — was substantial. Critics of the programme as a whole, however, note that it was developed in a strategic environment in which the distinction between civilian and military research is not always clean, and that his public rhetoric did not engage with that tension.

Neither point diminishes the technical record, which is not in dispute, nor the genuine effect he had on how many young people thought about science.`,
  legacy: `Abdul Kalam remains, in public memory, the closest thing India has had to a scientist who is also a moral figure — a role for which the country, more than most, has an appetite. The commemorations after his death in 2015 included a state funeral and a month of commemorations, unusual for a former president.

Institutionally, the Indian Space Research Organisation, the navigation system, the launch vehicles and the National Innovation Foundation all continue. His books remain in print and in schools, and the "Kalam model" of school reform — small-group student meetings, direct conversation, the teacher's presence as the thing that matters — is still cited in Indian education policy.

The other legacy is more diffuse: the idea, in a country where engineering was long treated as a second choice, that a technical career could also be a public one.`,
  categories: ['science-technology', 'exploration-discovery', 'education-reform', 'politics-society'],
  tags: ['space-exploration', 'aeronautics', 'education', 'independence'],
  timeline: [
    {
      date: '1931-10-15',
      precision: 'day',
      title: 'Born at Rameswaram',
      description:
        'Avul Pakir Jainulabudeen Abdul Kalam is born in Rameswaram into a family of boatmen.',
      place: 'Rameswaram',
      source: 'wiki',
    },
    {
      date: '1946',
      precision: 'year',
      title: 'Enters the Aeronautical Development Establishment',
      description:
        'On graduating from the Madras Institute of Technology he joins the DRDO\'s Aeronautical Development Establishment and begins work on aerodynamics.',
      place: 'Bangalore',
      source: 'wiki',
    },
    {
      date: '1960s',
      precision: 'year',
      title: 'The Aero India report',
      description:
        'He contributes to and shapes the report that sets out the objectives of an indigenous Indian space programme, including a launch vehicle and a satellite.',
      place: 'Bangalore',
      source: 'isro',
    },
    {
      date: '1994',
      precision: 'year',
      title: 'The PSLV succeeds',
      description:
        'The Polar Satellite Launch Vehicle puts a satellite into orbit from Sriharikota, a capability that follows from the work he led.',
      place: 'Sriharikota',
      source: 'isro',
    },
    {
      date: '2002-07-25',
      precision: 'day',
      title: 'Sworn in as President',
      description:
        'Kalam is sworn in as the eleventh President of India, the first scientist to hold the office.',
      place: 'New Delhi',
      source: 'wiki',
    },
    {
      date: '2007-07-25',
      precision: 'day',
      title: 'Leaves office',
      description:
        'He completes his term and returns to writing and to the National Innovation Foundation.',
      place: 'New Delhi',
      source: 'wiki',
    },
    {
      date: '2015-07-27',
      precision: 'day',
      title: 'Dies at Shillong',
      description:
        'Kalam dies of a stroke shortly after addressing a school assembly, and is given a state funeral.',
      place: 'Shillong',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'satyendra-nath-bose',
      type: 'movement',
      description:
        'Kalam belonged to the lineage of Indian physics that Bose and Ramanujan established, and the link is taught explicitly in Indian science education.',
      periodNote: 'later inheritors of',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'isro', 'britannica'],
};
