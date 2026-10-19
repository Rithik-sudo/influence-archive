import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Influence Archive is an independently curated editorial publication about the people who shaped how humanity thinks, lives and sees the world.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[68ch] px-5 py-10 sm:px-8 sm:py-16">
      <p className="eyebrow">About</p>
      <h1 className="mt-3 text-title font-semibold text-ink">A publication about influence</h1>

      <div className="prose mt-10">
        <p>
          {brand.name} is an independent editorial publication documenting the lives, ideas and
          legacies of people who shaped the way we think, live and see the world. It covers
          scientists, philosophers, engineers, artists, writers, entrepreneurs, political figures,
          reformers, activists and inventors — across fields, centuries and countries.
        </p>

        <h2>What a profile is for</h2>
        <p>
          A profile here is not a summary. It is an attempt to answer a set of questions: who was
          this person, what did they actually do, what was the world they were working in, what
          went wrong, and what has genuinely carried forward. Every profile separates what is
          documented from what is later interpretation, and links each factual claim to a source
          the reader can check.
        </p>

        <h2>How the archive is organised</h2>
        <p>
          People are not filed under a single heading. A computer scientist might sit under
          science and technology, be tagged with computing and artificial intelligence, appear in
          a collection on the pioneers of modern computing, and be linked to the researchers whose
          work shaped theirs. Collections, eras and fields are different ways into the same
          material, not competing taxonomies.
        </p>

        <h2>Neutrality</h2>
        <p>
          Influence is not the same thing as virtue. Some of the people in this archive made
          enormous contributions and also caused serious harm; some were wrong about most things
          and right about one crucial thing. Where the historical record is contested, this
          publication says so and shows the evidence rather than settling the argument.
        </p>

        <h2>How it is made</h2>
        <p>
          The archive is written and edited by a small editorial desk. Long-form text is stored as
          Markdown and rendered through a sanitising pipeline; images are stored locally with their
          licence, maker and credit recorded against the file. Draft profiles are held at the
          database level and are not reachable through any public route, including search.
        </p>

        <p>
          The publication is independent. It carries no advertising, runs no tracking scripts, and
          asks nothing of a reader but their attention.
        </p>

        <h2>Corrections</h2>
        <p>
          Errors are corrected and the correction is noted. Where a claim is uncertain, the
          uncertainty is stated rather than smoothed away. The{' '}
          <Link href="/editorial-standards">editorial standards</Link> set out how sourcing,
          dating and disputed claims are handled.
        </p>
      </div>
    </div>
  );
}
