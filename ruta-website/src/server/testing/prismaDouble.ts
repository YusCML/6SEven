import { randomUUID } from 'node:crypto';
import type { UserModel } from '@/generated/prisma/models';

class PrismaErrorDouble extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'PrismaClientKnownRequestError';
    this.code = code;
  }
}

type UserWritableFields = {
  username: string;
  nickname: string | null;
  email: string;
  passwordHash: string | null;
  plaintextPassword: string | null;
  googleId: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
};

export type UserDouble = {
  findUnique(args: { where: { id?: string; email?: string; googleId?: string } }): Promise<UserModel | null>;
  findFirst(args: { where: { username?: string } }): Promise<UserModel | null>;
  findMany(args?: { orderBy?: unknown }): Promise<UserModel[]>;
  create(args: { data: Pick<UserWritableFields, 'username' | 'email'> & Partial<UserWritableFields> }): Promise<UserModel>;
  update(args: { where: { id: string }; data: Partial<UserWritableFields> }): Promise<UserModel>;
};

export function createUserDouble(rows: Map<string, UserModel>): UserDouble {
  const byEmail = (email: string) => [...rows.values()].find((row) => row.email === email) ?? null;
  const byGoogleId = (googleId: string) => [...rows.values()].find((row) => row.googleId === googleId) ?? null;

  return {
    async findUnique({ where }) {
      if (where.id !== undefined) return rows.get(where.id) ?? null;
      if (where.email !== undefined) return byEmail(where.email);
      if (where.googleId !== undefined) return byGoogleId(where.googleId);
      return null;
    },

    async findFirst({ where }) {
      if (where.username === undefined) return null;
      return [...rows.values()].find((row) => row.username === where.username) ?? null;
    },

    async findMany() {
      return [...rows.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },

    async create({ data }) {
      if (byEmail(data.email)) {
        throw new PrismaErrorDouble('P2002', 'Unique constraint failed on the fields: (`email`)');
      }

      if (data.googleId && byGoogleId(data.googleId)) {
        throw new PrismaErrorDouble('P2002', 'Unique constraint failed on the fields: (`googleId`)');
      }

      const now = new Date();
      const row: UserModel = {
        id: randomUUID(),
        nickname: null,
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
      if (!existing) throw new PrismaErrorDouble('P2025', 'An operation failed because it depends on one or more records that were required but not found.');

      if (data.email !== undefined) {
        const clash = byEmail(data.email);
        if (clash && clash.id !== where.id) {
          throw new PrismaErrorDouble('P2002', 'Unique constraint failed on the fields: (`email`)');
        }
      }

      if (data.googleId) {
        const clash = byGoogleId(data.googleId);
        if (clash && clash.id !== where.id) {
          throw new PrismaErrorDouble('P2002', 'Unique constraint failed on the fields: (`googleId`)');
        }
      }

      const updated: UserModel = { ...existing, ...data, updatedAt: new Date() };
      rows.set(where.id, updated);
      return updated;
    },
  };
}
