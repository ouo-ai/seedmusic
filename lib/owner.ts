/**
 * Single source of truth for "who owns this data".
 *
 * Today there is no auth, so every request maps to a fixed anonymous owner and
 * data is effectively global. When Better Auth is added, this is the ONLY place
 * to change: read the session and return the user id. Every API route already
 * scopes its queries by the returned ownerId, so per-user isolation will work
 * with no further changes.
 */
export const ANON_OWNER_ID = "anonymous"

export async function getOwnerId(): Promise<string> {
  // TODO(better-auth): replace with a session lookup, e.g.
  //   const session = await auth.api.getSession({ headers: await headers() })
  //   return session?.user?.id ?? ANON_OWNER_ID
  return ANON_OWNER_ID
}
