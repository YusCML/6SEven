import type { UserModel } from '@/generated/prisma/models';
import { normalizeEmail, normalizeNickname } from '@/lib/validation';
import { prisma } from '@/db/prisma';
import { DuplicateEmailError, NotFoundError } from '@/errors';

export type UserRecord = {
  id: string;
  username: string;
  nickname: string | null;
  email: string;
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
  email: string;
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
    createdAt: user.createdAt,
  };
}

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

export async function findUserByGoogleId(googleId: string): Promise<UserRecord | null> {
  if (!googleId) return null;

  const user = await prisma.user.findUnique({ where: { googleId } });
  return user ? toRecord(user) : null;
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  if (!username) return null;

  const user = await prisma.user.findFirst({ where: { username } });
  return user ? toRecord(user) : null;
}

export async function createUser(input: {
  username: string;
  nickname?: string | null;
  email: string;
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
        email: normalizeEmail(input.email),
        passwordHash: input.passwordHash ?? null,
        plaintextPassword: input.plaintextPassword ?? null,
        googleId: input.googleId ?? null,
        avatarUrl: input.avatarUrl ?? null,
        emailVerified: input.emailVerified ?? false,
      },
    });

    return toRecord(user);
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateEmailError();
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
        ...(patch.email !== undefined ? { email: normalizeEmail(patch.email) } : {}),
        ...(patch.passwordHash !== undefined ? { passwordHash: patch.passwordHash } : {}),
        ...(patch.plaintextPassword !== undefined ? { plaintextPassword: patch.plaintextPassword } : {}),
        ...(patch.googleId !== undefined ? { googleId: patch.googleId } : {}),
        ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl } : {}),
        ...(patch.emailVerified !== undefined ? { emailVerified: patch.emailVerified } : {}),
      },
    });

    return toRecord(user);
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateEmailError();
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
