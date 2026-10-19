import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { brand } from '@/lib/config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    type: 'website',
    siteName: brand.name,
    title: brand.name,
    description: brand.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.name,
    description: brand.description,
  },
};

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
