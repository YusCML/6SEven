import { createHash, randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { createSessionRecord, deleteSession, findSession, type SessionRecord } from '@/repositories/sessionStore';
import { findUserById, toPublicUser, type UserRecord } from '@/repositories/userStore';
import type { SessionPayload } from '@shared/types/session';

const SESSION_COOKIE_NAME = 'ruta_session';
const TOKEN_BYTES = 32;
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

const isProduction = process.env.NODE_ENV === 'production';

export type ResolvedSession = {
  session: SessionRecord;
  user: UserRecord | null;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function readToken(req: Request): string | null {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  return token && token.trim() ? token : null;
}

async function loadSession(req: Request): Promise<SessionRecord | null> {
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

async function issueSession(res: Response, userId: string | null): Promise<SessionRecord> {
  const token = randomBytes(TOKEN_BYTES).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_MS).toISOString();

  const session = await createSessionRecord({ id: hashToken(token), userId, expiresAt });

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: SESSION_MS,
  });

  return session;
}

async function replaceSession(req: Request, res: Response, userId: string | null): Promise<SessionRecord> {
  const previous = await loadSession(req);
  if (previous) await deleteSession(previous.id);

  return issueSession(res, userId);
}

export async function getSession(req: Request): Promise<ResolvedSession | null> {
  const session = await loadSession(req);
  if (!session) return null;
  if (!session.userId) return { session, user: null };

  const user = await findUserById(session.userId);
  if (user) return { session, user };

  await deleteSession(session.id);

  return null;
}

export async function resolveSession(req: Request, res: Response): Promise<ResolvedSession> {
  const existing = await getSession(req);
  if (existing) return existing;

  return { session: await issueSession(res, null), user: null };
}

export function startUserSession(req: Request, res: Response, userId: string): Promise<SessionRecord> {
  return replaceSession(req, res, userId);
}

export function endUserSession(req: Request, res: Response): Promise<SessionRecord> {
  return replaceSession(req, res, null);
}

export function toSessionPayload({ user }: ResolvedSession): SessionPayload {
  return user ? { status: 'authenticated', user: toPublicUser(user) } : { status: 'guest', user: null };
}
