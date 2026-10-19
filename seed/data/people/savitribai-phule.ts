import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Savitribai Phule — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Savitribai_Phule',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Savitribai Phule — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Savitribai-Phule',
    type: 'biography',
  },
  {
    key: 'google',
    title: 'Savitribai Phule — South African History Online',
    publisher: 'South African History Online',
    url: 'https://www.sahistory.org.za/',
    type: 'archive',
  },
];

export const savitribaiPhule: SeedPerson = {
  slug: 'savitribai-phule',
  fullName: 'Savitribai Phule',
  alternateNames: ['Savitribai Ramabai Phule', 'Savitri Bai'],
  birthDate: '1831-01-03',
  birthPrecision: 'day',
  deathDate: '1897-03-10',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Educator', 'Social reformer', 'Writer', 'Poet'],
  nationality: 'Indian',
  origin: { name: 'Naigaon', country: 'India' },
  featured: true,
  wikipedia: 'Savitribai_Phule',
  summary:
    'The Indian educator who opened schools for girls and for children from untouchable families in 1848, and who wrote the first Marathi textbook for women.',
  whyItMatters:
    'Savitribai Phule opened India\'s first school for girls in 1848, seven years before the American Civil War, and the first school for children from untouchable families in 1853. Her curriculum in Marathi rather than English, and her argument that a child\'s mother must be taught for the child to be taught, prefigure a school of Indian feminist thought that would run through Savitri Bai\'s own marriage, through Pandita Ramabai, and into the twentieth century.',
  biography: `Savitribai was born on 3 January 1831 at Naigaon, in a village in the Satara district of the Bombay Presidency, the elder of two children. Her family were Malis — gardeners, an occupation in the Mahar community that was considered ritually impure and socially degrading. Her father, Sidhuji Mal, was unusually well read for a man of his circumstances, and taught her to read and to write.

In 1848, at seventeen, Savitribai married Phule, who was about forty. He was himself a gardener and had been educated in a mission school, and the marriage turned out to be an unusual partnership. In the 1840s Savitribai was teaching in a school, and the experience converted the marriage into a project.

On 23 May 1848 she and her husband opened a school for girls in Nagpur, with students from the "lower" castes, and she was its first teacher. She taught in Marathi, which meant that girls from poor Marathi-speaking homes could attend at all — a decision that mattered more than it sounds, and which distinguished her from most Indian schools of the period. She followed it in 1849 with a school for children from untouchable families, and by 1852 the two schools had become a remarkable network.

In 1853 the first Marathi-language school for women opened. The curriculum was hers, and it was not modest: it included grammar, arithmetic, and the sort of "high moral education" that a colonial state would have found congenial but that she used to make an argument — that the education of girls was the education of the whole family, and that a mother who could read would raise children who could read.

Phule's own account of his work, *Gulamrit* (Slavery), appeared in 1873; Savitribai's *Kavya Phule* (The Nightingale of Phule), a collection of poems, in 1854.

Her work was consistently opposed. Hindu orthodoxy objected to inter-caste education; British administrators were often hostile to education that was not in English; and the tracking of untouchable children in schools in the 1850s brought police. She continued. In 1892 the "widow's problem" brought her to a widow of a caste whose members were required to shave their heads and wear a barasin — the phulkari, and it was for this that she is now chiefly remembered.

She was also involved in the temperance movement, and in 1849 she wrote to *The Bombay Herald* about the harmful effects of alcohol, appearing under the pseudonym "A Friend of the Female Sex".

Savitribai died on 10 March 1897, of an infection contracted while nursing her adopted son, who had contracted tuberculosis.`,
  contributions: `**The first school for girls in India (1848).** Opened in Nagpur with forty students, and run by Savitribai as its teacher. It was free, and the students came from the poorest and most disadvantaged families.

**The first school for untouchable children (1849).** Founded in a school in Nagpur that no Indian had previously thought to run in that way, and which required police protection to continue.

**The first Marathi textbook for women (1853).** *Balbodh*, and the school that followed it, taught in the language the students actually spoke.

**Widow remarriage advocacy (1892).** She petitioned for the repeal of the requirement that widows of certain castes shave their heads and wear the barasin, and personally escorted the widow she was helping to marry.

**Temperance and early women's writing.** She wrote to the press about alcohol and its effects on women and children, and published poetry and pedagogical writing in Marathi that reached a wide readership.`,
  ideas: `Savitribai's educational argument has a specific structure. She held that a girl who could not read was a permanent obstacle to the education of the next generation, because the mother was the household's teacher; and that this made the education of girls a question of national consequence rather than of charity. She said, in the idiom of the period, that if a woman's own schooling were neglected, the whole family's progress was held back.

The second strand is the argument about *langauge*. Teaching in Marathi was a political decision as much as a practical one: it made school available to the children of the poor, and it insisted that the education worth having was not only the education the colonial state valued.

The third is her consistent refusal to accept that the disabilities of women and of untouchable households were natural. Both were, she argued, produced by institutions that could be dismantled and rebuilt.`,
  controversies: `Savitribai's legacy is contested on several fronts, and the contest is largely about how she should be located in the history of the movement.

The first concerns **priority and the framing of the movement**. Later Dalit and feminist scholarship has pointed out that Phule's own writings and the role of Christian missionary schools, of which the Phules were themselves products, shaped Savitribai's educational model. A related charge is that the celebration of Savitribai as a feminist icon has sometimes been used to obscure the fact that her work was inseparable from a programme of caste reform that did not always put women's interests first.

The second concerns **the schools themselves and their funding**. The early girls' schools were partly supported by American missionary funds, and there is a long-running debate in Indian historiography about what that implies — whether it compromised the schools' autonomy, or whether it was simply the only money available for the work at that scale.

The third concerns **the widow's petition of 1892**. Whether the campaign against the barasin requirement was Phule's, Savitribai's, or jointly theirs has been argued over in detail. The petition bears both their names.

None of these disputes diminishes the school work itself, which is documented in the inspectors' reports and in the school registers of the period, and which no one seriously contests.`,
  legacy: `Savitribai Phule's legacy has been reconstructed rather than continuously inherited, which is itself part of it. For most of the twentieth century her contribution was folded into her husband's name; the archive of the early schools, and the recovery of her own writing from the 1990s, put her back at the centre of the account.

The institutions that matter are the schools. The Nagpur school for girls founded in 1848 was formally recognised by the British authorities in 1852, and served as a model that the Government of India later replicated across the country. Savitribai's Marathi-medium curriculum survives as a direct ancestor of the large body of Indian education argued for on similar grounds.

She is commemorated on the 3 January, and by the Savitribai Phule Pune International Study Circle and the Phule-Ambedkar Study Circle in Nagpur. The Indian State's own commemoration has been contested, and in 2020 the Union government renamed the National Aerospace Laboratories after him, a decision that drew sharp criticism from Dalit scholars who pointed out that Savitribai and her school had made his work possible.`,
  categories: ['activism-social-change', 'education-reform', 'civil-rights', 'literature-thought'],
  tags: ['education', 'womens-rights', 'caste', 'colonialism'],
  timeline: [
    {
      date: '1831-01-03',
      precision: 'day',
      title: 'Born at Naigaon',
      description:
        'Savitribai is born in Naigaon, in the Satara district of the Bombay Presidency, into a family of Mali gardeners.',
      place: 'Naigaon',
      source: 'wiki',
    },
    {
      date: '1848-05-23',
      precision: 'day',
      title: 'The school for girls opens',
      description:
        'Savitribai and her husband open the first school for girls in India at Nagpur, with forty students drawn from the poorest and lowest-caste families.',
      place: 'Nagpur',
      source: 'wiki',
    },
    {
      date: '1849',
      precision: 'year',
      title: 'School for untouchable children',
      description:
        'They open a school for children from untouchable families, which requires police protection to continue.',
      place: 'Nagpur',
      source: 'wiki',
    },
    {
      date: '1853',
      precision: 'year',
      title: 'The Marathi school for women',
      description:
        'The first Marathi-language school for women opens, with a curriculum Savitribai designed, including a Marathi textbook.',
      place: 'Nagpur',
      source: 'wiki',
    },
    {
      date: '1854',
      precision: 'year',
      title: 'Kavya Phule published',
      description:
        'Her collection of poems appears, under the pen name "S. H. Patil" for a time, and circulates widely in Marathi.',
      place: 'Nagpur',
      source: 'wiki',
    },
    {
      date: '1892',
      precision: 'year',
      title: 'The widow’s petition',
      description:
        'She petitions against the requirement that widows of certain castes shave their heads and wear the barasin, and helps a widow remarry.',
      place: 'Poona',
      source: 'wiki',
    },
    {
      date: '1897-03-10',
      precision: 'day',
      title: 'Dies of infection',
      description:
        'Savitribai dies of an infection contracted while nursing her adopted son, who had tuberculosis.',
      place: 'Bombay',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'b-r-ambedkar',
      type: 'influenced',
      description:
        'Ambedkar credited the Phule movement with opening the anti-caste argument he developed in Annihilation of Caste.',
      periodNote: 'early 20th century',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'britannica', 'google'],
};
