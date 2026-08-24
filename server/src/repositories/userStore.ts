import type { UserModel } from '@/generated/prisma/models';
import { normalizeEmail, normalizeNickname, normalizeUsername } from '@/lib/validation';
import { prisma } from '@/db/prisma';
import { DomainError, DuplicateEmailError, DuplicateUsernameError, NotFoundError } from '@/errors';

export type UserRecord = {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  passwordHash: string | null;
  plaintextPassword: string | null;
  googleId: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  googleLinked: boolean;
  avatarUrl: string | null;
  createdAt: string;
};

function toRecord(user: UserModel): UserRecord {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    passwordHash: user.passwordHash,
    plaintextPassword: user.plaintextPassword,
    googleId: user.googleId,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    googleLinked: user.googleId !== null,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002';
}

function conflictingField(error: unknown): string {
  const target = (error as { meta?: { target?: unknown } } | null)?.meta?.target;

  if (Array.isArray(target)) return target.join(',');
  if (typeof target === 'string') return target;

  return '';
}

function duplicateErrorFor(error: unknown): DomainError {
  return conflictingField(error).includes('username') ? new DuplicateUsernameError() : new DuplicateEmailError();
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toRecord(user) : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  return user ? toRecord(user) : null;
}

export async function findUserByGoogleId(googleId: string): Promise<UserRecord | null> {
  if (!googleId) return null;

  const user = await prisma.user.findUnique({ where: { googleId } });
  return user ? toRecord(user) : null;
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  const user = await prisma.user.findFirst({
    where: { username: { equals: normalized, mode: 'insensitive' } },
  });

  return user ? toRecord(user) : null;
}

export async function createUser(input: {
  username: string;
  nickname?: string | null;
  email?: string | null;
  passwordHash?: string | null;
  plaintextPassword?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
}): Promise<UserRecord> {
  try {
    const user = await prisma.user.create({
      data: {
        username: input.username,
        nickname: input.nickname ? normalizeNickname(input.nickname) : null,
        email: input.email ? normalizeEmail(input.email) : null,
        passwordHash: input.passwordHash ?? null,
        plaintextPassword: input.plaintextPassword ?? null,
        googleId: input.googleId ?? null,
        avatarUrl: input.avatarUrl ?? null,
        emailVerified: input.emailVerified ?? false,
      },
    });

    return toRecord(user);
  } catch (error) {
    if (isUniqueViolation(error)) throw duplicateErrorFor(error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  patch: Partial<
    Pick<
      UserRecord,
      | 'username'
      | 'nickname'
      | 'email'
      | 'passwordHash'
      | 'plaintextPassword'
      | 'googleId'
      | 'avatarUrl'
      | 'emailVerified'
    >
  >,
): Promise<UserRecord> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(patch.username !== undefined ? { username: patch.username } : {}),
        ...(patch.nickname !== undefined
          ? { nickname: patch.nickname ? normalizeNickname(patch.nickname) : null }
          : {}),
        ...(patch.email !== undefined ? { email: patch.email ? normalizeEmail(patch.email) : null } : {}),
        ...(patch.passwordHash !== undefined ? { passwordHash: patch.passwordHash } : {}),
        ...(patch.plaintextPassword !== undefined ? { plaintextPassword: patch.plaintextPassword } : {}),
        ...(patch.googleId !== undefined ? { googleId: patch.googleId } : {}),
        ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl } : {}),
        ...(patch.emailVerified !== undefined ? { emailVerified: patch.emailVerified } : {}),
      },
    });

    return toRecord(user);
  } catch (error) {
    if (isUniqueViolation(error)) throw duplicateErrorFor(error);
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
