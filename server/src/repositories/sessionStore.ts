export type SessionRecord = {
  id: string;
  userId: string | null;
  createdAt: string;
  expiresAt: string;
};

const sessions = new Map<string, SessionRecord>();

function clone<T>(record: T): T {
  return { ...record };
}

export async function findSession(id: string): Promise<SessionRecord | null> {
  const session = sessions.get(id);
  return session ? clone(session) : null;
}

export async function createSessionRecord(input: {
  id: string;
  userId: string | null;
  expiresAt: string;
}): Promise<SessionRecord> {
  const session: SessionRecord = {
    id: input.id,
    userId: input.userId,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
  };

  sessions.set(session.id, session);
  return clone(session);
}

export async function deleteSession(id: string): Promise<void> {
  sessions.delete(id);
}

export async function deleteSessionsForUser(userId: string): Promise<void> {
    for (const [id, session] of sessions) {
    if (session.userId === userId) sessions.delete(id);
  }
}
