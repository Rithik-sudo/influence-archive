import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What the Influence Archive collects, why, and what it does not collect.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[68ch] px-5 py-10 sm:px-8 sm:py-16">
      <p className="eyebrow">Policy</p>
      <h1 className="mt-3 text-title font-semibold text-ink">Privacy</h1>

      <div className="prose mt-10">
        <p>
          This policy describes the practices the archive actually implements. It is written for a
          publication that has no reader accounts, no advertising and no analytics — because the
          archive has none of those things.
        </p>

        <h2>What is collected</h2>
        <p>
          The site sets one cookie for a reader: a theme preference, which records whether the
          light or dark appearance was chosen. It is not an identifier and is not used to track
          anyone.
        </p>
        <p>
          Editors and administrators sign in, and their account holds an email address, a
          display name and a hashed password. Signing in creates a session record with an
          expiry. Session cookies are marked HttpOnly and are never readable from scripts.
        </p>

        <h2>What is not collected</h2>
        <ul>
          <li>No analytics or tracking scripts of any kind.</li>
          <li>No advertising, and no third-party advertising identifiers.</li>
          <li>No reader accounts, and no reader profiles, bookmarks or reading history.</li>
          <li>No social widgets, embedded players or third-party iframes.</li>
          <li>No contact or newsletter list.</li>
        </ul>
        <p>
          The server does write ordinary access logs, which may include an IP address. These are
          the hosting provider&rsquo;s operational logs and are not used to build a profile of any
          visitor.
        </p>

        <h2>Embedded content</h2>
        <p>
          Portraits and documents are served from this site rather than hotlinked, so viewing a
          profile does not tell a third-party server that you did so. Where an image is shown, the
          credit and licence are recorded against it, and the original can be reached from the
          source link.
        </p>

        <h2>Cookies</h2>
        <p>
          The theme cookie is strictly functional and is stored for a year. The session cookie for
          an editor is stored for the duration of the session and is deleted on sign-out. No
          advertising or tracking cookies are set.
        </p>

        <h2>Third parties</h2>
        <p>
          Fonts are self-hosted and served from this domain, so no request reaches a font
          provider. The site is served over HTTPS. Where the archive is hosted on managed
          infrastructure, the hosting provider processes requests in order to deliver them.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can be raised through the contact address given in the
          footer. See also the <Link href="/terms">terms of use</Link> and the{' '}
          <Link href="/editorial-standards">editorial standards</Link>.
        </p>
      </div>
    </div>
  );
}
