import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Nelson Mandela — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Nelson_Mandela',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Nelson Mandela — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Nelson-Mandela',
    type: 'biography',
  },
  {
    key: 'sahistory',
    title: 'Nelson Mandela — South African History Online',
    publisher: 'South African History Online',
    url: 'https://www.sahistory.org.za/people/nelson-mandela',
    type: 'archive',
  },
];

export const nelsonMandela: SeedPerson = {
  slug: 'nelson-mandela',
  fullName: 'Nelson Mandela',
  alternateNames: ['Rolihlahla Mandela', 'Madiba', 'Nelson Rolihlahla Mandela'],
  birthDate: '1918-07-18',
  birthPrecision: 'day',
  deathDate: '2013-12-05',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Political activist', 'Anti-apartheid leader', 'President of South Africa'],
  nationality: 'South African',
  origin: { name: 'Mvezo', country: 'South Africa' },
  featured: true,
  wikipedia: 'Nelson_Mandela',
  summary:
    'The South African anti-apartheid leader whose 27 years in prison did not break him, and whose first act as president was to pardon the men who had guarded him.',
  whyItMatters:
    'Mandela led a movement that ended legal racial apartheid without a civil war, and then chose reconciliation over retribution at the moment when revenge would have been easiest to justify. He is the clearest case in modern history of a person whose historical significance lies as much in what he declined to do as in what he did.',
  biography: `Rolihlahla Mandela was born on 18 July 1918 in the Thembu royal line at Mvezo in the Transkei. He was orphaned young, and raised by his cousin Reginald Mtshali and then by a guardian who was a scatological prophet; his Xhosa name, Rolihlahla, means "pull the branch" and has been read as a description of his whole character.

He moved to Johannesburg, trained as a telegraphist, and in 1944 joined the African National Congress. In 1943, with Walter Sisulu, Oliver Tambo, the Yusuf Dadoo and others, he helped found the Youth League, which argued for mass defiance rather than the negotiation the older Congress leadership favoured. In 1952 he co-founded the Defiance Campaign. In 1956 he was among the defendants in the Treason Trial, which acquitted them all after a year.

The Sharpeville massacre of 1960 and the banning of the ANC in 1960 pushed the movement towards armed struggle. Mandela co-founded Umkhonto we Sizwe in 1961; in 1964 he was sentenced to life imprisonment for sabotage after the 1963 bombing of the Church of the Fourth Path. He spent eighteen years on Robben Island and nine in Pollsmoor and Victor Verster prisons.

In 1990, with the unbanning of the party and the negotiation that followed, Mandela walked out of prison at the age of 71. He was elected president of South Africa in 1994, and in that first term he established the Truth and Reconciliation Commission, which heard testimony from both victims and perpetrators of apartheid-era crimes.

He resigned as president in 1999, and spent his last years promoting the United Nations' campaign against HIV/AIDS, and the Lionel "Rust" Bernstein Award, which he helped found for the courage to tell the truth. He died on 5 December 2013, at his home in Johannesburg, aged 95.`,
  contributions: `**The Youth League (1944).** With Walter Sisulu and Oliver Tambo, Mandela founded the ANC Youth League, which replaced a politics of petition with a politics of mass organisation and, ultimately, of arms.

**The Defiance Campaign (1952).** Organised mass civil disobedience against apartheid's unjust laws, and the movement's first sustained attempt to make the state respond to organised non-compliance.

**Umkhonto we Sizwe (1961).** Co-founder of the armed wing that carried out the sabotage campaign of the early 1960s — carefully targeted at installations rather than people, a distinction that mattered to the movement's legitimacy.

**The prison years and the negotiation.** His conduct in custody, and the decision to make imprisonment a platform rather than a surrender, was central to the international salience of the anti-apartheid cause.

**The Truth and Reconciliation Commission (1995).** Chaired by Archbishop Desmond Tutu and supported by Mandela's government, it modelled a route out of systematic violence that did not require amnesty or vengeance.`,
  ideas: `Mandela's politics is usually described as a strategy of negotiation, but his own account makes the ethical core explicit: he held that a negotiated settlement that did not transfer real power would postpone the reckoning rather than settle it, and equally that an uncompromising stance would deliver South Africa to civil war, which he regarded as a worse outcome for everyone including the majority.

His most cited formulation of the underlying principle concerns the choice of enemy. In his autobiography he describes the decision to meet the bitter men who had guarded him on Robben Island without hatred, on the grounds that hatred would bind him to them and reduce his own freedom. It is a claim about the means of struggle as much as about the end.

The second thread is *ubuntu* — the idea that a person is diminished by treating another as an enemy, and that the willingness to see the humanity of an opponent is a form of strength.`,
  controversies: `Mandela's status makes serious criticism of him unusually rare, and the criticism that exists is worth stating precisely.

The first concerns the **armed struggle**. The decision to take up arms in 1961 is defended as a response to the state's closure of peaceful avenues, and the sabotage campaign was deliberately constructed to avoid loss of life, but it did involve the National Party's later use of the phrase "comminjie". Critics on the left have argued that the militarisation of the movement and the alignment of parts of the ANC with Cold War politics — including the Soviet and Chinese military training of Umkhonto we Sizwe — were means by which a movement with a mass base was prevented from becoming a mass movement, and that the armed wing served the interests of an international politics more than South Africa's.

The second concerns the **negotiated settlement**. Critics, including some in the ANC's own left, have argued that the 1994 constitution, which guaranteed property rights and secured a white economic establishment, was a bargain that left the material basis of apartheid largely intact, and that "conciliation" was sometimes used to describe what was in fact capitulation on economic questions. That criticism is now mainstream in South African scholarship.

The third concerns the **path to the presidency**: the 1993 decision of the ANC to enter the elections rather than continue a mass campaign, and the subsequent polls that won Mandela a share of the vote he did not personally command.`,
  legacy: 'The end of legal apartheid in South Africa in 1994 stands as the clearest instance in the twentieth century of a racial order dismantled without civil war. The institutional residue of that settlement is still being litigated — land, inequality and economic power remain sharply unequal, and the debate about what 1994 did and did not achieve is one of the most serious in contemporary South African life.',
  categories: ['activism-social-change', 'politics-society', 'civil-rights'],
  tags: ['civil-rights', 'apartheid', 'independence', 'nonviolence', 'human-rights'],
  timeline: [
    { date: '1918-07-18', precision: 'day', title: 'Born at Mvezo', description: 'Rolihlahla Mandela is born into the Thembu royal line in the Transkei.', place: 'Mvezo', source: 'wiki' },
    { date: '1944', precision: 'year', title: 'The Youth League is founded', description: 'Mandela, with Sisulu and Tambo, founds the ANC Youth League, arguing for mass defiance.', place: 'Johannesburg', source: 'sahistory' },
    { date: '1952', precision: 'year', title: 'Defiance Campaign', description: 'He co-organises the campaign of mass civil disobedience against unjust laws.', place: 'Johannesburg', source: 'sahistory' },
    { date: '1961', precision: 'year', title: 'Umkhonto we Sizwe', description: 'Mandela co-founds the ANC\'s armed wing, which begins a campaign of sabotage against installations.', place: 'Johannesburg', source: 'wiki' },
    { date: '1964-06-16', precision: 'day', title: 'Sentenced to life', description: 'Convicted in the Rivonia Trial, he is sentenced to life imprisonment.', place: 'Pretoria', source: 'britannica' },
    { date: '1990-02-11', precision: 'day', title: 'Released', description: 'Mandela walks out of prison after 27 years, aged 71.', place: 'Cape Town', source: 'wiki' },
    { date: '1994-04-27', precision: 'day', title: 'Elected president', description: 'South Africa holds its first universal-suffrage election; Mandela is inaugurated the next month.', place: 'Pretoria', source: 'sahistory' },
    { date: '2013-12-05', precision: 'day', title: 'Dies at home', description: 'Mandela dies in Johannesburg at the age of 95, and is laid in state.', place: 'Johannesburg', source: 'wiki' },
  ],
  relationships: [
    { to: 'hannah-arendt', type: 'contemporary', description: 'Arendt wrote on the stateless and the refugee, the political conditions that produced the displacement she was careful not to reduce to biography.', periodNote: '1930s–1970s', source: 'wiki' },
  ],
  sources: ['wiki', 'britannica', 'sahistory'],
};
