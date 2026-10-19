import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editorial standards',
  description:
    'How the Influence Archive handles sourcing, dating uncertain records, contested claims, images and corrections.',
  alternates: { canonical: '/editorial-standards' },
};

export default function EditorialStandardsPage() {
  return (
    <div className="mx-auto max-w-[68ch] px-5 py-10 sm:px-8 sm:py-16">
      <p className="eyebrow">Editorial standards</p>
      <h1 className="mt-3 text-title font-semibold text-ink">How we work</h1>

      <div className="prose mt-10">
        <p>
          These are the rules the editorial desk works to. They are published so that a reader can
          hold the archive to them.
        </p>

        <h2 id="sources">Sources</h2>
        <p>
          Every factual claim about a person — dates, roles, discoveries, quotations, controversies
          — is attached to a source record. Sources are prioritised in this order: primary
          documents; academic publications; institutional and university archives; established
          reference works and reputable biographies; newspapers and periodicals of the period.
        </p>
        <p>
          Where a claim is contested, the sources for each side are both given, and the text says
          plainly that the matter is unsettled. A citation is never invented, and a source is never
          cited for something it does not support.
        </p>

        <h2 id="dates">Dates and uncertainty</h2>
        <p>
          Historical records are frequently imprecise, and this publication does not manufacture
          precision. Each date is stored with its precision — day, month, year, circa, or unknown
          — and rendered accordingly. A person recorded as &ldquo;c.&nbsp;350&rdquo; is shown that
          way. A lifespan is not stated at all when the record does not support one.
        </p>

        <h2 id="neutrality">Neutrality and influence</h2>
        <p>
          Influence is not treated as a moral judgement. Inflating a person&rsquo;s importance is as
          much a distortion as suppressing it. Criticism of a person&rsquo;s work is presented on
          the same evidentiary footing as praise, and allegations are never written as established
          fact unless the record establishes them.
        </p>

        <h2 id="quotations">Quotations</h2>
        <p>
          Quotations are reproduced with their attribution, source and context. A quotation whose
          provenance cannot be established is not used, however well known it may be. Popular
          internet quotations attributed to a person are treated as unverified until a source can
          be produced.
        </p>

        <h2 id="images">Images and licensing</h2>
        <p>
          Portraits, artworks and documents are stored locally with a record of their licence, the
          maker, the holding institution and the page on which the original can be seen. Public
          domain and openly licensed material is used. Where a suitable image cannot be verified, a
          profile shows a typographic placeholder rather than a broken or mismatched photograph.
        </p>

        <h2 id="ai">Machine-assisted drafting</h2>
        <p>
          The initial library of profiles was drafted with machine assistance, and is published as
          a first edition rather than as a finished one. Dates, occupations and portraits are taken
          from structured reference records; the interpretation was written by the desk and is
          accountable to it. Each source record carries its own verification status, and the status
          is shown on the profile, so a reader can see which links have been checked and which have
          not. Corrections are invited and made in public.
        </p>

        <h2 id="corrections">Corrections</h2>
        <p>
          When an error is found it is fixed and the change is recorded. Material corrections to
          the substance of a profile are noted on the profile itself. Readers who believe
          something here is wrong should say so through the contact address given in the footer.
        </p>

        <h2>What this publication does not do</h2>
        <p>
          It does not publish anonymous submissions, reader accounts or comment threads. It does
          not rank people by importance, because there is no defensible way to do so. And it does
          not present a single view of history as settled where the evidence does not settle it.
        </p>
      </div>

      <p className="mt-12 border-t border-rule pt-6 text-[13px] text-ink-faint">
        See also the <Link href="/about" className="underline underline-offset-4">About page</Link>{' '}
        and the <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>.
      </p>
    </div>
  );
}
