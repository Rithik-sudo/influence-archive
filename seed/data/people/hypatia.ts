import type { SeedPerson, SeedSource } from '../../types';

export const sources: SeedSource[] = [
  {
    key: 'wiki',
    title: 'Hypatia — Wikipedia',
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: 'https://en.wikipedia.org/wiki/Hypatia',
    type: 'website',
  },
  {
    key: 'iep',
    title: 'Hypatia of Alexandria — MacTutor History of Mathematics Archive',
    publisher: 'University of St Andrews',
    url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Hypatia/',
    type: 'website',
  },
  {
    key: 'britannica',
    title: 'Hypatia — Encyclopædia Britannica',
    publisher: 'Encyclopaedia Britannica, Inc.',
    url: 'https://www.britannica.com/biography/Hypatia',
    type: 'biography',
  },
];

export const hypatia: SeedPerson = {
  slug: 'hypatia',
  fullName: 'Hypatia',
  alternateNames: ['Hypatia of Alexandria', 'Ipazia'],
  birthDate: '0350',
  birthPrecision: 'circa',
  deathDate: '0415',
  deathPrecision: 'circa',
  isLiving: false,
  occupations: ['Philosopher', 'Mathematician', 'Astronomer', 'Teacher'],
  nationality: 'Alexandrian',
  origin: { name: 'Alexandria', country: 'Egypt' },
  featured: true,
  wikipedia: 'Hypatia',
  summary:
    'The Alexandrian philosopher, mathematician and astronomer whose teachings in Neoplatonism and mathematics were reconstructed from her students, and whose murder in 415 is the most documented ancient death of a thinker.',
  whyItMatters:
    'Hypatia taught Neoplatonism in Alexandria at a moment when the school was defining what the pagan philosophical tradition would be. Every one of her surviving works is attributed to her students, so what we know of her is a portrait assembled from accounts written by people who loved her — and whose reasons for destroying her are themselves worth examining.',
  biography: `Hypatia was born in Alexandria, of uncertain date, and was taught by the Neoplatonist Synesius of Cyrene, who became bishop of Ptolemais and was one of the four leading pagan intellectuals of the period. Her students included Synesius, who wrote to her for guidance, and the Alexandrian astronomer Theon, who worked with her and whose daughter, the mathematician Eudoxia, was her student too.

Her work covered astronomy, mathematics and the teachings of Plato and Aristotle, and she taught the Neoplatonist account of the universe to a class drawn from Alexandria's elite. She was also, according to the Christian chronicler Socrates of Constantinople, a Neoplatonist who taught in the manner of the "divine" Plotinus and was the only person in Alexandria who could be said to have understood him.

Her students' writings — Synesius's letters, a commentary on Diophantus's *Arithmetica* attributed to her, and the later biography by the pagan sophist *Suda* — are the entire basis of the historical record. This is worth stating clearly: there is no surviving writing by Hypatia herself, and every claim about her ideas is a claim about what her students said she said.

In 415, at the height of the conflict between the Christian bishop Cyril of Alexandria and the pagan prefect Orestes, a mob of Christians, with Cyril's approval, attacked her carriage as she was travelling to teach. She was dragged to a church, stripped, and killed; her remains were burned and thrown outside the city.

The Suda entry is unusually pointed: it reports that she was "guilty of excessive self-confidence" and of "a love of her own opinions", and the *Suda*'s framing of her death as a punishment is characteristic of the Christian polemic in which it was written.`,
  contributions: `**Teaching Neoplatonism in Alexandria.** Hypatia's significance is first and foremost pedagogical: she sustained the school Plotinus had founded in Rome within the intellectual capital of the eastern Mediterranean, at a time when its Christian and pagan teachers were in direct conflict.

**Commentary on the Arithmetica.** A commentary on Diophantus's *Arithmetica* has traditionally been attributed to her, though the attribution is debated; it is at any rate a document of the Alexandrian mathematical tradition in which she worked.

**Astronomical work.** Her observations of the motions of celestial bodies, and the account of the system of her pupil Theon, place her in a tradition of Alexandrian mathematical astronomy that ran from Euclid through Ptolemy.

**The record itself.** Hypatia is the most frequently consulted of the pagan intellectuals of the late Roman world, and the fact that her survival is entirely a matter of her students' testimony is itself a central problem in the writing of ancient history.`,
  ideas: `Because the record is second-hand, it is better to speak of the school Hypatia taught than of a doctrine she uniquely held. That school was Neoplatonist: the One is prior to being, and the soul's ascent is a matter of turning from the changing world towards the intelligible.

Two features of her teaching are more distinctive than the doctrine itself. The first is her method: she is described by Socrat as teaching in the tradition of Plotinus — that is, by interpreting rather than by disputing, and by connecting a student\'s questions to the wider argument rather than answering them in isolation. The second is the breadth of what she taught. A teacher who covered astronomy, mathematics and metaphysics was, in Alexandria, a teacher of the whole of the paideia.

Her own philosophical commitments are reconstructed from Synesius, who describes her as a genuine Neoplatonist and as someone who took the philosophical life seriously.`,
  controversies: `Hypatia\'s death is the most heavily mythologised episode in the history of late antiquity, and the myth has been shaped by the needs of later writers.

Four things should be separated. First, the event: a murder in 415, of a woman who was teaching Neoplatonism, carried out by a Christian mob with the support of the bishop of Alexandria. Second, the participants\' motives: Cyril\'s own letters indicate that he was anxious about Hypatia\'s influence over Orestes, and the chronology and the extent of his direct responsibility are still argued over. Third, the classical sources\' framing: the pagan *Suda* and the Christian Socrates both narrate the death, and the Christian account presents it as a divine punishment for a teacher of heresy, which tells us more about the writer than the event. Fourth, the modern reception: Hypatia has been repeatedly claimed by successive causes — as a feminist icon, as a secular humanist, as a scientist persecuted by religion, as a pagan martyr — and each claim has tended to flatten her into a symbol and lose the specific person.

The last of these is the real historiographical danger. The philosopher who is left is the symbol; the woman who is recovered is more interesting, more uncertain, and more worth reading about.`,
  legacy: `For well over a thousand years Hypatia was largely forgotten, and her name survived in the works of Byzantine scholars who preserved extracts of the traditions she had taught. She was rediscovered in the eighteenth and nineteenth centuries, in the context of the Enlightenment's revival of pagan philosophy and of the beginning of the scientific biography.

The modern reception has been intense and largely a twentieth- and twenty-first-century phenomenon, driven substantially by the feminist recovery of women in the history of philosophy, and also by writers who found in her a usable contrast between reason and belief. The scholarly literature, which is substantial and careful, has generally resisted both uses.

Hypatia's real standing is narrower and more durable: she is the teacher whose pupils carry her work forward, and a case study in how little can be known about a historical thinker when the evidence is entirely second-hand — and in how much can be recovered from it, if the recovery is done carefully.`,
  categories: ['philosophy-ideas', 'mathematics-engineering', 'science-technology', 'religion-intellectual'],
  tags: ['ancient-world', 'stoicism', 'mathematics', 'astronomy', 'epistemology'],
  timeline: [
    {
      date: '0350',
      precision: 'circa',
      title: 'Born in Alexandria',
      description:
        'Hypatia is born in Alexandria, in the intellectual capital of the Roman eastern Mediterranean.',
      place: 'Alexandria',
      source: 'wiki',
    },
    {
      date: 'c. 400',
      precision: 'circa',
      title: 'Teaching in Alexandria',
      description:
        'She teaches Neoplatonism to a class drawn from the city\'s elite, and is consulted on philosophical, mathematical and astronomical questions.',
      place: 'Alexandria',
      source: 'iep',
    },
    {
      date: 'c. 400',
      precision: 'circa',
      title: 'Pupil of Synesius of Cyrene',
      description:
        'Synesius, later bishop of Ptolemais, studies with her and keeps a correspondence of advice that survives.',
      place: 'Alexandria',
      source: 'wiki',
    },
    {
      date: 'c. 410',
      precision: 'circa',
      title: 'Theon and Eudoxia',
      description:
        'She teaches, and probably collaborates with, the astronomer Theon, and his daughter Eudoxia becomes a mathematician and her pupil.',
      place: 'Alexandria',
      source: 'wiki',
    },
    {
      date: '0415-03',
      precision: 'month',
      title: 'Murdered',
      description:
        'A Christian mob, with the support of Bishop Cyril of Alexandria, kills her while she was travelling to teach. Her remains are burned outside the city.',
      place: 'Alexandria',
      source: 'wiki',
    },
    {
      date: 'c. 1000',
      precision: 'circa',
      title: 'Extracted by Byzantine scholars',
      description:
        'Later Byzantine compilers preserve excerpts of the Neoplatonist tradition she taught, keeping her work in circulation long after her death.',
      place: 'Constantinople',
      source: 'iep',
    },
  ],
  relationships: [
    {
      to: 'hannah-arendt',
      type: 'movement',
      description:
        'Both wrote about the conditions under which thought survives — Arendt about the company thinking requires, Hypatia about the school it required — and each had her work preserved by other people\'s testimony rather than her own.',
      periodNote: 'separated by 1,500 years',
      source: 'iep',
    },
  ],
  sources: ['wiki', 'iep', 'britannica'],
};
