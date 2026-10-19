import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Rabindranath Tagore — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Rabindranath_Tagore',
    type: 'website',
  },
  {
    key: 'nobel',
    title: 'Rabindranath Tagore — The Nobel Prize',
    publisher: 'The Nobel Foundation',
    url: 'https://www.nobelprize.org/prizes/literature/1913/tagore/biographical/',
    type: 'archive',
  },
  {
    key: 'britannica',
    title: 'Rabindranath Tagore — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Rabindranath-Tagore',
    type: 'biography',
  },
];

export const tagore: SeedPerson = {
  slug: 'rabindranath-tagore',
  fullName: 'Rabindranath Tagore',
  alternateNames: ['Rabindranath Thakur', 'Gurudev', 'Bhanusimha'],
  birthDate: '1861-05-07',
  birthPrecision: 'day',
  deathDate: '1941-08-22',
  deathPrecision: 'day',
  isLiving: false,
  occupations: ['Poet', 'Writer', 'Composer', 'Painter', 'Educator', 'Sahitya Akademi'],
  nationality: 'Indian',
  origin: { name: 'Kolkata', country: 'India' },
  featured: true,
  wikipedia: 'Rabindranath_Tagore',
  summary:
    'The Bengali polymath whose poetry, translated into more than fifty languages, made him the first non-European to win the Nobel Prize in Literature, and whose school put art, music and craft at the centre of learning.',
  whyItMatters:
    'Tagore wrote in more than sixty languages and drew on Sanskrit, Bengali, Persian and European traditions at once. *Gitanjali* brought a non-European voice to the English-language world in 1912, and the Nobel in 1913. His educational experiments at Santiniketan and Visva-Bharati were among the first serious attempts to build a school around creativity rather than examination.',
  biography: `Rabindranath Tagore was born on 7 May 1861 in the Tagore family of Jorasanko, Calcutta — the most distinguished intellectual family in nineteenth-century Bengal. His grandfather, Prince Dwarkanath Tagore, was a wealthy zamindar and a founder of the Brahmo Samaj; his father Debendranath was a religious seeker; his mother Sarada Devi, whom he called *Sarada*, would become a guru in her own right.

He was educated at home and then at the English-language Hindu School, and never at a university: in 1880 he went to London to study law and left without taking a degree. On his return to India he assumed management of the family estate, tried a life of writing, and found the work suffocating. In 1886 he took a post at the Experimental School at Shantiniketan, and stayed for nearly three decades, turning it into an institution with a distinctive pedagogy — no fixed syllabus, teachers who had to be chosen as much for character as for subject, art and music and dance and the open air, and a place in the daily rhythm for the tending of trees and the keeping of animals.

His writing poured out: poetry in Bengali from the 1880s, novels including *Ghare-Baire* (Home and the World) and *Aparajito* (The Unvanquished), short stories, essays, and — with *The Dove of Nesting* (1902) — the first substantial body of Bengali songs that could be called operetta, for which he wrote the music himself. He was also a considerable painter, working in a style he described as a "primitive" and a "sudden" mode, and the last paintings of his life were made in his seventies.

*Gitanjali*, a collection of poems rendered into English by his Bengali associate, appeared in an English edition in 1912 and was praised by William Butler Yeats, who wrote an introduction. The Nobel Prize followed in 1913.

He travelled widely — England, the United States, France, Germany, the Soviet Union, China, Japan — and his travels are the subject of some of his sharpest prose, including the essay collection *Sadhana* and the travel writings that made him an unusually reliable witness to the intellectual weather of his time. In 1941, with Calcutta under threat and the universities in chaos, he died in Calcutta on 22 August, at the age of eighty.

He left behind more than two thousand songs, and a school that is now a university, Visva-Bharati, which he founded in 1921.`,
  contributions: `**Gitanjali (1912).** The English collection that introduced a Bengali poet to a European readership, and that carried the Nobel Prize in Literature in 1913 — the first award to a non-European.

**A modern Bengali literature.** His more than two thousand poems, two novels, and dozens of short stories established a modern literary language in Bengali, and the *Tagore Song* remains part of the national repertoire.

**Children\'s literature.** *Runaway* and the stories of *Wanderers* were written for children and are still in use in schools, and he is credited with establishing a serious literature for children in Bengali.

**The school as a laboratory.** Santiniketan and Visva-Bharati made an argument — that education should be organised around creative work, nature and direct contact rather than examination — that a generation of Indian and international educators drew on.

**Art and composition.** He composed music for more than two thousand songs and continued to paint seriously into old age, arguing that a line drawn without seeking recognition was the beginning of a real artistic life.`,
  ideas: `Tagore\'s thought runs through a single question asked in many ways: how does a person live with the fact of the world? His answers were religious rather than systematic, and they are gathered in works such as *The Religion of Man*, *The Holy of Man* and *Sadhana*.

The central idea is that the human being is neither a solitary individual nor a function of a system, but a knot of relations — to the world, to other people, to work, to beauty. Education, on this view, is not the transmission of information but the training of attention and conscience. This is why the school he built put music, art, manual work and the care of animals at the centre rather than at the edge, and why he was suspicious of competitive examination from the beginning.

He was also consistently internationalist without being uncritical of Europe, and he wrote about the West as a man who had studied it closely and liked much of it.`,
  controversies: `Tagore\'s reputation has been contested along two lines.

The first is **national versus international**. Tagore is claimed as a national figure, and his Centenary celebrations in 1961 were a state occasion, but his relationship to nationalism was complicated: he renounced his knighthood in 1919 after the Jallianwala Bagh massacre, and he repeatedly warned against both imperial subservience and a narrow cultural nationalism. The two have coexisted awkwardly, and the state commemoration of 1961 was criticised by some of his descendants for exactly that reason.

The second concerns his **later political positions**, in particular his response to the Soviet collectivisation of agriculture, which he studied in the 1930s and then rejected in print. Critics of the left read this as an endorsement of Stalin; critics on the right read it as a rejection of socialism as such. His actual argument was narrower and more careful than either.

A third, more recent, strand concerns the **appropriation of his work for national commercial purposes**, including the use of his name and image in campaigns and on commercial packaging, which his descendants and several state governments have opposed.`,
  legacy: `Tagore\'s influence is unusually diffuse, which makes it easy to understate. The Nobel and the English poems made him the first Asian writer of comparable international standing, and his verse has been translated into more than fifty languages. In China and Japan, and in much of the West, he was read long before anyone else from that region.

Institutionally, Visva-Bharati at Santiniketan continues as a university with an international faculty and an arts-and-craft tradition in which he was personally involved, and it is a UNESCO World Heritage Site. His educational ideas were picked up by the British Progressive school movement and by Rabindranath\'s own contemporaries abroad.

In his own country, the "Tagore Festival" of song and poetry, the school and university curricula, and the continued centrality of his songs in Bengali public life make him a presence rather than a memory. He remains the closest thing South Asia has to a writer held in the same regard as Shakespeare is in England — a comparison he would have enjoyed and probably corrected.`,
  categories: ['literature-thought', 'poetry', 'art-culture', 'music', 'education-reform'],
  tags: ['poetry', 'modernism-literature', 'education', 'nationalism'],
  timeline: [
    {
      date: '1861-05-07',
      precision: 'day',
      title: 'Born in Calcutta',
      description:
        'Rabindranath Tagore is born in the Tagore family of Jorasanko, in the household that was the intellectual centre of Bengali revivalism.',
      place: 'Kolkata',
      source: 'wiki',
    },
    {
      date: '1878',
      precision: 'year',
      title: 'Sent to England',
      description:
        'He is sent to study law in London, and leaves England in 1880 without taking a degree.',
      place: 'London',
      source: 'wiki',
    },
    {
      date: '1886',
      precision: 'year',
      title: 'Santiniketan',
      description:
        'Tagore takes up a teaching post at the Experimental School at Santiniketan, and begins building the educational experiment he ran for nearly three decades.',
      place: 'Santiniketan',
      source: 'wiki',
    },
    {
      date: '1902',
      precision: 'year',
      title: 'The Dove of Nesting',
      description:
        'His collection of songs is published, the beginning of the musical theatre for which he wrote both words and music.',
      place: 'Calcutta',
      source: 'wiki',
    },
    {
      date: '1912',
      precision: 'year',
      title: 'Gitanjali in English',
      description:
        'The English Gitanjali appears, with an introduction by William Butler Yeats, and is taken up by the British and American literary press.',
      place: 'London',
      source: 'nobel',
    },
    {
      date: '1913-11-13',
      precision: 'day',
      title: 'The Nobel Prize',
      description:
        'Tagore is awarded the Nobel Prize in Literature, the first to a non-European writer.',
      place: 'Stockholm',
      source: 'nobel',
    },
    {
      date: '1919',
      precision: 'year',
      title: 'Renounces his knighthood',
      description:
        'Following the Jallianwala Bagh massacre, he returns his knighthood, writing that it would be a dishonour to be associated with a nation that had such things done in its name.',
      place: 'Santiniketan',
      source: 'wiki',
    },
    {
      date: '1941-08-22',
      precision: 'day',
      title: 'Dies in Calcutta',
      description:
        'Tagore dies in Calcutta on 22 August 1941, at the age of eighty, having seen his school and the university at Santiniketan disrupted by the war.',
      place: 'Kolkata',
      source: 'wiki',
    },
  ],
  relationships: [
    {
      to: 'b-r-ambedkar',
      type: 'contemporary',
      description:
        'Tagore and Ambedkar were prominent figures in the same Indian debates, and disagreed sharply about the constitutional and educational direction of independent India.',
      periodNote: '1920s–1930s',
      source: 'wiki',
    },
  ],
  sources: ['wiki', 'nobel', 'britannica'],
};
