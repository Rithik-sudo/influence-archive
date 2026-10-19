'use server';

import { redirect } from 'next/navigation';
import { getRandomPublishedPerson } from '@/server/queries/people';

/**
 * "Discover someone" — sends the reader to a randomly chosen published
 * profile. Only published profiles are eligible, because the query runs under
 * the anonymous role and row level security removes drafts.
 */
export async function discoverAction(): Promise<void> {
  const person = await getRandomPublishedPerson();
  if (person) {
    redirect(`/people/${person.slug}`);
  }
  redirect('/explore');
}
