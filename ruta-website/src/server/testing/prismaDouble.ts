import { randomUUID } from 'node:crypto';
import type { UserModel } from '@/generated/prisma/models';

/**
 * An in-memory stand-in for `prisma.user`, used by unit tests.
 *
 * Tests cover the service and store logic, not Postgres itself, so they should
 * not need a live database — that would make them slow, order-dependent and
 * unrunnable offline. This double implements only the four operations
 * `userStore` actually calls, and reproduces the two behaviours the code
 * depends on: `P2002` on a duplicate email and `P2025` on a missing row.
 *
 * Integration against real Postgres is a separate concern; see
 * CONTRIBUTING § Testing.
 */

/** Mirrors the shape Prisma throws, which `userStore` inspects by `code`. */
class PrismaErrorDouble extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'PrismaClientKnownRequestError';
    this.code = code;
  }
}

export type UserDouble = {
  findUnique(args: { where: { id?: string; email?: string } }): Promise<UserModel | null>;
  findMany(args?: { orderBy?: unknown }): Promise<UserModel[]>;
  create(args: { data: { username: string; email: string; passwordHash: string; plaintextPassword?: string | null } }): Promise<UserModel>;
  update(args: {
    where: { id: string };
    data: Partial<{ username: string; email: string; passwordHash: string; plaintextPassword: string | null }>;
  }): Promise<UserModel>;
};

export function createUserDouble(rows: Map<string, UserModel>): UserDouble {
  const byEmail = (email: string) => [...rows.values()].find((row) => row.email === email) ?? null;

  return {
    async findUnique({ where }) {
      if (where.id !== undefined) return rows.get(where.id) ?? null;
      if (where.email !== undefined) return byEmail(where.email);
      return null;
    },

    async findMany() {
      return [...rows.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },

    async create({ data }) {
      if (byEmail(data.email)) {
        throw new PrismaErrorDouble('P2002', 'Unique constraint failed on the fields: (`email`)');
      }

      const now = new Date();
      const row: UserModel = { id: randomUUID(), plaintextPassword: null, ...data, createdAt: now, updatedAt: now };

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

      const updated: UserModel = { ...existing, ...data, updatedAt: new Date() };
      rows.set(where.id, updated);
      return updated;
    },
  };
}
