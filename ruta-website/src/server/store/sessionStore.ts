import { randomUUID } from 'node:crypto';
import { normalizeEmail } from '@/lib/validation';

/**
 * Sessions and password-reset tokens, held in process memory.
 *
 * Accounts live in Postgres (see `userStore.ts`), but sessions do not yet — so
 * a server restart signs everyone out while their account survives. Moving
 * these to the database is a follow-up; every function here is already async,
 * so that change would not reach any call site.
 *
 * Rows are pinned to `globalThis` to survive Next.js hot reloads in development.
 */

export type SessionRecord = {
  /** SHA-256 of the token held by the browser — the raw token is never stored. */
  id: string;
  /** Null for guest sessions. */
  userId: string | null;
  /** Display name for guest sessions, e.g. `User4f9c2a`. Null once signed in. */
  guestName: string | null;
  createdAt: string;
  expiresAt: string;
};

export type PasswordResetRecord = {
  id: string;
  email: string;
  /** SHA-256 of the reset token — same rule as sessions. */
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  consumedAt: string | null;
};

type Tables = {
  sessions: Map<string, SessionRecord>;
  passwordResets: Map<string, PasswordResetRecord>;
};

declare global {
  var __rutaSessionTables: Tables | undefined;
}

function tables(): Tables {
  globalThis.__rutaSessionTables ??= {
    sessions: new Map(),
    passwordResets: new Map(),
  };

  return globalThis.__rutaSessionTables;
}

/** Hand back copies so callers cannot mutate stored rows by reference. */
function clone<T>(record: T): T {
  return { ...record };
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                   */
/* -------------------------------------------------------------------------- */

export async function findSession(id: string): Promise<SessionRecord | null> {
  const session = tables().sessions.get(id);
  return session ? clone(session) : null;
}

export async function createSessionRecord(input: {
  id: string;
  userId: string | null;
  guestName: string | null;
  expiresAt: string;
}): Promise<SessionRecord> {
  const session: SessionRecord = {
    id: input.id,
    userId: input.userId,
    guestName: input.guestName,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
  };

  tables().sessions.set(session.id, session);
  return clone(session);
}

export async function deleteSession(id: string): Promise<void> {
  tables().sessions.delete(id);
}

/** Invalidates every session of a user — used after a password change. */
export async function deleteSessionsForUser(userId: string): Promise<void> {
  const { sessions } = tables();

  for (const [id, session] of sessions) {
    if (session.userId === userId) sessions.delete(id);
  }
}

export async function deleteExpiredSessions(now = new Date().toISOString()): Promise<void> {
  const { sessions } = tables();

  for (const [id, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(id);
  }
}

/* -------------------------------------------------------------------------- */
/* Password resets                                                            */
/* -------------------------------------------------------------------------- */

export async function createPasswordReset(input: {
  email: string;
  tokenHash: string;
  expiresAt: string;
}): Promise<PasswordResetRecord> {
  const record: PasswordResetRecord = {
    id: randomUUID(),
    email: normalizeEmail(input.email),
    tokenHash: input.tokenHash,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
    consumedAt: null,
  };

  tables().passwordResets.set(record.id, record);
  return clone(record);
}

export async function findPasswordResetByTokenHash(tokenHash: string): Promise<PasswordResetRecord | null> {
  for (const record of tables().passwordResets.values()) {
    if (record.tokenHash === tokenHash) return clone(record);
  }

  return null;
}

export async function consumePasswordReset(id: string): Promise<void> {
  const { passwordResets } = tables();
  const record = passwordResets.get(id);

  if (record) passwordResets.set(id, { ...record, consumedAt: new Date().toISOString() });
}

export async function deletePasswordResetsForEmail(email: string): Promise<void> {
  const { passwordResets } = tables();
  const target = normalizeEmail(email);

  for (const [id, record] of passwordResets) {
    if (record.email === target) passwordResets.delete(id);
  }
}
