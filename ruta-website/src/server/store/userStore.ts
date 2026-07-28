import type { UserModel } from '@/generated/prisma/models';
import { normalizeEmail } from '@/lib/validation';
import { prisma } from '@/server/db/prisma';
import { DuplicateEmailError, NotFoundError } from '@/server/errors';

/**
 * Accounts, persisted in Postgres.
 *
 * This module is the only place that talks to `prisma.user`. Everything above it
 * works with `UserRecord`, so the rest of the app never imports a Prisma type
 * and swapping the database again would touch this file alone.
 */

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  /**
   * ⚠️ Classroom demonstration only — the password as typed. Never read by
   * authentication; login verifies against `passwordHash`. See the schema
   * comment on `User.plaintextPassword` for how to remove it.
   */
  plaintextPassword: string | null;
  createdAt: string;
  updatedAt: string;
};

/** The user shape that is safe to send to the browser — no password hash. */
export type PublicUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

/** Postgres returns Date objects; the app passes ISO strings over the wire. */
function toRecord(user: UserModel): UserRecord {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    passwordHash: user.passwordHash,
    plaintextPassword: user.plaintextPassword,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

/** Prisma's code for a unique-constraint violation — here, a taken email. */
function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002';
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toRecord(user) : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
  return user ? toRecord(user) : null;
}

export async function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
  /** ⚠️ Demonstration only — see the note on `UserRecord`. */
  plaintextPassword?: string;
}): Promise<UserRecord> {
  try {
    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: normalizeEmail(input.email),
        passwordHash: input.passwordHash,
        plaintextPassword: input.plaintextPassword ?? null,
      },
    });

    return toRecord(user);
  } catch (error) {
    // The unique index is the real guard — checking first would still race.
    if (isUniqueViolation(error)) throw new DuplicateEmailError();
    throw error;
  }
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<UserRecord, 'username' | 'email' | 'passwordHash' | 'plaintextPassword'>>,
): Promise<UserRecord> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(patch.username !== undefined ? { username: patch.username } : {}),
        ...(patch.email !== undefined ? { email: normalizeEmail(patch.email) } : {}),
        ...(patch.passwordHash !== undefined ? { passwordHash: patch.passwordHash } : {}),
        ...(patch.plaintextPassword !== undefined ? { plaintextPassword: patch.plaintextPassword } : {}),
      },
    });

    return toRecord(user);
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateEmailError();
    // P2025 — update targeted a row that does not exist.
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      throw new NotFoundError('User not found.');
    }
    throw error;
  }
}

export async function listUsers(): Promise<UserRecord[]> {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return users.map(toRecord);
}
