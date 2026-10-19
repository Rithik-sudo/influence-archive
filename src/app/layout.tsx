import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { fontVariables } from '@/lib/fonts';
import { brand } from '@/lib/config';
import '@/styles/globals.css';

/**
 * The canonical origin of the site.
 *
 * `NEXT_PUBLIC_SITE_URL` wins when it is set. Otherwise the origin is taken
 * from the request, so that a site exposed through a proxy — a Tailscale
 * funnel, a load balancer, a preview deployment — still emits correct
 * canonical URLs, Open Graph images and sitemap entries rather than pointing
 * at localhost.
 */
async function resolveSiteUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  try {
    const headerList = await headers();
    const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
    if (host) {
      const proto =
        headerList.get('x-forwarded-proto') ??
        (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  } catch {
    // No request context (a build, or a script): fall through.
  }

  return 'http://localhost:3000';
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await resolveSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${brand.name} — ${brand.tagline}`,
      template: `%s — ${brand.name}`,
    },
    description: brand.description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title: brand.name,
      description: brand.description,
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: brand.name,
      description: brand.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3ed' },
    { media: '(prefers-color-scheme: dark)', color: '#121713' },
  ],
};

/**
 * Applies the saved theme before first paint so the page never flashes the
 * wrong appearance. Kept inline and tiny on purpose.
 */
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )ia-theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):'system';var d=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
