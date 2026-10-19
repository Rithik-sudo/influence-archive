import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'B. R. Ambedkar — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/B._R._Ambedkar',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Bhimrao Ramji Ambedkar — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Bhimrao-Ramji-Ambedkar',
    type: 'biography',
  },
  {
    key: 'constitution',
    title: 'Constitution of India — Legislative Department, Government of India',
    publisher: 'Government of India',
    url: 'https://legislative.gov.in/constitution-of-india/',
    type: 'primary_document',
  },
  {
    key: 'navyug',
    title: 'Dr. B. R. Ambedkar — Ministry of Social Justice and Empowerment',
    publisher: 'Government of India',
    url: 'https://socialjustice.gov.in/',
    type: 'archive',
  },
];

export const ambedkar: SeedPerson = {
  slug: 'b-r-ambedkar',
  fullName: 'B. R. Ambedkar',
  alternateNames: [
    'Bhimrao Ramji Ambedkar',
    'B. R. Ambedkar',
    'Dr. Bhimrao Ambedkar',
  ],
  birthDate: '1891-04-14',
  birthPrecision: 'day',
  deathDate: '1956-12-06',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Jurist', 'Social reformer', 'Politician', 'Economist', 'Editor'],
  nationality: 'Indian',
  origin: { name: 'Mhow', country: 'India' },
  featured: true,
  wikipedia: 'B._R._Ambedkar',
  summary:
    'The Indian jurist and social reformer who spent his life attacking caste, drafted the constitution of independent India, and argued that political power without economic power is meaningless.',
  whyItMatters:
    'Ambedkar changed the terms on which a quarter of humanity organised its society. His *Annihilation of Caste* dismantled the ideological basis of untouchability in an argument that is still the starting point for Indian debates on caste; his constitution-making turned a prohibition on caste into an enforceable constitutional guarantee; and his economic analysis — political power without economic power is meaningless — is the sharpest statement of why political rights alone did not end caste.',
  biography: `Bhimrao Ramji Ambedkar was born on 14 April 1891 at Mhow, in what is now Madhya Pradesh, the thirteenth and last child of a family from the Mahar community. His childhood was spent in a place where his family's occupation determined where they could live, what water they could draw, and which temple they could enter. He was the first in his family to go to school, and the first to go to university.

He went to Elphinstone College in Bombay and then to the London School of Economics, and returned to India in 1918 with a doctorate from Columbia University, having written a dissertation on the political economy of provincial government in British India. He had already begun his life's work in 1916, when he published the paper that made his name in India, *Castes in India: Their Economic, Social and Political Aspect*.

Ambedkar's method was to take the moral argument out of the legal argument. He argued that the prohibition on untouchability was enshrined in a text — the *Manusmriti* — and was therefore a human institution, historically contingent and legally alterable, rather than a divine order. That reframing made untouchability attackable in a society where religious argument could not be settled.

He founded the Bahishkrit Hitakarini Sabha in 1927, the Independent Labour Party, and the Dalit Panthers later; he edited the newspaper *Mooknayak* and its English version *Bhim*, and he was largely responsible for the *Bahishkrit*, the first Dalit newspaper in Maharashtra.

In 1932 he led the Mahad Satyagraha at Kalaram, a temple where Mahar castes were forbidden to enter, and when the resulting Crowning Ordinance was overturned he studied the *Dawn of the Buddha*, a 14-volume Buddhist canon, and on 14 October 1956, weeks before his death, led roughly half a million of his followers into the Buddhist *Navayana* tradition.

In 1947 he was appointed chairman of the Drafting Committee of the Constituent Assembly, and the constitution he produced is the longest written constitution in the world, with an explicit guarantee against untouchability, a provision for reservations, and a Directive Principles of State Policy that gave the state a positive economic role.

He was also a member of the Constituent Assembly and of the first Cabinet, and as Minister of Law he introduced the Hindu Code Bill, which was withdrawn after opposition and passed piecemeal years after his death. He was nominated to the Rajya Sabha in 1952, the first Indian to be so appointed.`,
  contributions: `**Annihilation of Caste (1933).** A pamphlet delivered as a series of lectures, and still the sharpest written attack on the ideology of untouchability. It argues that caste is a system of enclosed classes maintained by economic and political power, and that its authority derives from a text that can be questioned.

**The Indian Constitution (1950).** As chairman of the Drafting Committee, Ambedkar wrote the constitutional framework, including the abolition of untouchability, reservations, and the Directive Principles — a document that governs the world's largest democracy and has been adopted, in whole or in part, by many others.

**The Hindu Code Bill (1951).** A unified personal-law code for Hindus covering marriage, divorce, inheritance, adoption and maintenance, which he carried alone in Parliament and which was defeated by opposition, then enacted in pieces after his death.

**Economic analysis of caste.** His insistence that political rights without economic rights leave the substance of caste untouched — expressed in his later work on the *"annihilation of caste"* as a continuing economic question — reframed Indian politics around the relation between representation and property.

**Public administration and labour organisation.** He built the Labour Party, argued for the legal recognition of trade unions and collective bargaining, and served as Labour Member in the first Cabinet.`,
  ideas: `Ambedkar's method throughout was to move a question out of the realm of inherited authority and into the realm of argument. Caste could not be reformed from within, because the religious framework that justified it could not be questioned while untouchability was treated as scripture; it had to be dismantled as a human arrangement with identifiable economic interests behind it.

The second theme is the relation between legal form and social reality. A law that prohibits a practice does not end it, and a constitution that guarantees rights does not deliver them. Ambedkar's Directive Principles were an attempt to build the economic and social floor beneath formal equality, and his reservations were an attempt to make formal equality mean something for people who had been excluded from it for generations.

The third is a refusal of symbolic inclusion. He repeatedly declined honours and offices that would have made him a respected exception rather than a threat to the system, and he argued that the test of a reform is not whether the reform's beneficiaries approve of it.`,
  controversies: `Ambedkar's work attracts genuine scholarly disagreement, and some of it comes from those who share his aims.

The most substantial debate concerns his **religious diagnosis**. Critics within the Dalit movement — thinkers such as Periyar, and later Ambedkarite critics — argue that the *Annihilation of Caste* over-emphasises Buddhism and Hindu texts as the source of oppression, and under-emphasises the material relations of land, labour and capital that Ambedkar himself later made central. Ambedkar himself moved, over the course of his life, towards a more economic analysis, and it is not clear that the pamphlet captures the full development of his thought.

A second controversy concerns his **relationship to the Congress party and to nationalism**. Ambedkar was a member of the non-Brahmin movement and repeatedly contested Congress's handling of the question of representation, and he opposed separate electorates for the Depressed Classes once the Poona Pact had replaced them with reserved seats within a joint electorate. Historians continue to debate whether this was a tactical withdrawal from a battle already lost, or a shift away from a principle he had held.

A third concerns his **relationship to Buddhism**: whether his turn in 1956 was a culmination, a pragmatic move, or a shift away from the secular constitutionalism he had championed. The evidence supports more than one reading.

A final matter of record: Ambedkar was a forceful opponent of the Quit India movement, arguing that leaving the British without transferring power would risk a violent and unjust settlement. That position was unpopular then and remains contested.`,
  legacy: `The Indian Constitution's guarantee against untouchability, its reservation provisions and its Directive Principles are the working legacy of Ambedkar's life, and they have been the framework of Indian constitutional litigation for seven decades. The *Annihilation of Caste* has been translated, taught and disputed for nearly a century.

His economic argument has been picked up by later movements — Dalit Panthers, the Dalit Mahadh Satyagraha movements, and a substantial body of Dalit political economy — which have asked whether legal reform without land reform and without control over capital can end caste in practice.

The 14 October 1956 conversion remains the single largest religious conversion in modern Indian history, and the *Bahishkrit Hitakarini Sabha* and the institutions he built — the Siddharth College, the People's Education Society — outlasted him and still operate in Mumbai and Nagpur.

In 1990, the year he was posthumously awarded the Bharat Ratna, his memorial at Chaupar became the site of repeated Dalit assertions, including the 2018 agitation to install him among the twelve reserved monument figures at Parliament.`,
  categories: ['activism-social-change', 'politics-society', 'education-reform', 'civil-rights'],
  tags: ['caste', 'civil-rights', 'education', 'independence', 'constitution'],
  timeline: [
    {
      date: '1891-04-14',
      precision: 'day',
      title: 'Born at Mhow',
      description:
        'Bhimrao Ramji Ambedkar is born the thirteenth and last child of a Mahar family, in a cantonment where his family\'s status determined where they could live and draw water.',
      place: 'Mhow',
      source: 'wiki',
    },
    {
      date: '1907',
      precision: 'year',
      title: 'First in the family to attend school',
      description:
        'The Maharaja of Baroda opens a school for Mahar children at the suggestion of the local administrator, and Ambedkar is among the first to attend.',
      place: 'Mhow',
      source: 'wiki',
    },
    {
      date: '1916',
      precision: 'year',
      title: 'Castes in India',
      description:
        'He presents "Castes in India: Their Economic, Social and Political Aspect" to the Bombay Presidency, arguing that caste is maintained by economic and political power.',
      place: 'Bombay',
      source: 'wiki',
    },
    {
      date: '1918',
      precision: 'year',
      title: 'Returns from Columbia',
      description:
        'Ambedkar returns to India with a doctorate from Columbia and a degree from the London School of Economics, and begins work on Hindu law reform.',
      place: 'Bombay',
      source: 'britannica',
    },
    {
      date: '1932-11-20',
      precision: 'day',
      title: 'Mahad Satyagraha at Kalaram',
      description:
        'He leads a mass temple-entry protest at Kalaram temple in Nagpur, and is arrested during it.',
      place: 'Nagpur',
      source: 'wiki',
    },
    {
      date: '1933',
      precision: 'year',
      title: 'Annihilation of Caste',
      description:
        'The lectures that became his most reprinted work are delivered and then withdrawn after a dispute with the publisher over a forged endorsement.',
      place: 'Nagpur',
      source: 'wiki',
    },
    {
      date: '1946-12-02',
      precision: 'day',
      title: 'Constituent Assembly',
      description:
        'Ambedkar is elected to the Constituent Assembly and appointed to the Drafting Committee, whose chairman he becomes in 1947.',
      place: 'New Delhi',
      source: 'constitution',
    },
    {
      date: '1950-01-26',
      precision: 'day',
      title: 'The Constitution comes into force',
      description:
        'The Constitution of India, drafted under his chairmanship, comes into force, with the abolition of untouchability written into it.',
      place: 'New Delhi',
      source: 'constitution',
    },
    {
      date: '1956-12-06',
      precision: 'day',
      title: 'Dies at Mhow',
      description:
        'Ambedkar dies at his home in Mhow on 6 December 1956, six weeks after leading a mass conversion to Buddhism.',
      place: 'Mhow',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'savitribai-phule',
      type: 'movement',
      description:
        'Ambedkar credited Savitribai Phule and the Phule movement with having opened the argument against caste that he developed.',
      periodNote: 'early 20th century',
      source: 'wiki',
    },
    {
      to: 'rabindranath-tagore',
      type: 'contemporary',
      description:
        'Ambedkar and Tagore were both prominent figures in the Indian debates of the first half of the twentieth century, on opposite constitutional questions.',
      periodNote: '1920s–1930s',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'britannica', 'constitution', 'navyug'],
};
