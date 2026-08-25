import { randomUUID } from 'node:crypto';

export type SessionRecord = {
  id: string;
  userId: string | null;
  guestName: string | null;
  createdAt: string;
  expiresAt: string;
};

type Tables = {
  sessions: Map<string, SessionRecord>;
};

declare global {
  var __rutaSessionTables: Tables | undefined;
}

function tables(): Tables {
  globalThis.__rutaSessionTables ??= { sessions: new Map() };

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
