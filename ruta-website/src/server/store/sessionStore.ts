import { randomUUID } from 'node:crypto';
import { normalizeEmail } from '@/lib/validation';

export type SessionRecord = {
  id: string;
  userId: string | null;
  guestName: string | null;
  createdAt: string;
  expiresAt: string;
};

export type PasswordResetRecord = {
  id: string;
  email: string;
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

function clone<T>(record: T): T {
  return { ...record };
}

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
