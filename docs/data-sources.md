# Where the seed data comes from

This note records the provenance of the initial library, so a reader or a
reviewer can check the work rather than take it on trust.

> **The whole project is AI-built.** The code, the schema, the design, this
> document, the seed pipeline, the test suite and every word of the editorial
> copy were written by artificial intelligence. A person set the intention and
> pressed the buttons. What follows describes the machinery that produced the
> facts and the citations; the interpretation was machine-drafted, and has not
> been through the line-by-line human editing a traditional publication would
> insist on.

## Structured facts

Dates, occupations, places and portraits are taken from **Wikipedia's infobox**, fetched
through the MediaWiki API. That is a starting point and a cross-check, not an authority:
the infobox itself summarises a citation chain that usually runs back to a standard
reference work and often no further.

Where the infobox had no portrait, the article's lead image is used. Where neither
exists — Hypatia is the case in this corpus, and deliberately so — the profile shows the
typographic monogram fallback rather than a picture that may not be of the right person.
The Wikipedia article for Hypatia carries an editorial note about exactly this, and the
archive follows the same caution.

## Portraits

Portraits come from **Wikimedia Commons** through the Commons API, which returns the file's
licence, maker, credit and the page on which the original can be seen. All four are stored
against the media record, and the profile caption shows them with a link to the source.

The files are downloaded into `media/` at seed time. Nothing is hotlinked, so a reader's
request never tells a third-party server that they were here.

Of the fifteen profiles, fourteen have a verified portrait. The licences in this corpus are
almost entirely public domain, because the subjects are historical.

## Links

Every source URL in the archive is checked with a real HTTP request by `npm run db:verify`,
which records one of three outcomes against each source:

- **checked** — the link resolved.
- **unverified** — the host refused the request. Britannica, the Museum of Modern Art,
  the Library of Congress and the Royal Society all refuse automated requests; the link is
  almost certainly fine for a human, but this archive will not claim to have verified it.
- **failed** — the link is missing, or the host could not be reached. These are real
  defects, and they are listed rather than hidden.

The shipped corpus has **45 checked, 18 unverified, and 0 failed**.

Where a URL was found to be wrong during development, it was replaced with one that
resolves, or the source was removed. Nothing was left pointing at a page that does not
exist.

## The written text

The interpretive text — the biography, the significance, the controversies, the legacy — was
written for this publication. It is not scraped, and it is not a summary of a single
encyclopaedia entry.

That text is the part of the archive that carries the most weight and the most risk, so
three things are true of it:

1. It is **drafted with machine assistance** and published as a first edition rather than
   as a finished one. The editorial standards page says so, in public.
2. Every factual claim that could be checked against a source is attached to one, and the
   source is shown to the reader.
3. Where the historical record is genuinely contested — whether Ambrose was a
   collaborator, whether the acoustics of the Royal Institution were really that bad, what
   a posthumous reputation is worth — the text says that it is contested, and shows the
   sources for each side rather than settling the argument.

## Reusing the pipeline

The fetchers are in `scripts/seed/fetch/`. They are polite by construction:

- one request per 1.2 seconds, with a descriptive user agent
- exponential backoff on a 429, which the Wikimedia APIs do return under load
- an on-disk cache in `.cache/seed/`, so a second run makes no network requests
- a `--offline` mode that uses only what is cached

If you add a person, add their article title to the `wikipedia` field of the profile and
run the seed again. The loader will fetch the infobox, resolve the portrait, record the
licence, and upsert the profile by slug without disturbing anything else.
