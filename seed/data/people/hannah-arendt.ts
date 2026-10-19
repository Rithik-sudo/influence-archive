import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Hannah Arendt — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Hannah_Arendt',
    type: 'website',
  },
  {
    key: 'iep',
    title: 'Hannah Arendt — Internet Encyclopedia of Philosophy',
    publisher: 'Tennessee State University',
    url: 'https://iep.utm.edu/arendt/',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Hannah Arendt — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Hannah-Arendt',
    type: 'biography',
  },
];

export const hannahArendt: SeedPerson = {
  slug: 'hannah-arendt',
  fullName: 'Hannah Arendt',
  alternateNames: ['Johanna "Hannah" Arendt', 'Hannah Arendt née Arendt'],
  birthDate: '1906-10-14',
  birthPrecision: 'day',
  deathDate: '1975-12-04',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Political theorist', 'Philosopher', 'Journalist', 'Professor'],
  nationality: 'German-American',
  origin: { name: 'Linden', country: 'Germany' },
  featured: true,
  wikipedia: 'Hannah_Arendt',
  summary:
    'The German-American political theorist who wrote about totalitarian evil, the banality of evil, and the conditions under which ordinary people think for themselves.',
  whyItMatters:
    'Arendt gave political theory a vocabulary for the twentieth century: totalitarianism, banality of evil, the human condition. She insisted that thought requires the company of others, which made her the most important political philosopher of the postwar period — and the most contested, for her writing on Eichmann made her a byword for moral evasion to people who had not read it carefully.',
  biography: `Johanna Arendt was born in Linden, near Hanover, in 1906. She studied philosophy, theology and classics at the universities of Marburg, Freiburg, Heidelberg and Berlin, and was refused a degree in 1929 because the university would not examine a woman. She moved to Paris, where she worked as a secretary and pursued a thesis on the political philosophy of the Enlightenment; she was briefly arrested by the Gestapo and released.

In 1933 she emigrated to the United States, and was married there to Günther Anders, whom she later divorced. She was among the first to write about the refugee, the pariah and the stateless person, and in 1944 published *Eichmann in Jerusalem*, based on her coverage of the trial for the New Yorker.

*The Origins of Totalitarianism* appeared in 1951, and made her famous: its account of totalitarianism as the destruction of political plurality, and its distinction between totalitarian government and authoritarian government, became standard. *The Human Condition* (1958) gave the vocabulary of labour, work and action. *Eichmann in Jerusalem* (1963) argued that Eichmann was not a monster but a bureaucratic Everyman, and introduced the phrase that has outlived the book.

The 1960s and 70s were difficult. Her thesis that the banality of evil described a failure of imagination rather than a failure of will was widely attacked, most sharply by her friend Mary McCarthy, and the period of the New Left turned her into a symbol of the establishment. She returned to Germany, taught, and continued to write.

She died in New York on 4 December 1975, of a heart attack, a few months before her seventieth birthday.`,
  contributions: `**The Origins of Totalitarianism (1951).** The founding text of postwar political theory, and the source of the vocabulary of totalitarianism, the masses, and the destruction of political plurality.

**The Human Condition (1958).** The distinction between labour, work and action — an attempt to recover a political vocabulary that had been emptied by modernity.

**Eichmann in Jerusalem (1963).** The book that made the phrase "banality of evil" a permanent part of the language, and that remains the most disputed work in modern political thought.

**The life of the mind.** The last three books, unfinished at her death, develop the idea that thinking is a solitary activity that nonetheless requires the company of others, and that the alternative to thought is the "thoughtlessness" she associated with Eichmann.

**A journalism practice.** Her coverage for the New Yorker, and her reportage on America in *The New Yorker's* pages, established a model of political writing that a great deal of journalism since has imitated.`,
  ideas: `Arendt's argument about totalitarianism is that it is not a form of government but a form of movement that seeks to make men superfluous. Its distinctive instruments are terror and ideology, and its political enemy is plurality — the simple fact that human life, organised politically, is plural.

Her argument about evil is that it does not require hatred or extraordinary motivation. What it requires is a failure of thought, and thought is what she believes is hardest to achieve: it is solitary, it is Socratic, it has no external guarantee, and it stops when we stop doing it. The banality is not that the acts were trivial, but that the person who performed them had never asked himself what he was doing.

Her most quoted formulation of this is that evil is never "radical", and that it is therefore not to be understood through the political category of revolution, but through the moral category of thoughtlessness.`,
  controversies: `Arendt is one of the most argued-over thinkers of the twentieth century, and the arguments take several forms.

The most substantial is the accusation that she moralised an empirical question and thereby obscured the nature of the evil. The line usually quoted against her is from *Eichmann in Jerusalem*, where she writes that it would be "of no avail to pursue the diabolical decrees of Hitler... if the meaning of the orders was unknown". Critics, including Hannah Arendt's contemporaries in the Frankfurt School, argued that this inverted the priority: that the atrocities should be understood as consequences of an ideology and a political programme, and not as the product of a bureaucrat's failure to use his imagination. The debate has not been settled.

A second is the **banality of evil** reading. Arendt's own position was narrower than the phrase that has been borrowed from her: she was not arguing that Eichmann was ordinary in the sense of innocuous, and she was explicit that the SS was an elite and that Eichmann had advanced within it. The popular use of the phrase has tended to make it a claim about individual smallness rather than about the conditions under which thought fails.

A third is the **relation between her political theory and her personal politics.** Arendt was an anti-totalitarian whose private commitments — her nationalism in the 1930s, her strained relations with Jewish contemporaries over Zionism, her late-period defence of certain European nationalisms — sit awkwardly with the pluralism she theorised. Scholarship since the 1990s has examined this at length, and the assessment is mixed.

A fourth concerns her **journalistic and political journalism**, particularly her coverage of the New York Intellectuals and her relationship to anticommunism in the 1950s.`,
  legacy: `Arendt is now securely among the central figures of twentieth-century political thought, and her influence runs through three distinct routes.

The first is conceptual: the vocabulary of totalitarianism, banality of evil, the human condition and the life of the mind has entered the general language of political argument, and is used by people who have never read a page of her, which is in one sense a measure of success.

The second is institutional: her teaching at the New School for Social Research, and the Hannah Arendt Center for the Study of Totalitarianism, are places where the interdisciplinary study of political evil has become a discipline.

The third is methodological: her insistence on political theory that resists both moral simplification and sociological abstraction set the terms of a debate that has run from the Frankfurt School to the contemporary literature on authoritarianism.

Her books remain in print and in classrooms, and the argument about them is not finished.`,
  categories: ['philosophy-ideas', 'politics-society', 'political-philosophy', 'ethics'],
  tags: ['political-philosophy', 'ethics', 'totalitarianism', 'epistemology', 'nationalism'],
  timeline: [
    {
      date: '1906-10-14',
      precision: 'day',
      title: 'Born at Linden',
      description:
        'Johanna Arendt is born in Linden, near Hanover, the only child of a mother who had abandoned an earlier marriage and a father who did not live with the family.',
      place: 'Linden',
      source: 'wiki',
    },
    {
      date: '1929',
      precision: 'year',
      title: 'Refused a degree',
      description:
        'The University of Heidelberg refuses to examine a woman for a doctorate; she leaves for Paris and continues her work there.',
      place: 'Heidelberg',
      source: 'wiki',
    },
    {
      date: '1933',
      precision: 'year',
      title: 'Emigrates',
      description:
        'Arendt flees Germany for the United States, and spends the war years writing on statelessness and exile.',
      place: 'New York',
      source: 'wiki',
    },
    {
      date: '1951',
      precision: 'year',
      title: 'The Origins of Totalitarianism',
      description:
        'Her first major book appears, and establishes the vocabulary of totalitarianism and political plurality.',
      place: 'New York',
      source: 'britannica',
    },
    {
      date: '1958',
      precision: 'year',
      title: 'The Human Condition',
      description:
        'She distinguishes labour, work and action, and argues for the recovery of a public realm of action.',
      place: 'New York',
      source: 'iep',
    },
    {
      date: '1963',
      precision: 'year',
      title: 'Eichmann in Jerusalem',
      description:
        'The New Yorker publishes her report on the Eichmann trial, and the phrase "banality of evil" enters public language.',
      place: 'Jerusalem',
      source: 'wiki',
    },
    {
      date: '1975-12-04',
      precision: 'day',
      title: 'Dies in New York',
      description:
        'Arendt dies of a heart attack, a few months short of her seventieth birthday, with the last volume of The Life of the Mind unfinished.',
      place: 'New York',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'nelson-mandela',
      type: 'contemporary',
      description:
        'Arendt wrote on the stateless and the refugee, the political conditions that produced the displacement she was later careful not to reduce to biography.',
      periodNote: '1930s–1970s',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'iep', 'britannica'],
};
