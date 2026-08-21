import { randomUUID } from 'node:crypto';
import type { UserModel } from '@/generated/prisma/models';

class PrismaErrorDouble extends Error {
  readonly code: string;
  readonly meta: { target: string[] };

  constructor(code: string, message: string, target: string[] = []) {
    super(message);
    this.name = 'PrismaClientKnownRequestError';
    this.code = code;
    this.meta = { target };
  }
}

function uniqueViolation(field: string): PrismaErrorDouble {
  return new PrismaErrorDouble('P2002', `Unique constraint failed on the fields: (\`${field}\`)`, [field]);
}

type UserWritableFields = {
  username: string;
  nickname: string | null;
  email: string | null;
  passwordHash: string | null;
  plaintextPassword: string | null;
  googleId: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
};

type StringFilter = string | { equals?: string; mode?: 'default' | 'insensitive' };

export type UserDouble = {
  findUnique(args: { where: { id?: string; email?: string; googleId?: string } }): Promise<UserModel | null>;
  findFirst(args: { where: { username?: StringFilter } }): Promise<UserModel | null>;
  findMany(args?: { orderBy?: unknown }): Promise<UserModel[]>;
  create(args: { data: Pick<UserWritableFields, 'username'> & Partial<UserWritableFields> }): Promise<UserModel>;
  update(args: { where: { id: string }; data: Partial<UserWritableFields> }): Promise<UserModel>;
};

export function createUserDouble(rows: Map<string, UserModel>): UserDouble {
  const byEmail = (email: string) => [...rows.values()].find((row) => row.email !== null && row.email === email) ?? null;
  const byGoogleId = (googleId: string) => [...rows.values()].find((row) => row.googleId === googleId) ?? null;

  const byUsername = (filter: StringFilter) => {
    const wanted = typeof filter === 'string' ? filter : (filter.equals ?? '');
    const insensitive = typeof filter !== 'string' && filter.mode === 'insensitive';

    if (!wanted) return null;

    return (
      [...rows.values()].find((row) =>
        insensitive ? row.username.toLowerCase() === wanted.toLowerCase() : row.username === wanted,
      ) ?? null
    );
  };

  // The real column is unique and case-sensitive, but the app rejects
  // case-variant usernames before it gets that far, so the double matches
  // insensitively to keep the two in step.
  const usernameTaken = (username: string, exceptId?: string) => {
    const clash = byUsername({ equals: username, mode: 'insensitive' });
    return clash !== null && clash.id !== exceptId;
  };

  return {
    async findUnique({ where }) {
      if (where.id !== undefined) return rows.get(where.id) ?? null;
      if (where.email !== undefined) return byEmail(where.email);
      if (where.googleId !== undefined) return byGoogleId(where.googleId);
      return null;
    },

    async findFirst({ where }) {
      if (where.username === undefined) return null;
      return byUsername(where.username);
    },

    async findMany() {
      return [...rows.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },

    async create({ data }) {
      if (usernameTaken(data.username)) throw uniqueViolation('username');
      if (data.email && byEmail(data.email)) throw uniqueViolation('email');
      if (data.googleId && byGoogleId(data.googleId)) throw uniqueViolation('googleId');

      const now = new Date();
      const row: UserModel = {
        id: randomUUID(),
        nickname: null,
        email: null,
        passwordHash: null,
        plaintextPassword: null,
        googleId: null,
        avatarUrl: null,
        emailVerified: false,
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      rows.set(row.id, row);
      return row;
    },

    async update({ where, data }) {
      const existing = rows.get(where.id);
      if (!existing) {
        throw new PrismaErrorDouble(
          'P2025',
          'An operation failed because it depends on one or more records that were required but not found.',
        );
      }

      if (data.username !== undefined && usernameTaken(data.username, where.id)) {
        throw uniqueViolation('username');
      }

      if (data.email) {
        const clash = byEmail(data.email);
        if (clash && clash.id !== where.id) throw uniqueViolation('email');
      }

      if (data.googleId) {
        const clash = byGoogleId(data.googleId);
        if (clash && clash.id !== where.id) throw uniqueViolation('googleId');
      }

      const updated: UserModel = { ...existing, ...data, updatedAt: new Date() };
      rows.set(where.id, updated);
      return updated;
    },
  };
}
