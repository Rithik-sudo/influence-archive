import type {
  SeedArticle,
  SeedCategory,
  SeedCollection,
  SeedPerson,
  SeedPeriod,
  SeedSource,
  SeedTag,
} from '../types';

import { categories, periods, sources as sharedSources, tags } from './taxonomy';
import { collections } from './collections';
import { articles } from './articles';

import { adaLovelace, sources as adaSources } from './people/ada-lovelace';
import { alanTuring, sources as turingSources } from './people/alan-turing';
import { marieCurie, sources as curieSources } from './people/marie-curie';
import { ramanujan, sources as ramanujanSources } from './people/srinivasa-ramanujan';
import { ambedkar, sources as ambedkarSources } from './people/b-r-ambedkar';
import { savitribaiPhule, sources as phuleSources } from './people/savitribai-phule';
import { abdulKalam, sources as kalamSources } from './people/a-p-j-abdul-kalam';
import { tagore, sources as tagoreSources } from './people/rabindranath-tagore';
import { hypatia, sources as hypatiaSources } from './people/hypatia';
import { hannahArendt, sources as arendtSources } from './people/hannah-arendt';
import { nelsonMandela, sources as mandelaSources } from './people/nelson-mandela';
import { fridaKahlo, sources as kahloSources } from './people/frida-kahlo';
import { graceHopper, sources as hopperSources } from './people/grace-hopper';
import { satyendraBose, sources as boseSources } from './people/satyendra-nath-bose';
import { katherineJohnson, sources as johnsonSources } from './people/katherine-johnson';

type Entry = { person: SeedPerson; sources: SeedSource[] };

const entries: Entry[] = [
  { person: adaLovelace, sources: adaSources },
  { person: alanTuring, sources: turingSources },
  { person: marieCurie, sources: curieSources },
  { person: ramanujan, sources: ramanujanSources },
  { person: ambedkar, sources: ambedkarSources },
  { person: savitribaiPhule, sources: phuleSources },
  { person: abdulKalam, sources: kalamSources },
  { person: tagore, sources: tagoreSources },
  { person: hypatia, sources: hypatiaSources },
  { person: hannahArendt, sources: arendtSources },
  { person: nelsonMandela, sources: mandelaSources },
  { person: fridaKahlo, sources: kahloSources },
  { person: graceHopper, sources: hopperSources },
  { person: satyendraBose, sources: boseSources },
  { person: katherineJohnson, sources: johnsonSources },
];

/**
 * Source keys are local to the profile that declares them, so they are
 * namespaced by slug before being merged. Without this, every profile's
 * "wiki" key would collide and only one Wikipedia entry would survive.
 */
const mergedSources = new Map<string, SeedSource>();

for (const source of sharedSources) {
  mergedSources.set(source.key, source);
}

const namespacedPeople: SeedPerson[] = entries.map(({ person, sources }) => {
  const remap = new Map<string, string>();

  for (const source of sources) {
    const namespaced = `${person.slug}--${source.key}`;
    remap.set(source.key, namespaced);
    mergedSources.set(namespaced, { ...source, key: namespaced });
  }

  return {
    ...person,
    sources: person.sources.map((key) => remap.get(key) ?? key),
  };
});

export const corpus = {
  people: namespacedPeople,
  articles: articles as SeedArticle[],
  collections: collections as SeedCollection[],
  categories: categories as SeedCategory[],
  tags: tags as SeedTag[],
  periods: periods as SeedPeriod[],
  sources: [...mergedSources.values()],
};

export { articles, collections, categories, periods, tags };
