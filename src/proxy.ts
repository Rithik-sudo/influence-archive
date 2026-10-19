import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'ia_session';

/**
 * An optimistic check only.
 *
 * The proxy runs before rendering, so it can cheaply notice that a request to
 * /admin has no session cookie at all and send it to the sign-in page. It does
 * NOT verify the session: that happens in `requireEditor`, which every admin
 * page and every mutation calls, and which the database enforces.
 *
 * Never rely on this file for authorisation.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
