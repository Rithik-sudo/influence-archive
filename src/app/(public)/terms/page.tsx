import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use for the Influence Archive.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[68ch] px-5 py-10 sm:px-8 sm:py-16">
      <p className="eyebrow">Policy</p>
      <h1 className="mt-3 text-title font-semibold text-ink">Terms of use</h1>

      <div className="prose mt-10">
        <p>
          These terms cover the use of this publication. They are written to match what the site
          actually does, rather than what a template usually says.
        </p>

        <h2>The service</h2>
        <p>
          The Influence Archive is a free, independently produced editorial publication. It is
          offered for reading and for personal research. No account is required, and nothing on the
          site is sold.
        </p>

        <h2>Editorial content</h2>
        <p>
          The written content of this publication is provided for educational and informational
          purposes. It is written with care and with sources, but it is not a substitute for
          primary scholarship, and readers drawing on it for serious work should follow the
          citations to their sources.
        </p>
        <p>
          Profiles describe people who lived in the past, many of whom are the subject of
          sustained historical criticism. Nothing published here should be read as an endorsement
          of a person&rsquo;s actions, and no such endorsement is intended.
        </p>

        <h2>Images and third-party material</h2>
        <p>
          Portraits, artworks and documents remain the property of their rights holders. Each
          image carries a credit and a licence, and links back to the record of the original where
          one exists. Where material is in the public domain, that is stated.
        </p>

        <h2>Reuse</h2>
        <p>
          Short quotations with attribution and a link are welcome. Longer reproduction requires
          permission from the rights holder. The written text of this publication may be quoted
          for non-commercial purposes with a link back to the profile.
        </p>

        <h2>Availability</h2>
        <p>
          The publication is provided as is. It may be revised, reorganised or withdrawn as
          editorial standards require. No guarantee is given that any particular profile will
          remain available at a particular address.
        </p>

        <h2>Liability</h2>
        <p>
          To the extent permitted by law, the editors of this publication are not liable for
          losses arising from the use of the material published here. Nothing in these terms
          limits rights that cannot lawfully be limited.
        </p>

        <h2>Changes</h2>
        <p>
          These terms may be updated as the publication develops. The version in force is the one
          published on this page. See also the{' '}
          <Link href="/privacy">privacy policy</Link> and the{' '}
          <Link href="/editorial-standards">editorial standards</Link>.
        </p>
      </div>
    </div>
  );
}
