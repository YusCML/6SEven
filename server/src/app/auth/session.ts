import { createHash, randomBytes } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createSessionRecord,
  deleteSession,
  deleteSessionsForUser,
  findSession,
  type SessionRecord,
} from '@/server/store/sessionStore';
import { findUserById, toPublicUser, type UserRecord } from '@/server/store/userStore';
import type { SessionPayload } from '@/types/session';
import { appendCookie, serializeCookie } from './cookies';
import { generateGuestName } from './guest';

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

export async function resolveSession(req: NextApiRequest, res: NextApiResponse): Promise<ResolvedSession> {
  const existing = await loadSession(req);

  if (existing) {
    if (!existing.userId) return { session: existing, user: null };

    const user = await findUserById(existing.userId);

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

export async function getSession(req: NextApiRequest): Promise<ResolvedSession | null> {
  const session = await loadSession(req);
  if (!session) return null;

  if (!session.userId) return { session, user: null };

  const user = await findUserById(session.userId);
  return user ? { session, user } : null;
}

export async function getAuthenticatedUser(req: NextApiRequest): Promise<UserRecord | null> {
  const resolved = await getSession(req);
  return resolved?.user ?? null;
}

export async function startUserSession(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
): Promise<SessionRecord> {
  const previous = await loadSession(req);
  if (previous) await deleteSession(previous.id);

  return issueSession(res, { userId, guestName: null, days: AUTH_SESSION_DAYS });
}

export async function endUserSession(req: NextApiRequest, res: NextApiResponse): Promise<SessionRecord> {
  const previous = await loadSession(req);
  if (previous) await deleteSession(previous.id);

  return issueSession(res, { userId: null, guestName: generateGuestName(), days: GUEST_SESSION_DAYS });
}

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
