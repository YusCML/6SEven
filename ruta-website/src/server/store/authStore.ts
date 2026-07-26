import { randomUUID } from 'node:crypto';
import { normalizeEmail } from '@/lib/validation';
import { DuplicateEmailError, NotFoundError } from '@/server/errors';

/**
 * In-process storage for users, sessions and reset tokens.
 *
 * There is no database yet. Rows live in module state pinned to `globalThis` so
 * they survive Next.js hot reloads, and are lost when the server restarts.
 *
 * Every function is async even though nothing here awaits: when persistence
 * lands, only this file changes and no call site has to be touched.
 */

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

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

/** The user shape that is safe to send to the browser. */
export type PublicUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

type Tables = {
  users: Map<string, UserRecord>;
  sessions: Map<string, SessionRecord>;
  passwordResets: Map<string, PasswordResetRecord>;
};

declare global {
  var __rutaAuthTables: Tables | undefined;
}

function tables(): Tables {
  if (!globalThis.__rutaAuthTables) {
    globalThis.__rutaAuthTables = {
      users: new Map(),
      sessions: new Map(),
      passwordResets: new Map(),
    };
  }

  return globalThis.__rutaAuthTables;
}

/** Hand back copies so callers cannot mutate stored rows by reference. */
function clone<T>(record: T): T {
  return { ...record };
}

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* -------------------------------------------------------------------------- */

export async function findUserById(id: string): Promise<UserRecord | null> {
  const user = tables().users.get(id);
  return user ? clone(user) : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const target = normalizeEmail(email);

  for (const user of tables().users.values()) {
    if (user.email === target) return clone(user);
  }

  return null;
}

export async function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const email = normalizeEmail(input.email);

  for (const existing of tables().users.values()) {
    if (existing.email === email) throw new DuplicateEmailError();
  }

  const now = new Date().toISOString();
  const user: UserRecord = {
    id: randomUUID(),
    username: input.username,
    email,
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  tables().users.set(user.id, user);
  return clone(user);
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<UserRecord, 'username' | 'email' | 'passwordHash'>>,
): Promise<UserRecord> {
  const existing = tables().users.get(id);

  if (!existing) throw new NotFoundError('User not found.');

  if (patch.email !== undefined) {
    const email = normalizeEmail(patch.email);

    for (const other of tables().users.values()) {
      if (other.id !== id && other.email === email) throw new DuplicateEmailError();
    }
  }

  const updated: UserRecord = {
    ...existing,
    ...patch,
    email: patch.email !== undefined ? normalizeEmail(patch.email) : existing.email,
    updatedAt: new Date().toISOString(),
  };

  tables().users.set(id, updated);
  return clone(updated);
}

export async function listUsers(): Promise<UserRecord[]> {
  return [...tables().users.values()]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(clone);
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
