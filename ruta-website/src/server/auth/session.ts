import { createHash, randomBytes } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createSessionRecord,
  deleteSession,
  deleteSessionsForUser,
  findSession,
  findUserById,
  toPublicUser,
  type SessionRecord,
  type UserRecord,
} from '@/server/store/authStore';
import type { SessionPayload } from '@/types/session';
import { appendCookie, serializeCookie } from './cookies';
import { generateGuestName } from './guest';

/**
 * Opaque cookie sessions.
 *
 * The browser holds a random 32-byte token; the store only ever sees its
 * SHA-256. A leaked store therefore cannot be replayed as a login. The cookie
 * is HttpOnly (no JS access), SameSite=Lax (not sent on cross-site POSTs), and
 * Secure outside development.
 */

export const SESSION_COOKIE_NAME = 'ruta_session';

const TOKEN_BYTES = 32;
const AUTH_SESSION_DAYS = 30;
const GUEST_SESSION_DAYS = 30;
const DAY_IN_SECONDS = 60 * 60 * 24;

const isProduction = process.env.NODE_ENV === 'production';

export type ResolvedSession = {
  session: SessionRecord;
  user: UserRecord | null;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function expiryFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_IN_SECONDS * 1000).toISOString();
}

function writeSessionCookie(res: NextApiResponse, token: string, expiresAt: string) {
  const maxAge = Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000));

  appendCookie(
    res,
    serializeCookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge,
      expires: new Date(expiresAt),
    }),
  );
}

export function clearSessionCookie(res: NextApiResponse) {
  appendCookie(
    res,
    serializeCookie(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    }),
  );
}

function readToken(req: NextApiRequest): string | null {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  return token && token.trim() ? token : null;
}

/** Loads the session behind the request cookie, dropping it if it has expired. */
async function loadSession(req: NextApiRequest): Promise<SessionRecord | null> {
  const token = readToken(req);
  if (!token) return null;

  const session = await findSession(hashToken(token));
  if (!session) return null;

  if (Date.parse(session.expiresAt) <= Date.now()) {
    await deleteSession(session.id);
    return null;
  }

  return session;
}

async function issueSession(
  res: NextApiResponse,
  input: { userId: string | null; guestName: string | null; days: number },
): Promise<SessionRecord> {
  const token = randomBytes(TOKEN_BYTES).toString('base64url');
  const expiresAt = expiryFromNow(input.days);

  const session = await createSessionRecord({
    id: hashToken(token),
    userId: input.userId,
    guestName: input.guestName,
    expiresAt,
  });

  writeSessionCookie(res, token, expiresAt);
  return session;
}

/**
 * Returns the current session, creating a guest one when the visitor has none.
 * Nobody browses without a session — guests just have `userId: null`.
 */
export async function resolveSession(req: NextApiRequest, res: NextApiResponse): Promise<ResolvedSession> {
  const existing = await loadSession(req);

  if (existing) {
    if (!existing.userId) return { session: existing, user: null };

    const user = await findUserById(existing.userId);

    // The user row is gone — fall through and hand back a fresh guest session.
    if (user) return { session: existing, user };

    await deleteSession(existing.id);
  }

  const session = await issueSession(res, {
    userId: null,
    guestName: generateGuestName(),
    days: GUEST_SESSION_DAYS,
  });

  return { session, user: null };
}

/** Reads the session without creating one. Use for guards that must not mutate state. */
export async function getSession(req: NextApiRequest): Promise<ResolvedSession | null> {
  const session = await loadSession(req);
  if (!session) return null;

  if (!session.userId) return { session, user: null };

  const user = await findUserById(session.userId);
  return user ? { session, user } : null;
}

/** Returns the signed-in user, or null for guests and anonymous requests. */
export async function getAuthenticatedUser(req: NextApiRequest): Promise<UserRecord | null> {
  const resolved = await getSession(req);
  return resolved?.user ?? null;
}

/**
 * Signs a user in. The previous (guest) session id is discarded and a brand new
 * token is issued, so a fixated cookie cannot survive the privilege change.
 */
export async function startUserSession(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
): Promise<SessionRecord> {
  const previous = await loadSession(req);
  if (previous) await deleteSession(previous.id);

  return issueSession(res, { userId, guestName: null, days: AUTH_SESSION_DAYS });
}

/**
 * Signs out. The authenticated session is destroyed server-side and replaced by
 * a fresh guest session, so the visitor keeps browsing without being logged in.
 */
export async function endUserSession(req: NextApiRequest, res: NextApiResponse): Promise<SessionRecord> {
  const previous = await loadSession(req);
  if (previous) await deleteSession(previous.id);

  return issueSession(res, { userId: null, guestName: generateGuestName(), days: GUEST_SESSION_DAYS });
}

/** Invalidates every session of a user — used after a password change. */
export async function revokeAllUserSessions(userId: string) {
  await deleteSessionsForUser(userId);
}

export function toSessionPayload({ session, user }: ResolvedSession): SessionPayload {
  if (user) {
    return {
      status: 'authenticated',
      user: toPublicUser(user),
      guest: null,
      expiresAt: session.expiresAt,
    };
  }

  return {
    status: 'guest',
    user: null,
    guest: { name: session.guestName ?? 'Guest' },
    expiresAt: session.expiresAt,
  };
}
